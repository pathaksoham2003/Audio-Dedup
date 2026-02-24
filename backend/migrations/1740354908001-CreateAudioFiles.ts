import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAudioFiles1740354908001 implements MigrationInterface {
  name = 'CreateAudioFiles1740354908001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audio_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_filename VARCHAR(512) NOT NULL,
        storage_path VARCHAR(1024) NOT NULL,
        storage_bucket VARCHAR(256) NOT NULL DEFAULT 'audio-uploads',
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(64) NOT NULL,
        duration_seconds FLOAT,
        sample_rate INT,
        channels INT,
        bitrate INT,
        sha256_hash VARCHAR(64) NOT NULL,
        chromaprint_fp TEXT,
        audio_embedding DOUBLE PRECISION[],
        mfcc_features JSONB DEFAULT '{}'::jsonb,
        spectral_features JSONB DEFAULT '{}'::jsonb,
        uploaded_by VARCHAR(256),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_audio_sha256 ON audio_files(sha256_hash)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audio_uploaded_by ON audio_files(uploaded_by)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audio_created_at ON audio_files(created_at DESC)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audio_files`);
  }
}

