import { Controller, Get } from '@nestjs/common';

import { AudioService } from './audio.service';

@Controller('duplicates')
export class DuplicatesController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async list() {
    return this.audioService.listDuplicates();
  }

  @Get('stats')
  async stats() {
    return this.audioService.duplicateStats();
  }
}

