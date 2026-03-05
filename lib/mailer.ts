// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vishwnet.schoolfee@gmail.com",
    pass: "jjoa hcgw gwyz cnvt",
  },
});

// Professional email templates with minimal emojis (1-2 per email)
const templates = {
  userWelcome: (data: { name: string; role: string }) => ({
    subject: "Welcome to Schoolfee.in - Registration Confirmed",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50;
            margin: 0;
            padding: 0;
            background-color: #f4f6f9;
          }
          .container { 
            max-width: 600px; 
            margin: 30px auto; 
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0B4C8A 0%, #094076 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            background: #ffffff; 
            padding: 35px 30px;
            color: #2c3e50;
          }
          .content p {
            color: #2c3e50;
            margin: 15px 0;
          }
          .button { 
            background: #0B4C8A; 
            color: white !important; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-block; 
            margin: 25px 0;
            font-weight: 600;
            transition: background 0.3s;
          }
          .button:hover {
            background: #094076;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 25px; 
            border-top: 2px solid #e0e0e0; 
            color: #7f8c8d; 
            font-size: 13px;
          }
          .highlight { 
            background: #EBF5FF; 
            padding: 20px; 
            border: 1px solid #0B4C8A; 
            margin: 25px 0; 
            border-radius: 6px;
          }
          .highlight strong {
            color: #0B4C8A;
          }
          ul { 
            padding-left: 25px;
            color: #2c3e50;
          }
          li { 
            margin: 12px 0;
            color: #2c3e50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Schoolfee.in</h1>
          </div>
          <div class="content">
            <p><strong>Dear ${data.name},</strong></p>
            <p>Thank you for accepting the invitation to join India's first community-based education social security system.</p>
            
            <div class="highlight">
              <strong>Registration Details:</strong><br><br>
              <strong>Role:</strong> ${data.role}<br>
              <strong>Status:</strong> <span style="color: #27ae60;">✅ Confirmed</span>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Our team will contact you within 24-48 hours</li>
              <li>We'll guide you through the onboarding process</li>
              <li>You'll receive access to your personalized dashboard</li>
            </ul>
            
            <p><strong>Key Benefits:</strong></p>
            <ul>
              <li>0% Interest Support</li>
              <li>48 Hours Verification</li>
              <li>Direct School Payment</li>
              <li>Dignified Process</li>
            </ul>
            
            
            <p>If you have any questions, feel free to reply to this email or visit our website.</p>
            
            <p style="margin-top: 30px;">Warm regards,<br><strong>Team Schoolfee.in</strong></p>
          </div>
          <div class="footer">
            <p><strong>© 2025 Schoolfee.in. All rights reserved.</strong></p>
            <p>India's First Community-Based Education Social Security System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminNotification: (data: {
    name: string;
    role: string;
    mobile: string;
    email: string;
    city: string;
  }) => ({
    subject: `🔔 New Registration: ${data.role} - ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0B4C8A; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
          .info-box { background: #f8f9fa; padding: 25px; margin: 20px 0; border: 1px solid #0B4C8A; border-radius: 6px; }
          .info-row { margin: 12px 0; }
          .label { font-weight: bold; color: #0B4C8A; }
          .action { background: #fff3cd; padding: 20px; border: 1px solid #ffc107; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">New Registration Alert</h2>
          </div>
          <div class="info-box">
            <div class="info-row">
              <span class="label">Name/Organization:</span> ${data.name}
            </div>
            <div class="info-row">
              <span class="label">Role:</span> ${data.role}
            </div>
            <div class="info-row">
              <span class="label">Mobile:</span> ${data.mobile}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${data.email}
            </div>
            <div class="info-row">
              <span class="label">City:</span> ${data.city}
            </div>
            <div class="info-row">
              <span class="label">Registered:</span> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </div>
          </div>
          <div class="action">
            <strong>Action Required:</strong> Please contact the applicant within 24-48 hours.
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  quickSignupNotification: (data: { mobile: string; source: string }) => ({
    subject: `⚡ Quick Signup: ${data.mobile}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Segoe UI', sans-serif; color: #2c3e50;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0B4C8A; border-bottom: 2px solid #0B4C8A; padding-bottom: 10px;">Quick Signup Alert</h2>
          <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 6px;">
            <p><strong>Mobile Number:</strong> ${data.mobile}</p>
            <p><strong>Source:</strong> ${data.source === "hero" ? "Hero Section" : "Bottom CTA"}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
          </div>
          <p>Please follow up with this lead.</p>
        </div>
      </body>
      </html>
    `,
  }),

  surveyConfirmation: (data: { name: string; mobile: string }) => ({
    subject: "Survey Submitted Successfully - Schoolfee.in",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #2c3e50;
          margin: 0;
          padding: 0;
          background-color: #f4f6f9;
        }
        .container { 
          max-width: 600px; 
          margin: 30px auto; 
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #0B4C8A 0%, #094076 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content { 
          background: #ffffff; 
          padding: 35px 30px;
          color: #2c3e50;
        }
        .content p {
          color: #2c3e50;
          margin: 15px 0;
        }
        .highlight { 
          background: #EBF5FF; 
          padding: 20px; 
          border: 1px solid #0B4C8A; 
          margin: 25px 0; 
          border-radius: 6px;
        }
        .highlight strong {
          color: #0B4C8A;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 25px; 
          border-top: 2px solid #e0e0e0; 
          color: #7f8c8d; 
          font-size: 13px;
        }
        ul { 
          padding-left: 25px;
          color: #2c3e50;
        }
        li { 
          margin: 12px 0;
          color: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Completing Our Survey!</h1>
        </div>
        <div class="content">
          <p><strong>Dear ${data.name},</strong></p>
          <p>Thank you for taking the time to complete our Family Survey for Student Fee Support. Your responses are invaluable in helping us understand the challenges families face in accessing quality education.</p>
          
          <div class="highlight">
            <strong>What Happens Next:</strong><br><br>
            Our dedicated team will carefully review your survey responses within <strong>24-48 hours</strong>.<br>
            We will contact you at <strong>${data.mobile}</strong> to discuss how we can best support your family's educational needs.
          </div>
          
          <p><strong>Our Commitment to You:</strong></p>
          <ul>
            <li><strong>0% Interest Support</strong> - No hidden charges or interest rates</li>
            <li><strong>48 Hours Verification</strong> - Quick and efficient processing</li>
            <li><strong>Direct School Payment</strong> - We pay directly to the school</li>
            <li><strong>Dignified Process</strong> - Your privacy and dignity are our priority</li>
            <li><strong>Community-Based Model</strong> - Built on mutual trust and support</li>
          </ul>
          
          <p>Your survey responses help us:</p>
          <ul>
            <li>Understand the real challenges families face</li>
            <li>Design better support programs</li>
            <li>Advocate for policy changes</li>
            <li>Build a stronger community support network</li>
          </ul>
          
          <p>If you have any urgent questions before we contact you, please feel free to reply to this email or call us.</p>
          
          <p style="margin-top: 30px;">Warm regards,<br><strong>Team Schoolfee.in</strong></p>
          <p style="font-size: 13px; color: #7f8c8d; margin-top: 20px;">
            India's First Community-Based Education Social Security System
          </p>
        </div>
        <div class="footer">
          <p><strong>© 2025 Schoolfee.in. All rights reserved.</strong></p>
          <p>Making quality education accessible and affordable for every child</p>
        </div>
      </div>
    </body>
    </html>
  `,
  }),

  surveyAdminNotification: (data: any) => {
    // Helper function to format school type quantity
    const formatSchoolTypes = (schoolTypeQuantity: any) => {
      if (!schoolTypeQuantity || typeof schoolTypeQuantity !== 'object') return 'Not specified';
      return Object.entries(schoolTypeQuantity)
        .map(([type, qty]) => `${type}: ${qty} ${Number(qty) === 1 ? 'child' : 'children'}`)
        .join(', ');
    };

    // Helper function to format array values
    const formatArray = (arr: any) => {
      if (!Array.isArray(arr)) return 'None';
      return arr.join(', ');
    };

    return {
      subject: `🔔 New Survey Submission: ${data.name} - ${data.state}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { background: #0B4C8A; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h2 { margin: 0; font-size: 24px; }
        .info-section { background: #f8f9fa; padding: 25px; margin: 20px 0; border: 1px solid #0B4C8A; border-radius: 6px; }
        .section-title { color: #0B4C8A; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #0B4C8A; padding-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .info-row { background: white; padding: 12px; border-radius: 4px; }
        .info-row-full { background: white; padding: 12px; border-radius: 4px; grid-column: 1 / -1; }
        .label { font-weight: bold; color: #0B4C8A; font-size: 12px; text-transform: uppercase; }
        .value { color: #2c3e50; margin-top: 5px; font-size: 14px; word-wrap: break-word; }
        .priority { background: #fff3cd; padding: 20px; border: 2px solid #ffc107; margin: 20px 0; border-radius: 6px; }
        .priority-high { background: #f8d7da; border-color: #dc3545; }
        .highlight-yes { color: #dc3545; font-weight: bold; }
        .highlight-no { color: #27ae60; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Family Survey Submission</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        </div>
        
        <!-- SECTION 1: CONTACT INFORMATION -->
        <div class="info-section">
          <h3 class="section-title">📋 Section 1: Contact Information</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Father's Name</div>
              <div class="value">${data.fatherName || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="label">Mother's Name</div>
              <div class="value">${data.motherName || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="label">Guardian's Name</div>
              <div class="value">${data.guardianName || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="label">State</div>
              <div class="value">${data.state}</div>
            </div>
            <div class="info-row-full">
              <div class="label">Address</div>
              <div class="value">${data.address}</div>
            </div>
            <div class="info-row">
              <div class="label">Mobile Number</div>
              <div class="value">${data.mobile}</div>
            </div>
            <div class="info-row">
              <div class="label">Alternate Mobile</div>
              <div class="value">${data.alternateMobile || 'Not provided'}</div>
            </div>
            <div class="info-row-full">
              <div class="label">Email</div>
              <div class="value">${data.email}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: FAMILY DETAILS -->
        <div class="info-section">
          <h3 class="section-title">👨‍👩‍👧‍👦 Section 2: Family Details</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Family Type</div>
              <div class="value">${data.familyType}</div>
            </div>
            <div class="info-row">
              <div class="label">Number of Children</div>
              <div class="value">${data.numberOfChildren}</div>
            </div>
            <div class="info-row-full">
              <div class="label">School Type Distribution</div>
              <div class="value">${formatSchoolTypes(data.schoolTypeQuantity)}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: FINANCIAL STRESS -->
        <div class="info-section">
          <h3 class="section-title">💰 Section 3: Financial Stress</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Monthly Income</div>
              <div class="value">${data.monthlyIncome}</div>
            </div>
            <div class="info-row">
              <div class="label">Income Source</div>
              <div class="value">${data.incomeSource}</div>
            </div>
            <div class="info-row">
              <div class="label">Fee Payment Delays</div>
              <div class="value ${data.delayInFee === 'yes' ? 'highlight-yes' : 'highlight-no'}">${data.delayInFee === "yes" ? "⚠️ Yes" : " No"}</div>
            </div>
            ${data.delayInFee === 'yes' ? `
            <div class="info-row">
              <div class="label">Reason for Delay</div>
              <div class="value">${data.reasonForDelay === 'other' && data.reasonForDelayOther ? data.reasonForDelayOther : data.reasonForDelay || 'Not specified'}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- SECTION 4: COMMUNITY SUPPORT -->
        <div class="info-section">
          <h3 class="section-title">🤝 Section 4: Community Support</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Primary Support Source</div>
              <div class="value">${data.supportSource === 'other' && data.supportSourceOther ? data.supportSourceOther : data.supportSource || 'Not specified'}</div>
            </div>
            <div class="info-row">
              <div class="label">Social Isolation</div>
              <div class="value">${data.socialIsolation === 'yes' ? '⚠️ Yes' : '✅ No'}</div>
            </div>
            ${data.socialIsolation === 'yes' && data.isolationReason ? `
            <div class="info-row-full">
              <div class="label">Isolation Reason</div>
              <div class="value">${data.isolationReason}</div>
            </div>
            ` : ''}
            <div class="info-row-full">
              <div class="label">School Incidents</div>
              <div class="value">${data.schoolIncidents && data.schoolIncidents.includes('Other') && data.schoolIncidentsOther 
                ? formatArray([...data.schoolIncidents.filter((i: string) => i !== 'Other'), data.schoolIncidentsOther])
                : formatArray(data.schoolIncidents)}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 5: GOVERNMENT AID -->
        <div class="info-section">
          <h3 class="section-title">🏛️ Section 5: Government Aid</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Received Govt Assistance</div>
              <div class="value">${data.govAssistance === 'yes' ? '✅ Yes' : '❌ No'}</div>
            </div>
            ${data.govAssistance === 'yes' && data.govApplication ? `
            <div class="info-row">
              <div class="label">Application Status</div>
              <div class="value">${data.govApplication}</div>
            </div>
            ` : ''}
            ${data.govAssistance === 'no' && data.govHelpReasons ? `
            <div class="info-row">
              <div class="label">Reason for No Support</div>
              <div class="value">${data.govHelpReasons === 'other' && data.govHelpReasonsOther ? data.govHelpReasonsOther : data.govHelpReasons}</div>
            </div>
            ` : ''}
            <div class="info-row">
              <div class="label">Bank/NBFC Short-term Help</div>
              <div class="value">${data.bankShortTerm === 'yes' ? '✅ Yes' : '❌ No'}</div>
            </div>
            ${data.bankShortTerm === 'no' && data.bankReasons ? `
            <div class="info-row">
              <div class="label">Reason</div>
              <div class="value">${data.bankReasons === 'other' && data.bankReasonsOther ? data.bankReasonsOther : data.bankReasons}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- SECTION 6: BORROWING PATTERNS -->
        <div class="info-section">
          <h3 class="section-title">💳 Section 6: Borrowing Patterns</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Borrowing Source</div>
              <div class="value">${data.borrowingSource || 'Not specified'}</div>
            </div>
            ${data.borrowingSource === 'Bank' && data.borrowingDetails?.Bank ? `
            <div class="info-row">
              <div class="label">Bank Name</div>
              <div class="value">${data.borrowingDetails.Bank}</div>
            </div>
            ` : ''}
            ${data.borrowingSource === 'Relatives' && data.borrowingDetails?.Relatives ? `
            <div class="info-row">
              <div class="label">Relation</div>
              <div class="value">${data.borrowingDetails.Relatives}</div>
            </div>
            ` : ''}
            ${data.borrowingSource && data.borrowingSource !== 'Never' && data.interestRate ? `
            <div class="info-row">
              <div class="label">Interest Rate</div>
              <div class="value">${data.interestRate === 'other' && data.interestRateOther ? data.interestRateOther : data.interestRate}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- SECTION 7: SUPPORT MODEL -->
        <div class="info-section">
          <h3 class="section-title">⏱️ Section 7: Support Model</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Preferred Duration</div>
              <div class="value">${data.preferredDuration || 'Not specified'}</div>
            </div>
            <div class="info-row">
              <div class="label">Confidential Support</div>
              <div class="value">${data.confidentialSupport || 'Not specified'}</div>
            </div>
            <div class="info-row">
              <div class="label">Would Recommend</div>
              <div class="value">${data.recommend || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 8: OPEN FEEDBACK -->
        <div class="info-section">
          <h3 class="section-title">💬 Section 8: Open Feedback</h3>
          <div class="info-grid">
            <div class="info-row-full">
              <div class="label">Biggest Education Concern</div>
              <div class="value">${data.educationFear || 'Not provided'}</div>
            </div>
            <div class="info-row-full">
              <div class="label">Support Needed Most</div>
              <div class="value">${data.supportNeeded || 'Not provided'}</div>
            </div>
            <div class="info-row">
              <div class="label">Community Network Interest</div>
              <div class="value">${data.communityNetwork || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <!-- PRIORITY ALERT -->
        <div class="${data.delayInFee === "yes" ? "priority priority-high" : "priority"}">
          <strong>⏰ Action Required:</strong><br>
          Priority: ${data.delayInFee === "yes" ? '<span style="color: #dc3545; font-size: 16px;">🔴 HIGH - Family experiencing fee delays</span>' : '<span style="color: #27ae60;">🟢 Normal</span>'}<br><br>
          Please contact the family at <strong>${data.mobile}</strong> or <strong>${data.email}</strong> within 24-48 hours.
        </div>
      </div>
    </body>
    </html>
  `,
    };
  },

  queryConfirmation: (data: { query: string }) => ({
    subject: "Your Query Received - Schoolfee.in",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50;
            margin: 0;
            padding: 0;
            background-color: #f4f6f9;
          }
          .container { 
            max-width: 600px; 
            margin: 30px auto; 
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0B4C8A 0%, #094076 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            background: #ffffff; 
            padding: 35px 30px;
            color: #2c3e50;
          }
          .content p {
            color: #2c3e50;
            margin: 15px 0;
          }
          .query-box { 
            background: #EBF5FF; 
            padding: 20px; 
            border: 1px solid #0B4C8A; 
            margin: 25px 0; 
            border-radius: 6px;
          }
          .query-box p {
            color: #2c3e50;
            margin-top: 12px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 25px; 
            border-top: 2px solid #e0e0e0; 
            color: #7f8c8d; 
            font-size: 13px;
          }
          ul { 
            padding-left: 25px;
            color: #2c3e50;
          }
          li { 
            margin: 12px 0;
            color: #2c3e50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Query Received Successfully</h1>
          </div>
          <div class="content">
            <p>Thank you for reaching out to us!</p>
            <p>We have received your query and our team will get back to you within <strong>2 working days</strong>.</p>
            
            <div class="query-box">
              <strong>Your Query:</strong>
              <p>${data.query}</p>
            </div>
            
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>Our support team will review your query</li>
              <li>We'll contact you via email or phone within 2 working days</li>
              <li>You'll receive a detailed response addressing your concerns</li>
            </ul>
            
            <p>If you have any urgent questions, please feel free to call us or reply to this email.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Team Schoolfee.in</strong></p>
          </div>
          <div class="footer">
            <p><strong>© 2025 Schoolfee.in. All rights reserved.</strong></p>
            <p>India's First Community-Based Education Social Security System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  queryNotificationWithEmail: (data: { query: string; email: string }) => ({
    subject: `💬 New Query from ${data.email}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: 'Segoe UI', sans-serif; color: #2c3e50;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0B4C8A; border-bottom: 2px solid #0B4C8A; padding-bottom: 10px;">New Query Received</h2>
          <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border: 1px solid #0B4C8A; border-radius: 6px;">
            <p><strong>User Email:</strong> ${data.email}</p>
            <p><strong>Query:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px; color: #2c3e50;">${data.query}</p>
          </div>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
          <div style="background: #fff3cd; padding: 20px; border: 1px solid #ffc107; margin: 20px 0; border-radius: 6px;">
            <strong>Action Required:</strong> Please respond within 2 working days.
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  publicUserWelcome: (data: { name: string; role: string }) => ({
    subject: "Welcome to Schoolfee.in - Registration Confirmed",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50;
            margin: 0;
            padding: 0;
            background-color: #f4f6f9;
          }
          .container { 
            max-width: 600px; 
            margin: 30px auto; 
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0B4C8A 0%, #094076 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            background: #ffffff; 
            padding: 35px 30px;
            color: #2c3e50;
          }
          .content p {
            color: #2c3e50;
            margin: 15px 0;
          }
          .button { 
            background: #0B4C8A; 
            color: white !important; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-block; 
            margin: 25px 0;
            font-weight: 600;
            transition: background 0.3s;
          }
          .button:hover {
            background: #094076;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 25px; 
            border-top: 2px solid #e0e0e0; 
            color: #7f8c8d; 
            font-size: 13px;
          }
          .highlight { 
            background: #EBF5FF; 
            padding: 20px; 
            border: 1px solid #0B4C8A; 
            margin: 25px 0; 
            border-radius: 6px;
          }
          .highlight strong {
            color: #0B4C8A;
          }
          ul { 
            padding-left: 25px;
            color: #2c3e50;
          }
          li { 
            margin: 12px 0;
            color: #2c3e50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Schoolfee.in</h1>
          </div>
          <div class="content">
            <p><strong>Dear ${data.name},</strong></p>
            <p>Thank you for registering with Schoolfee.in! We're thrilled to have you join our community-based education social security system.</p>
            
            <div class="highlight">
              <strong>Registration Confirmed!</strong><br><br>
              <strong>Status:</strong> <span style="color: #27ae60;">✅ Active</span><br>
              <strong>Role:</strong> ${data.role}
            </div>
            
            <p><strong>What you can do now:</strong></p>
            <ul>
              <li>Log in to your account to view your profile</li>
              <li>Explore available programs and support options</li>
              <li>Access educational resources</li>
              <li>Connect with our community</li>
            </ul>
            
            <p><strong>Key Benefits:</strong></p>
            <ul>
              <li>0% Interest Support</li>
              <li>Fast Verification Process</li>
              <li>Direct Access to Resources</li>
              <li>Community Support Network</li>
            </ul>
            
            <p>If you have any questions, feel free to reply to this email or visit our website.</p>
            
            <p style="margin-top: 30px;">Warm regards,<br><strong>Team Schoolfee.in</strong></p>
          </div>
          <div class="footer">
            <p><strong>© 2025 Schoolfee.in. All rights reserved.</strong></p>
            <p>India's First Community-Based Education Social Security System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function with proper headers to land in Inbox
export async function sendEmail(
  to: string,
  template: keyof typeof templates,
  data: any,
) {
  try {
    const emailContent = templates[template](data);

    const info = await transporter.sendMail({
      from: '"Schoolfee" <vishwnet.schoolfee@gmail.com>',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "X-Entity-Ref-ID": Date.now().toString(),
      },
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}

// Send multiple emails
export async function sendMultipleEmails(
  emails: { to: string; template: keyof typeof templates; data: any }[],
) {
  const results = await Promise.allSettled(
    emails.map(({ to, template, data }) => sendEmail(to, template, data)),
  );

  return results;
}

// Send welcome email for new user registration
export async function sendWelcomeEmail(data: {
  name: string;
  email: string;
  role: string;
}) {
  return sendEmail(data.email, "userWelcome", {
    name: data.name,
    role: data.role,
  });
}

// Send survey confirmation email
export async function sendSurveyConfirmation(data: {
  name: string;
  mobile: string;
  email?: string;
}) {
  const email = data.email || "no-reply@schoolfee.in";
  return sendEmail(email, "surveyConfirmation", {
    name: data.name,
    mobile: data.mobile,
  });
}

// Send admin notification for survey submission
export async function sendSurveyAdminNotification(data: any) {
  return sendEmail(
    "vishwnet.schoolfee@gmail.com",
    "surveyAdminNotification",
    data
  );
}
