// lib/startup.ts
import { runMigrations } from './migrate';

let migrationRun = false;

// Function to run on server startup
export async function initializeApp() {
  if (!migrationRun) {
    console.log('Initializing application...');
    
    try {
      await runMigrations();
      migrationRun = true;
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Application initialization failed:', error);
      // Don't exit process in Next.js, just log the error
    }
  }
}

// Call this function once when the module is first imported
initializeApp();