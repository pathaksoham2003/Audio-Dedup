import { Column, CreateDateColumn, Entity, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { AudioFile } from './audio-file.entity';

@Entity({ name: 'duplicate_logs' })
export class DuplicateLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'original_audio_id', type: 'uuid', nullable: true })
  originalAudioId!: string | null;

  @ManyToOne(() => AudioFile, { nullable: true })
  @JoinColumn({ name: 'original_audio_id' })
  originalAudio!: AudioFile | null;

  @Column({ name: 'duplicate_filename', type: 'varchar', length: 512 })
  duplicateFilename!: string;

  @Column({ name: 'duplicate_sha256', type: 'varchar', length: 64, nullable: true })
  duplicateSha256!: string | null;

  @Column({ name: 'similarity_score', type: 'float' })
  similarityScore!: number;

  @Column({ name: 'detection_method', type: 'varchar', length: 32 })
  detectionMethod!: string;

  @Column({ name: 'detection_details', type: 'jsonb', nullable: true })
  detectionDetails!: Record<string, unknown> | null;

  @Column({ name: 'uploaded_by', type: 'varchar', length: 256, nullable: true })
  uploadedBy!: string | null;

  @Column({ name: 'email_sent', type: 'boolean', default: false })
  emailSent!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

