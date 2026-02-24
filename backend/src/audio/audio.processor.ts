import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import * as fs from 'fs/promises';

import { AudioService } from './audio.service';

type ProcessAudioJob = {
  jobId: string;
  filePath: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string | null;
};

@Injectable()
export class AudioProcessor implements OnModuleInit, OnModuleDestroy {
  private queue!: Queue<ProcessAudioJob>;
  private worker!: Worker<ProcessAudioJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly audioService: AudioService,
  ) { }

  onModuleInit() {
    const host = process.env.REDIS_HOST || 'redis';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const connection = new IORedis({ host, port, maxRetriesPerRequest: null });

    this.queue = new Queue<ProcessAudioJob>('process-audio', { connection });

    this.worker = new Worker<ProcessAudioJob>(
      'process-audio',
      async (job) => this.handle(job.data),
      { connection, concurrency: 5 },
    );

    this.worker.on('failed', async (job, err) => {
      if (!job) return;
      await this.audioService.updateJob(job.data.jobId, {
        status: 'failed',
        error: err?.message || 'job failed',
      });
    });
  }

  async onModuleDestroy() {
    if (this.worker) await this.worker.close();
    if (this.queue) await this.queue.close();
  }

  async enqueue(data: ProcessAudioJob) {
    await this.queue.add('process', data, { jobId: data.jobId });
  }

  private async handle(data: ProcessAudioJob) {
    await this.audioService.updateJob(data.jobId, { status: 'processing', error: null });

    const audioServiceUrl = this.config.get<string>('audioServiceUrl') || process.env.AUDIO_SERVICE_URL;
    if (!audioServiceUrl) {
      throw new Error('AUDIO_SERVICE_URL not configured');
    }

    const bytes = await fs.readFile(data.filePath);
    const form = new FormData();
    form.append('file', new Blob([bytes]), data.originalFilename || 'audio');

    // 1. Analyze Audio (extract features)
    const analyzeResp = await fetch(`${audioServiceUrl.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      body: form,
    });
    if (!analyzeResp.ok) {
      const text = await analyzeResp.text();
      throw new Error(`audio-service analyze failed (${analyzeResp.status}): ${text}`);
    }

    const analysis = (await analyzeResp.json()) as {
      sha256_hash: string;
      fingerprint?: string | null;
      embedding: number[];
    };

    // LAYER 1: SHA-256 Exact Match
    const exactMatch = await this.audioService.findBySha256(analysis.sha256_hash);
    if (exactMatch) {
      await this.audioService.logDuplicate({
        originalAudioId: exactMatch.id,
        duplicateFilename: data.originalFilename,
        duplicateSha256: analysis.sha256_hash,
        similarityScore: 1,
        detectionMethod: 'sha256_hash',
        detectionDetails: { sha256: analysis.sha256_hash },
        uploadedBy: data.uploadedBy,
      });
      await this.audioService.updateJob(data.jobId, {
        status: 'done',
        result: {
          isDuplicate: true,
          method: 'sha256_hash',
          similarity: 1,
          originalAudioId: exactMatch.id,
        },
      });
      return;
    }

    // LAYER 2 & 3: Perceptual Similarity (Embedding check)
    // For now, we fetch candidates and use the Python service for batch comparison
    const candidates = await this.audioService.getAllEmbeddings();
    if (candidates.length > 0) {
      const threshold = this.config.get<number>('thresholds.embedding') || 0.92;
      const compareResp = await fetch(`${audioServiceUrl.replace(/\/$/, '')}/compare-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_embedding: analysis.embedding,
          candidates: candidates.map((c) => ({ id: c.id, embedding: c.audioEmbedding })),
          threshold,
        }),
      });

      if (compareResp.ok) {
        const { matches } = (await compareResp.json()) as { matches: any[] };
        if (matches && matches.length > 0) {
          const topMatch = matches[0];
          await this.audioService.logDuplicate({
            originalAudioId: topMatch.id,
            duplicateFilename: data.originalFilename,
            duplicateSha256: analysis.sha256_hash,
            similarityScore: topMatch.score,
            detectionMethod: topMatch.method,
            detectionDetails: { score: topMatch.score },
            uploadedBy: data.uploadedBy,
          });
          await this.audioService.updateJob(data.jobId, {
            status: 'done',
            result: {
              isDuplicate: true,
              method: topMatch.method,
              similarity: topMatch.score,
              originalAudioId: topMatch.id,
            },
          });
          return;
        }
      }
    }

    // No duplicate found: Save the file
    const created = await this.audioService.saveAudio({
      originalFilename: data.originalFilename,
      storagePath: data.filePath,
      storageBucket: 'local',
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      sha256Hash: analysis.sha256_hash,
      chromaprintFp: analysis.fingerprint ?? null,
      audioEmbedding: Array.isArray(analysis.embedding) ? analysis.embedding : null,
      uploadedBy: data.uploadedBy,
    });

    await this.audioService.updateJob(data.jobId, {
      status: 'done',
      result: { isDuplicate: false, audioId: created.id },
    });
  }
}

