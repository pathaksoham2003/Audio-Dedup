import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AudioFile } from './entities/audio-file.entity';
import { DuplicateLog } from './entities/duplicate-log.entity';
import { UploadJob } from './entities/upload-job.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioFile) private readonly audioRepo: Repository<AudioFile>,
    @InjectRepository(DuplicateLog) private readonly dupeRepo: Repository<DuplicateLog>,
    @InjectRepository(UploadJob) private readonly jobRepo: Repository<UploadJob>,
  ) { }

  async listAudios() {
    return this.audioRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async listDuplicates() {
    return this.dupeRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async duplicateStats() {
    const total = await this.dupeRepo.count();
    const byMethod = await this.dupeRepo
      .createQueryBuilder('d')
      .select('d.detectionMethod', 'method')
      .addSelect('COUNT(*)', 'count')
      .groupBy('d.detectionMethod')
      .getRawMany<{ method: string; count: string }>();

    return {
      total,
      byMethod: byMethod.map((x) => ({ method: x.method, count: Number(x.count) })),
    };
  }

  async getAudio(id: string) {
    const audio = await this.audioRepo.findOne({ where: { id } });
    if (!audio) throw new NotFoundException('Audio not found');
    return audio;
  }

  async getJob(jobId: string) {
    const job = await this.jobRepo.findOne({ where: { jobId } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async createJob(jobId: string, uploadedBy?: string) {
    const job = this.jobRepo.create({
      jobId,
      status: 'pending',
      uploadedBy: uploadedBy ?? null,
      result: null,
      error: null,
    });
    return this.jobRepo.save(job);
  }

  async updateJob(jobId: string, patch: Partial<UploadJob>) {
    const job = await this.getJob(jobId);
    Object.assign(job, patch);
    return this.jobRepo.save(job);
  }

  async findBySha256(sha256Hash: string) {
    return this.audioRepo.findOne({ where: { sha256Hash } });
  }

  async logDuplicate(params: {
    originalAudioId?: string | null;
    duplicateFilename: string;
    duplicateSha256?: string | null;
    similarityScore: number;
    detectionMethod: string;
    detectionDetails?: Record<string, unknown> | null;
    uploadedBy?: string | null;
  }) {
    const log = this.dupeRepo.create({
      originalAudioId: params.originalAudioId ?? null,
      duplicateFilename: params.duplicateFilename,
      duplicateSha256: params.duplicateSha256 ?? null,
      similarityScore: params.similarityScore,
      detectionMethod: params.detectionMethod,
      detectionDetails: params.detectionDetails ?? null,
      uploadedBy: params.uploadedBy ?? null,
      emailSent: false,
    });
    return this.dupeRepo.save(log);
  }

  async saveAudio(params: {
    originalFilename: string;
    storagePath: string;
    storageBucket?: string;
    fileSize: number;
    mimeType: string;
    sha256Hash: string;
    chromaprintFp?: string | null;
    audioEmbedding?: number[] | null;
    uploadedBy?: string | null;
  }) {
    const audio = this.audioRepo.create({
      originalFilename: params.originalFilename,
      storagePath: params.storagePath,
      storageBucket: params.storageBucket ?? 'local',
      fileSize: String(params.fileSize),
      mimeType: params.mimeType,
      sha256Hash: params.sha256Hash,
      chromaprintFp: params.chromaprintFp ?? null,
      audioEmbedding: params.audioEmbedding ?? null,
      mfccFeatures: null,
      spectralFeatures: null,
      uploadedBy: params.uploadedBy ?? null,
      status: 'active',
      durationSeconds: null,
      sampleRate: null,
      channels: null,
      bitrate: null,
    });
    return this.audioRepo.save(audio);
  }

  async getAllEmbeddings() {
    return this.audioRepo.find({
      select: ['id', 'audioEmbedding'],
      where: { status: 'active' },
    });
  }
}

