import { AppDataSource } from './src/data-source';

async function check() {
    console.log('Initializing DataSource...');
    await AppDataSource.initialize();
    console.log('DataSource initialized. Querying tables...');
    const result = await AppDataSource.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    `);
    console.log('Tables:', result);
    await AppDataSource.destroy();
}

check().catch(console.error);
