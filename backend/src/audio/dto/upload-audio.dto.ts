import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UploadAudioDto {
  @IsOptional()
  @IsEmail()
  uploadedBy?: string;

  @IsOptional()
  @IsString()
  filenameHint?: string;
}

