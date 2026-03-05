// lib/db.ts
import 'dotenv/config';
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

// Test connection function
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connection successful!');
    connection.release();
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}