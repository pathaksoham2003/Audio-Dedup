import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudioModule } from './audio/audio.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { AudioFile } from './audio/entities/audio-file.entity';
import { DuplicateLog } from './audio/entities/duplicate-log.entity';
import { UploadJob } from './audio/entities/upload-job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [AudioFile, DuplicateLog, UploadJob],
        synchronize: false,
      }),
    }),
    HealthModule,
    AudioModule,
  ],
})
export class AppModule {}

