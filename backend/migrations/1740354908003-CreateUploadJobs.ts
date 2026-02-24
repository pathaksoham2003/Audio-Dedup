import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUploadJobs1740354908003 implements MigrationInterface {
  name = 'CreateUploadJobs1740354908003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS upload_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id VARCHAR(128) NOT NULL,
        status VARCHAR(32) DEFAULT 'pending',
        result JSONB DEFAULT '{}'::jsonb,
        error TEXT,
        uploaded_by VARCHAR(256),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_upload_jobs_job_id ON upload_jobs(job_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS upload_jobs`);
  }
}

