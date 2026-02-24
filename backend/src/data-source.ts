import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { AudioFile } from './audio/entities/audio-file.entity';
import { DuplicateLog } from './audio/entities/duplicate-log.entity';
import { UploadJob } from './audio/entities/upload-job.entity';
import { CreateAudioFiles1740354908001 } from '../migrations/1740354908001-CreateAudioFiles';
import { CreateDuplicateLogs1740354908002 } from '../migrations/1740354908002-CreateDuplicateLogs';
import { CreateUploadJobs1740354908003 } from '../migrations/1740354908003-CreateUploadJobs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [AudioFile, DuplicateLog, UploadJob],
  migrations: [CreateAudioFiles1740354908001, CreateDuplicateLogs1740354908002, CreateUploadJobs1740354908003],
});

