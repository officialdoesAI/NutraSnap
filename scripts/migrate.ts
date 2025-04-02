import { exec } from 'child_process';
import 'dotenv/config';

// Check if the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('Starting database migration...');

// Execute the drizzle-kit push command
exec('npx drizzle-kit push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during migration: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`Migration stderr: ${stderr}`);
  }
  
  console.log(`Migration output: ${stdout}`);
  console.log('Database migration completed successfully!');
});