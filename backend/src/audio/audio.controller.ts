import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

import { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_BYTES } from './constants';
import { UploadAudioDto } from './dto/upload-audio.dto';
import { AudioProcessor } from './audio.processor';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly audioProcessor: AudioProcessor,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: UploadAudioDto) {
    if (!file) {
      return { error: 'file is required' };
    }
    if (file.size > MAX_AUDIO_BYTES) {
      return { error: `file too large (max ${MAX_AUDIO_BYTES} bytes)` };
    }
    if (!ALLOWED_AUDIO_MIME_TYPES.has(file.mimetype)) {
      return { error: `unsupported mime type: ${file.mimetype}` };
    }

    const jobId = randomUUID();
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = (file.originalname || 'upload').replace(/[^\w.\-()]/g, '_');
    const storedPath = path.join(uploadsDir, `${jobId}-${safeName}`);
    await fs.writeFile(storedPath, file.buffer);

    await this.audioService.createJob(jobId, body.uploadedBy);
    await this.audioProcessor.enqueue({
      jobId,
      filePath: storedPath,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedBy: body.uploadedBy ?? null,
    });

    return { jobId };
  }

  @Get('jobs/:jobId')
  async jobStatus(@Param('jobId') jobId: string) {
    const job = await this.audioService.getJob(jobId);
    return { jobId: job.jobId, status: job.status, result: job.result, error: job.error };
  }

  @Get()
  async list() {
    return this.audioService.listAudios();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.audioService.getAudio(id);
  }
}

