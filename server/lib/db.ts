import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import 'dotenv/config';

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in the environment variables');
  process.exit(1);
}

// Create a SQL client with the neon serverless driver
const sql = neon(process.env.DATABASE_URL!);

// Create a Drizzle client with the neon driver
export const db = drizzle(sql);

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}