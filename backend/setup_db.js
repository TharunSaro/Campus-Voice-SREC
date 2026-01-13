import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

const targetDbName = process.env.DB_NAME || 'campus_voice_db';

async function setup() {
  console.log('Connecting to PostgreSQL to check database...');
  // Connect to default 'postgres' database to create the new db
  const client = new Client({ ...dbConfig, database: 'postgres' });
  
  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDbName]);
    if (res.rowCount === 0) {
      console.log(`Database ${targetDbName} not found. Creating...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`Database ${targetDbName} created successfully.`);
    } else {
      console.log(`Database ${targetDbName} already exists.`);
    }
    
    await client.end();
    
    // Connect to the target database to run schema
    console.log(`Connecting to ${targetDbName} to run schema...`);
    const dbClient = new Client({ ...dbConfig, database: targetDbName });
    await dbClient.connect();
    
    const sqlPath = path.join(__dirname, 'init_db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await dbClient.query(sql);
    console.log('Schema initialization completed successfully.');
    
    await dbClient.end();
    
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  }
}

setup();
