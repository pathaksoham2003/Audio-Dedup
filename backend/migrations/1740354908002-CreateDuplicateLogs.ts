import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDuplicateLogs1740354908002 implements MigrationInterface {
  name = 'CreateDuplicateLogs1740354908002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS duplicate_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_audio_id UUID REFERENCES audio_files(id),
        duplicate_filename VARCHAR(512) NOT NULL,
        duplicate_sha256 VARCHAR(64),
        similarity_score FLOAT NOT NULL,
        detection_method VARCHAR(32) NOT NULL,
        detection_details JSONB DEFAULT '{}'::jsonb,
        uploaded_by VARCHAR(256),
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_dup_original ON duplicate_logs(original_audio_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_dup_uploaded_by ON duplicate_logs(uploaded_by)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS duplicate_logs`);
  }
}

