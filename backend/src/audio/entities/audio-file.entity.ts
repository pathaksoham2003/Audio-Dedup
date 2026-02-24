import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'audio_files' })
export class AudioFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'original_filename', type: 'varchar', length: 512 })
  originalFilename!: string;

  @Column({ name: 'storage_path', type: 'varchar', length: 1024 })
  storagePath!: string;

  @Column({ name: 'storage_bucket', type: 'varchar', length: 256, default: 'local' })
  storageBucket!: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 64 })
  mimeType!: string;

  @Column({ name: 'duration_seconds', type: 'float', nullable: true })
  durationSeconds!: number | null;

  @Column({ name: 'sample_rate', type: 'int', nullable: true })
  sampleRate!: number | null;

  @Column({ name: 'channels', type: 'int', nullable: true })
  channels!: number | null;

  @Column({ name: 'bitrate', type: 'int', nullable: true })
  bitrate!: number | null;

  @Index({ unique: true })
  @Column({ name: 'sha256_hash', type: 'varchar', length: 64 })
  sha256Hash!: string;

  @Column({ name: 'chromaprint_fp', type: 'text', nullable: true })
  chromaprintFp!: string | null;

  @Column({ name: 'audio_embedding', type: 'double precision', array: true, nullable: true })
  audioEmbedding!: number[] | null;

  @Column({ name: 'mfcc_features', type: 'jsonb', nullable: true })
  mfccFeatures!: Record<string, unknown> | null;

  @Column({ name: 'spectral_features', type: 'jsonb', nullable: true })
  spectralFeatures!: Record<string, unknown> | null;

  @Column({ name: 'uploaded_by', type: 'varchar', length: 256, nullable: true })
  uploadedBy!: string | null;

  @Column({ type: 'varchar', length: 32, default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

