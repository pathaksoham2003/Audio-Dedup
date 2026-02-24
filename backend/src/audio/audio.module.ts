import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudioController } from './audio.controller';
import { AudioProcessor } from './audio.processor';
import { AudioService } from './audio.service';
import { DuplicatesController } from './duplicates.controller';
import { AudioFile } from './entities/audio-file.entity';
import { DuplicateLog } from './entities/duplicate-log.entity';
import { UploadJob } from './entities/upload-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile, DuplicateLog, UploadJob])],
  controllers: [AudioController, DuplicatesController],
  providers: [AudioService, AudioProcessor],
})
export class AudioModule {}

