// app/api/survey/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fatherName,
      motherName,
      guardianName,
      address,
      state,
      mobileNumber,
      alternateMobile,
      email,
      familyType,
      numberOfChildren,
      schoolTypeQuantity,
      monthlyIncome,
      incomeSource,
      delayInFee,
      reasonForDelay,
      reasonForDelayOther,
      supportSource,
      supportSourceOther,
      communitySupport,
      schoolIncidents,
      schoolIncidentsOther,
      socialIsolation,
      isolationReason,
      govAssistance,
      govApplication,
      govHelpReasons,
      govHelpReasonsOther,
      bankShortTerm,
      bankReasons,
      bankReasonsOther,
      borrowingSource,
      borrowingDetails,
      interestRate,
      interestRateOther,
      preferredDuration,
      confidentialSupport,
      recommend,
      educationFear,
      supportNeeded,
      communityNetwork,
    } = body;

    // ========== VALIDATION ==========
    
    // Basic Information Validation
    if (!fatherName && !motherName && !guardianName) {
      return NextResponse.json(
        { error: 'At least one parent/guardian name is required' },
        { status: 400 }
      );
    }

    // if (!address || address.trim().length < 10) {
    //   return NextResponse.json(
    //     { error: 'Please provide a complete address (minimum 10 characters)' },
    //     { status: 400 }
    //   );
    // }

    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      );
    }

    // Validate mobile number (Indian format)
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    // Validate alternate mobile if provided
    if (alternateMobile && !/^[6-9]\d{9}$/.test(alternateMobile)) {
      return NextResponse.json(
        { error: 'Please enter a valid alternate mobile number' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Family Information Validation
    if (!familyType) {
      return NextResponse.json(
        { error: 'Please select family type' },
        { status: 400 }
      );
    }

    if (!numberOfChildren) {
      return NextResponse.json(
        { error: 'Please select number of children' },
        { status: 400 }
      );
    }

    if (!schoolTypeQuantity || Object.keys(schoolTypeQuantity).length === 0) {
      return NextResponse.json(
        { error: 'Please specify school types for your children' },
        { status: 400 }
      );
    }

    // Financial Stress Validation
    if (!monthlyIncome || !incomeSource || !delayInFee) {
      return NextResponse.json(
        { error: 'Please complete all financial information fields' },
        { status: 400 }
      );
    }

    if (delayInFee === 'yes' && !reasonForDelay) {
      return NextResponse.json(
        { error: 'Please select a reason for fee delay' },
        { status: 400 }
      );
    }

    // Community Support Validation
    if (!supportSource || !socialIsolation) {
      return NextResponse.json(
        { error: 'Please complete all community support fields' },
        { status: 400 }
      );
    }

    if (!schoolIncidents || schoolIncidents.length === 0) {
      return NextResponse.json(
        { error: 'Please select school incident options' },
        { status: 400 }
      );
    }

    // Government Aid Validation
    if (!govAssistance || !bankShortTerm) {
      return NextResponse.json(
        { error: 'Please complete all government aid fields' },
        { status: 400 }
      );
    }

    // Borrowing Patterns Validation
    if (!borrowingSource) {
      return NextResponse.json(
        { error: 'Please select borrowing source' },
        { status: 400 }
      );
    }

    if (borrowingSource === 'Bank' && !borrowingDetails?.Bank) {
      return NextResponse.json(
        { error: 'Please enter bank name' },
        { status: 400 }
      );
    }

    if (borrowingSource === 'Relatives' && !borrowingDetails?.Relatives) {
      return NextResponse.json(
        { error: 'Please specify the relation' },
        { status: 400 }
      );
    }

    // Support Model Validation
    if (!preferredDuration || !confidentialSupport || !recommend) {
      return NextResponse.json(
        { error: 'Please complete all support model fields' },
        { status: 400 }
      );
    }

    // Open Feedback Validation
    // if (!educationFear || educationFear.trim().length < 10) {
    //   return NextResponse.json(
    //     { error: 'Please share your education concern (minimum 10 characters)' },
    //     { status: 400 }
    //   );
    // }

    // if (!supportNeeded || supportNeeded.trim().length < 10) {
    //   return NextResponse.json(
    //     { error: 'Please describe the support you need (minimum 10 characters)' },
    //     { status: 400 }
    //   );
    // }

    if (!communityNetwork) {
      return NextResponse.json(
        { error: 'Please answer the community network question' },
        { status: 400 }
      );
    }

    // Check for duplicate submission (same mobile or email within last 7 days)
    const [existing] = await db.execute<any[]>(
      `SELECT id, mobile_number, email, created_at 
       FROM survey_responses 
       WHERE (mobile_number = ? OR email = ?) 
       AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) 
       LIMIT 1`,
      [mobileNumber, email]
    );

    if (existing && existing.length > 0) {
      const duplicate = existing[0];
      const submittedDate = new Date(duplicate.created_at).toLocaleDateString('en-IN');
      return NextResponse.json(
        { 
          error: `You have already submitted a survey on ${submittedDate}. Please contact us if you need to update your information.` 
        },
        { status: 409 }
      );
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Determine primary name for emails
    const primaryName = fatherName || motherName || guardianName || 'Valued Family';

    // Insert survey response
    const [result] = await db.execute<any>(
      `INSERT INTO survey_responses (
        father_name, mother_name, guardian_name, address, state, 
        mobile_number, alternate_mobile, email,
        family_type, number_of_children, school_type_quantity,
        monthly_income, income_source, delay_in_fee, reason_for_delay, reason_for_delay_other,
        support_source, support_source_other, community_support, 
        school_incidents, school_incidents_other, social_isolation, isolation_reason,
        gov_assistance, gov_application, gov_help_reasons, gov_help_reasons_other,
        bank_short_term, bank_reasons, bank_reasons_other,
        borrowing_source, borrowing_details, interest_rate, interest_rate_other,
        preferred_duration, confidential_support, recommend,
        education_fear, support_needed, community_network,
        ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fatherName || null,
        motherName || null,
        guardianName || null,
        address,
        state,
        mobileNumber,
        alternateMobile || null,
        email,
        familyType,
        numberOfChildren,
        JSON.stringify(schoolTypeQuantity),
        monthlyIncome,
        incomeSource,
        delayInFee,
        reasonForDelay || null,
        reasonForDelayOther || null,
        supportSource,
        supportSourceOther || null,
        communitySupport || null,
        JSON.stringify(schoolIncidents),
        schoolIncidentsOther || null,
        socialIsolation,
        isolationReason || null,
        govAssistance,
        govApplication || null,
        govHelpReasons || null,
        govHelpReasonsOther || null,
        bankShortTerm,
        bankReasons || null,
        bankReasonsOther || null,
        borrowingSource,
        JSON.stringify(borrowingDetails),
        interestRate || null,
        interestRateOther || null,
        preferredDuration,
        confidentialSupport,
        recommend,
        educationFear,
        supportNeeded,
        communityNetwork,
        ipAddress,
        userAgent,
      ]
    );

    // Send emails asynchronously (don't wait for them)
    Promise.all([
      // Send confirmation email to USER
      sendEmail(email, 'surveyConfirmation', {
        name: primaryName,
        mobile: mobileNumber,
      }),
      
      // Send notification to ADMIN with ALL survey data
      sendEmail('schoolfee.in@gmail.com', 'surveyAdminNotification', {
        // Basic Information
        name: primaryName,
        fatherName: fatherName || '',
        motherName: motherName || '',
        guardianName: guardianName || '',
        address: address,
        state: state,
        mobile: mobileNumber,
        alternateMobile: alternateMobile || '',
        email: email,
        
        // Family Details
        familyType: familyType,
        numberOfChildren: numberOfChildren,
        schoolTypeQuantity: schoolTypeQuantity,
        
        // Financial Stress
        monthlyIncome: monthlyIncome,
        incomeSource: incomeSource,
        delayInFee: delayInFee,
        reasonForDelay: reasonForDelay || '',
        reasonForDelayOther: reasonForDelayOther || '',
        
        // Community Support
        supportSource: supportSource,
        supportSourceOther: supportSourceOther || '',
        communitySupport: communitySupport || '',
        schoolIncidents: schoolIncidents,
        schoolIncidentsOther: schoolIncidentsOther || '',
        socialIsolation: socialIsolation,
        isolationReason: isolationReason || '',
        
        // Government Aid
        govAssistance: govAssistance,
        govApplication: govApplication || '',
        govHelpReasons: govHelpReasons || '',
        govHelpReasonsOther: govHelpReasonsOther || '',
        bankShortTerm: bankShortTerm,
        bankReasons: bankReasons || '',
        bankReasonsOther: bankReasonsOther || '',
        
        // Borrowing Patterns
        borrowingSource: borrowingSource,
        borrowingDetails: borrowingDetails,
        interestRate: interestRate || '',
        interestRateOther: interestRateOther || '',
        
        // Support Model
        preferredDuration: preferredDuration,
        confidentialSupport: confidentialSupport,
        recommend: recommend,
        
        // Open Feedback
        educationFear: educationFear,
        supportNeeded: supportNeeded,
        communityNetwork: communityNetwork,
      }),
    ]).catch((error) => {
      console.error('Email sending error:', error);
      // Don't fail the request if email fails
    });

    // Clear localStorage on successful submission (client-side will handle this)
    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully! Thank you for your time. Our team will contact you within 24-48 hours.',
      surveyId: result.insertId,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your survey. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all survey responses (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const state = searchParams.get('state');
    const delayInFee = searchParams.get('delayInFee');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM survey_responses WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }

    if (delayInFee) {
      query += ' AND delay_in_fee = ?';
      params.push(delayInFee);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [surveys] = await db.execute<any[]>(query, params);

    // Parse JSON fields
    const parsedSurveys = surveys.map(survey => ({
      ...survey,
      school_type_quantity: JSON.parse(survey.school_type_quantity),
      school_incidents: JSON.parse(survey.school_incidents),
      borrowing_details: JSON.parse(survey.borrowing_details),
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM survey_responses WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (state) {
      countQuery += ' AND state = ?';
      countParams.push(state);
    }

    if (delayInFee) {
      countQuery += ' AND delay_in_fee = ?';
      countParams.push(delayInFee);
    }

    const [countResult] = await db.execute<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: parsedSurveys,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error: any) {
    console.error('Fetch surveys error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching surveys' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update survey status (for admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { surveyId, status, adminNotes } = body;

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'reviewed', 'contacted', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (adminNotes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(adminNotes);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    params.push(surveyId);

    await db.execute(
      `UPDATE survey_responses SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'Survey updated successfully',
    });

  } catch (error: any) {
    console.error('Update survey error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the survey' },
      { status: 500 }
    );
  }
}