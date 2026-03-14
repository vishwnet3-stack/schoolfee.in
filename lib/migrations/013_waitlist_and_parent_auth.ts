// lib/migrations/013_waitlist_and_parent_auth.ts
// Run this migration to create waitlist, waitlist_otps, parent_auth_otps, parent_sessions tables

import { db } from '@/lib/db';

export async function up() {
  console.log('Running migration: 013_waitlist_and_parent_auth');

  try {
    // ── 1. waitlist_otps ──────────────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS waitlist_otps (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        email       VARCHAR(255) NOT NULL,
        otp         VARCHAR(6)   NOT NULL,
        expires_at  DATETIME     NOT NULL,
        used        TINYINT(1)   DEFAULT 0,
        created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);
    console.log('✓ waitlist_otps table ready');

    // ── 2. waitlist ───────────────────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        full_name   VARCHAR(255)  NOT NULL,
        email       VARCHAR(255)  NOT NULL UNIQUE,
        phone       VARCHAR(20)   NOT NULL,
        role        ENUM('parent','teacher','school') NOT NULL,
        status      ENUM('pending','approved','rejected') DEFAULT 'pending',
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role  (role),
        INDEX idx_status (status)
      )
    `);
    console.log('✓ waitlist table ready');

    // ── 3. parent_auth_otps ───────────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_auth_otps (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        email       VARCHAR(255) NOT NULL,
        otp         VARCHAR(6)   NOT NULL,
        expires_at  DATETIME     NOT NULL,
        used        TINYINT(1)   DEFAULT 0,
        created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);
    console.log('✓ parent_auth_otps table ready');

    // ── 4. parent_sessions ────────────────────────────────────────────────
    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_sessions (
        id             INT PRIMARY KEY AUTO_INCREMENT,
        user_id        INT          NOT NULL,
        email          VARCHAR(255) NOT NULL,
        name           VARCHAR(255) NOT NULL,
        role           VARCHAR(50)  NOT NULL,
        session_token  VARCHAR(64)  NOT NULL UNIQUE,
        expires_at     DATETIME     NOT NULL,
        created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (session_token),
        INDEX idx_email (email)
      )
    `);
    console.log('✓ parent_sessions table ready');

    console.log('✓ Migration 013_waitlist_and_parent_auth completed successfully');
    return true;
  } catch (error) {
    console.error('✗ Migration 013 failed:', error);
    throw error;
  }
}

export async function down() {
  try {
    await db.execute(`DROP TABLE IF EXISTS parent_sessions`);
    await db.execute(`DROP TABLE IF EXISTS parent_auth_otps`);
    await db.execute(`DROP TABLE IF EXISTS waitlist`);
    await db.execute(`DROP TABLE IF EXISTS waitlist_otps`);
    console.log('✓ Rolled back migration 013_waitlist_and_parent_auth');
    return true;
  } catch (error) {
    console.error('✗ Rollback failed:', error);
    throw error;
  }
}