// app/api/run-school-registration-migration/route.ts
// Visit once: GET http://localhost:3000/api/run-school-registration-migration
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS school_registrations (
        id                      INT AUTO_INCREMENT PRIMARY KEY,
        public_user_id          INT NULL,
        -- Step 1: School Basic Information
        school_name             VARCHAR(300)  NOT NULL,
        school_type             ENUM('Government','Government Aided','Private Unaided','Central Government','International','Other') NOT NULL,
        established_year        YEAR          NOT NULL,
        affiliation_board       VARCHAR(200)  NOT NULL,
        other_affiliation_board VARCHAR(200)  NULL,
        affiliation_id          VARCHAR(100)  NOT NULL,
        -- Step 2: Contact & Location
        school_address          TEXT          NOT NULL,
        city                    VARCHAR(100)  NOT NULL,
        state                   VARCHAR(100)  NOT NULL,
        pincode                 CHAR(6)       NOT NULL,
        contact_number          VARCHAR(15)   NOT NULL,
        alternate_contact       VARCHAR(15)   NULL,
        official_email          VARCHAR(200)  NOT NULL,
        website_url             VARCHAR(300)  NULL,
        -- Step 3: Administrative Details
        principal_name          VARCHAR(200)  NOT NULL,
        principal_email         VARCHAR(200)  NOT NULL,
        principal_contact       VARCHAR(15)   NOT NULL,
        total_students          INT           NOT NULL,
        total_teachers          INT           NOT NULL,
        infrastructure_details  TEXT          NULL,
        -- Payment
        razorpay_order_id       VARCHAR(100)  NULL,
        razorpay_payment_id     VARCHAR(100)  NULL,
        payment_status          ENUM('pending','paid','failed') DEFAULT 'pending',
        payment_amount          DECIMAL(10,2) DEFAULT 1111.00,
        -- Admin
        status                  ENUM('pending','under_review','approved','rejected') DEFAULT 'pending',
        admin_notes             TEXT          NULL,
        submitted_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user          (public_user_id),
        INDEX idx_email         (official_email),
        INDEX idx_state         (state),
        INDEX idx_status        (status),
        INDEX idx_payment       (payment_status),
        INDEX idx_submitted     (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    return NextResponse.json({
      success: true,
      message: "school_registrations table created successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}