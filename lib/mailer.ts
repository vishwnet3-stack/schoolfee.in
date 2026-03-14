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
      if (!schoolTypeQuantity || typeof schoolTypeQuantity !== "object")
        return "Not specified";
      return Object.entries(schoolTypeQuantity)
        .map(
          ([type, qty]) =>
            `${type}: ${qty} ${Number(qty) === 1 ? "child" : "children"}`,
        )
        .join(", ");
    };

    // Helper function to format array values
    const formatArray = (arr: any) => {
      if (!Array.isArray(arr)) return "None";
      return arr.join(", ");
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
              <div class="value">${data.fatherName || "Not provided"}</div>
            </div>
            <div class="info-row">
              <div class="label">Mother's Name</div>
              <div class="value">${data.motherName || "Not provided"}</div>
            </div>
            <div class="info-row">
              <div class="label">Guardian's Name</div>
              <div class="value">${data.guardianName || "Not provided"}</div>
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
              <div class="value">${data.alternateMobile || "Not provided"}</div>
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
              <div class="value ${data.delayInFee === "yes" ? "highlight-yes" : "highlight-no"}">${data.delayInFee === "yes" ? "⚠️ Yes" : " No"}</div>
            </div>
            ${
              data.delayInFee === "yes"
                ? `
            <div class="info-row">
              <div class="label">Reason for Delay</div>
              <div class="value">${data.reasonForDelay === "other" && data.reasonForDelayOther ? data.reasonForDelayOther : data.reasonForDelay || "Not specified"}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- SECTION 4: COMMUNITY SUPPORT -->
        <div class="info-section">
          <h3 class="section-title">🤝 Section 4: Community Support</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Primary Support Source</div>
              <div class="value">${data.supportSource === "other" && data.supportSourceOther ? data.supportSourceOther : data.supportSource || "Not specified"}</div>
            </div>
            <div class="info-row">
              <div class="label">Social Isolation</div>
              <div class="value">${data.socialIsolation === "yes" ? "⚠️ Yes" : "✅ No"}</div>
            </div>
            ${
              data.socialIsolation === "yes" && data.isolationReason
                ? `
            <div class="info-row-full">
              <div class="label">Isolation Reason</div>
              <div class="value">${data.isolationReason}</div>
            </div>
            `
                : ""
            }
            <div class="info-row-full">
              <div class="label">School Incidents</div>
              <div class="value">${
                data.schoolIncidents &&
                data.schoolIncidents.includes("Other") &&
                data.schoolIncidentsOther
                  ? formatArray([
                      ...data.schoolIncidents.filter(
                        (i: string) => i !== "Other",
                      ),
                      data.schoolIncidentsOther,
                    ])
                  : formatArray(data.schoolIncidents)
              }</div>
            </div>
          </div>
        </div>

        <!-- SECTION 5: GOVERNMENT AID -->
        <div class="info-section">
          <h3 class="section-title">🏛️ Section 5: Government Aid</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Received Govt Assistance</div>
              <div class="value">${data.govAssistance === "yes" ? "✅ Yes" : "❌ No"}</div>
            </div>
            ${
              data.govAssistance === "yes" && data.govApplication
                ? `
            <div class="info-row">
              <div class="label">Application Status</div>
              <div class="value">${data.govApplication}</div>
            </div>
            `
                : ""
            }
            ${
              data.govAssistance === "no" && data.govHelpReasons
                ? `
            <div class="info-row">
              <div class="label">Reason for No Support</div>
              <div class="value">${data.govHelpReasons === "other" && data.govHelpReasonsOther ? data.govHelpReasonsOther : data.govHelpReasons}</div>
            </div>
            `
                : ""
            }
            <div class="info-row">
              <div class="label">Bank/NBFC Short-term Help</div>
              <div class="value">${data.bankShortTerm === "yes" ? "✅ Yes" : "❌ No"}</div>
            </div>
            ${
              data.bankShortTerm === "no" && data.bankReasons
                ? `
            <div class="info-row">
              <div class="label">Reason</div>
              <div class="value">${data.bankReasons === "other" && data.bankReasonsOther ? data.bankReasonsOther : data.bankReasons}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- SECTION 6: BORROWING PATTERNS -->
        <div class="info-section">
          <h3 class="section-title">💳 Section 6: Borrowing Patterns</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Borrowing Source</div>
              <div class="value">${data.borrowingSource || "Not specified"}</div>
            </div>
            ${
              data.borrowingSource === "Bank" && data.borrowingDetails?.Bank
                ? `
            <div class="info-row">
              <div class="label">Bank Name</div>
              <div class="value">${data.borrowingDetails.Bank}</div>
            </div>
            `
                : ""
            }
            ${
              data.borrowingSource === "Relatives" &&
              data.borrowingDetails?.Relatives
                ? `
            <div class="info-row">
              <div class="label">Relation</div>
              <div class="value">${data.borrowingDetails.Relatives}</div>
            </div>
            `
                : ""
            }
            ${
              data.borrowingSource &&
              data.borrowingSource !== "Never" &&
              data.interestRate
                ? `
            <div class="info-row">
              <div class="label">Interest Rate</div>
              <div class="value">${data.interestRate === "other" && data.interestRateOther ? data.interestRateOther : data.interestRate}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- SECTION 7: SUPPORT MODEL -->
        <div class="info-section">
          <h3 class="section-title">⏱️ Section 7: Support Model</h3>
          <div class="info-grid">
            <div class="info-row">
              <div class="label">Preferred Duration</div>
              <div class="value">${data.preferredDuration || "Not specified"}</div>
            </div>
            <div class="info-row">
              <div class="label">Confidential Support</div>
              <div class="value">${data.confidentialSupport || "Not specified"}</div>
            </div>
            <div class="info-row">
              <div class="label">Would Recommend</div>
              <div class="value">${data.recommend || "Not specified"}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 8: OPEN FEEDBACK -->
        <div class="info-section">
          <h3 class="section-title">💬 Section 8: Open Feedback</h3>
          <div class="info-grid">
            <div class="info-row-full">
              <div class="label">Biggest Education Concern</div>
              <div class="value">${data.educationFear || "Not provided"}</div>
            </div>
            <div class="info-row-full">
              <div class="label">Support Needed Most</div>
              <div class="value">${data.supportNeeded || "Not provided"}</div>
            </div>
            <div class="info-row">
              <div class="label">Community Network Interest</div>
              <div class="value">${data.communityNetwork || "Not specified"}</div>
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

  // Template 1: Sent to parent after successful registration + payment
  parentRegistrationConfirmation: (data: {
    name: string;
    registrationId: number;
    paymentId: string;
    feeAmount: string;
    feePeriod: string;
    numberOfChildren: number;
    children: Array<{
      fullName: string;
      schoolName: string;
      classGrade: string;
    }>;
  }) => ({
    subject: `Registration Confirmed - Application #${data.registrationId} | Schoolfee.in`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; color: #2c3e50; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #00468E 0%, #00305F 100%); color: white; padding: 36px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
        .content { padding: 32px 30px; }
        .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
        .info-box .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600; margin-bottom: 4px; }
        .info-box .value { font-size: 14px; font-weight: 600; color: #1e293b; }
        .child-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
        .child-card .name { font-weight: 700; color: #1e3a5f; font-size: 14px; }
        .child-card .detail { font-size: 12px; color: #475569; margin-top: 3px; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
        h3 { font-size: 15px; color: #1e293b; margin: 0 0 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Submitted ✓</h1>
          <p>Schoolfee.org · National Health Financial Inclusion Initiative</p>
        </div>
        <div class="content">
          <span class="badge">Payment Successful</span>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Your parent registration application has been received and your registration fee of <strong>₹11</strong> has been successfully processed. Our team will review your application within 3–5 working days.</p>

          <div class="info-grid">
            <div class="info-box">
              <div class="label">Application ID</div>
              <div class="value">#${data.registrationId}</div>
            </div>
            <div class="info-box">
              <div class="label">Payment ID</div>
              <div class="value">${data.paymentId}</div>
            </div>
            <div class="info-box">
              <div class="label">Fee Requested</div>
              <div class="value">₹${data.feeAmount} (${data.feePeriod})</div>
            </div>
            <div class="info-box">
              <div class="label">Children Enrolled</div>
              <div class="value">${data.numberOfChildren}</div>
            </div>
          </div>

          <div class="divider"></div>
          <h3>Children Details</h3>
          ${data.children
            .map(
              (c) => `
            <div class="child-card">
              <div class="name">${c.fullName}</div>
              <div class="detail">${c.classGrade} · ${c.schoolName}</div>
            </div>
          `,
            )
            .join("")}

          <div class="divider"></div>
          <p style="font-size:13px; color:#475569;">If you have any questions, please contact us at <a href="mailto:support@schoolfee.in" style="color:#00468E;">support@schoolfee.in</a></p>
        </div>
        <div class="footer">
          Schoolfee.org · CarePay® · National Health Financial Inclusion Initiative<br/>
          © ${new Date().getFullYear()} Schoolfee. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
  }),

  // Template 2: Sent to admin when a new parent registers
  parentRegistrationAdminAlert: (data: {
    name: string;
    email: string;
    phone: string;
    registrationId: number;
    paymentId: string;
    feeAmount: string;
    numberOfChildren: number;
    city: string;
    state: string;
  }) => ({
    subject: `New Parent Registration #${data.registrationId} — ${data.name} | Schoolfee Admin`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #00305F; color: white; padding: 24px 28px; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px 28px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .label { color: #64748b; font-weight: 500; }
        .value { font-weight: 600; color: #1e293b; }
        .cta { display: block; margin: 20px 0 0; background: #00468E; color: white; text-decoration: none; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .footer { background: #f8fafc; padding: 16px 28px; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>New Parent Registration Alert</h1></div>
        <div class="content">
          <div class="row"><span class="label">Application ID</span><span class="value">#${data.registrationId}</span></div>
          <div class="row"><span class="label">Name</span><span class="value">${data.name}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>
          <div class="row"><span class="label">Location</span><span class="value">${data.city}, ${data.state}</span></div>
          <div class="row"><span class="label">Fee Requested</span><span class="value">₹${data.feeAmount}</span></div>
          <div class="row"><span class="label">Children</span><span class="value">${data.numberOfChildren}</span></div>
          <div class="row"><span class="label">Payment ID</span><span class="value">${data.paymentId}</span></div>
          <a href="https://schoolfee.in/dashboard/super-admin/parent-applications" class="cta">View in Dashboard →</a>
        </div>
        <div class="footer">Schoolfee Admin System · Auto-generated notification</div>
      </div>
    </body>
    </html>
  `,
  }),

  // Template 1: Confirmation to teacher after successful registration + payment
  teacherRegistrationConfirmation: (data: {
    name: string;
    registrationId: number;
    paymentId: string;
    school: string;
    subject: string;
    qualification: string;
    experience: string;
  }) => ({
    subject: `Teacher Registration Confirmed — Application #${data.registrationId} | Schoolfee.in`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; color: #2c3e50; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #5b21b6 0%, #3b0764 100%); color: white; padding: 36px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
        .content { padding: 32px 30px; }
        .badge { display: inline-block; background: #f3e8ff; color: #6d28d9; border: 1px solid #c4b5fd; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
        .info-box .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600; margin-bottom: 4px; }
        .info-box .value { font-size: 14px; font-weight: 600; color: #1e293b; }
        .amount-box { background: linear-gradient(135deg, #5b21b6, #7c3aed); border-radius: 10px; padding: 16px 20px; color: white; margin: 20px 0; display: flex; align-items: center; justify-content: space-between; }
        .amount-box .amount { font-size: 28px; font-weight: 800; }
        .amount-box .label { font-size: 12px; opacity: 0.8; margin-top: 2px; }
        .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Teacher Registration Confirmed ✓</h1>
          <p>Schoolfee.org · National Health Financial Inclusion Initiative</p>
        </div>
        <div class="content">
          <span class="badge">Payment Successful · ₹111</span>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Welcome to the Schoolfee Teacher Community! Your registration has been received and your membership fee of <strong>₹111</strong> has been processed. Our team will review your application within 3–5 working days.</p>

          <div class="amount-box">
            <div>
              <div class="label">Registration Fee Paid</div>
              <div class="amount">₹111</div>
            </div>
            <div style="text-align:right;">
              <div class="label">Payment ID</div>
              <div style="font-size:12px; font-weight:600; margin-top:4px;">${data.paymentId}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <div class="label">Application ID</div>
              <div class="value">#${data.registrationId}</div>
            </div>
            <div class="info-box">
              <div class="label">School</div>
              <div class="value">${data.school}</div>
            </div>
            <div class="info-box">
              <div class="label">Subject</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="info-box">
              <div class="label">Qualification</div>
              <div class="value">${data.qualification}</div>
            </div>
            <div class="info-box" style="grid-column: 1/-1">
              <div class="label">Teaching Experience</div>
              <div class="value">${data.experience}</div>
            </div>
          </div>

          <div class="divider"></div>
          <p style="font-size:13px; color:#475569;">Questions? Contact us at <a href="mailto:support@schoolfee.in" style="color:#5b21b6;">support@schoolfee.in</a></p>
        </div>
        <div class="footer">
          Schoolfee.org · CarePay® · National Health Financial Inclusion Initiative<br/>
          © ${new Date().getFullYear()} Schoolfee. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
  }),

  // Template 2: Admin alert when a teacher registers
  teacherRegistrationAdminAlert: (data: {
    name: string;
    email: string;
    phone: string;
    registrationId: number;
    paymentId: string;
    school: string;
    state: string;
    subject: string;
    employmentType: string;
  }) => ({
    subject: `New Teacher Registration #${data.registrationId} — ${data.name} | Schoolfee Admin`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #3b0764; color: white; padding: 24px 28px; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px 28px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .label { color: #64748b; font-weight: 500; }
        .value { font-weight: 600; color: #1e293b; }
        .cta { display: block; margin: 20px 0 0; background: #5b21b6; color: white; text-decoration: none; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .footer { background: #f8fafc; padding: 16px 28px; font-size: 11px; color: #94a3b8; }
        .amount-badge { background: #f3e8ff; color: #6d28d9; border-radius: 6px; padding: 3px 10px; font-size: 13px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>New Teacher Registration Alert</h1></div>
        <div class="content">
          <div class="row"><span class="label">Application ID</span><span class="value">#${data.registrationId}</span></div>
          <div class="row"><span class="label">Name</span><span class="value">${data.name}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>
          <div class="row"><span class="label">School</span><span class="value">${data.school}</span></div>
          <div class="row"><span class="label">State</span><span class="value">${data.state}</span></div>
          <div class="row"><span class="label">Subject</span><span class="value">${data.subject}</span></div>
          <div class="row"><span class="label">Employment</span><span class="value">${data.employmentType}</span></div>
          <div class="row"><span class="label">Fee Paid</span><span class="amount-badge">₹111</span></div>
          <div class="row"><span class="label">Payment ID</span><span class="value" style="font-size:12px;">${data.paymentId}</span></div>
          <a href="https://schoolfee.in/dashboard/super-admin/teacher-applications" class="cta">View in Dashboard →</a>
        </div>
        <div class="footer">Schoolfee Admin System · Auto-generated notification</div>
      </div>
    </body>
    </html>
  `,
  }),

  // (after the last existing template — teacherRegistrationAdminAlert)
// ─────────────────────────────────────────────────────────────────────────────

  schoolRegistrationConfirmation: (data: {
    schoolName: string;
    registrationId: number;
    paymentId: string;
    principalName: string;
    board: string;
    city: string;
    state: string;
  }) => ({
    subject: `School Registration Confirmed #${data.registrationId} — ${data.schoolName} | Schoolfee`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #00468e, #0066b3); color: white; padding: 28px 28px 24px; }
        .header h1 { margin: 0 0 4px; font-size: 22px; }
        .header p  { margin: 0; font-size: 13px; opacity: 0.85; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 12px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .content { padding: 24px 28px; }
        .greeting { font-size: 15px; color: #1e293b; margin-bottom: 16px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .label { color: #64748b; font-weight: 500; }
        .value { font-weight: 600; color: #1e293b; }
        .amount-badge { background: #e0f2fe; color: #0369a1; border-radius: 6px; padding: 3px 10px; font-size: 13px; font-weight: 700; }
        .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin: 18px 0; font-size: 13px; color: #166534; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 16px 28px; font-size: 11px; color: #94a3b8; line-height: 1.6; }
        .footer a { color: #00468e; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>School Registration Confirmed ✓</h1>
          <p>Your school has been successfully registered with Schoolfee</p>
          <span class="badge">Application #${data.registrationId}</span>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${data.principalName}</strong>,</p>
          <p style="font-size:14px;color:#475569;margin-bottom:18px;">
            We have received your school registration for <strong>${data.schoolName}</strong>. 
            Your payment has been confirmed and your application is under review.
          </p>
          <div class="row"><span class="label">School Name</span><span class="value">${data.schoolName}</span></div>
          <div class="row"><span class="label">Application ID</span><span class="value">#${data.registrationId}</span></div>
          <div class="row"><span class="label">Affiliation Board</span><span class="value">${data.board}</span></div>
          <div class="row"><span class="label">Location</span><span class="value">${data.city}, ${data.state}</span></div>
          <div class="row"><span class="label">Registration Fee</span><span class="amount-badge">₹1111 Paid</span></div>
          <div class="row"><span class="label">Payment Reference</span><span class="value" style="font-size:12px;font-family:monospace;">${data.paymentId}</span></div>
          <div class="info-box">
            <strong>What happens next?</strong><br>
            Our team will review your application within <strong>3–5 working days</strong>. 
            We may contact you if additional documents are required. Once approved, 
            you will receive your Schoolfee school dashboard access credentials.
          </div>
        </div>
        <div class="footer">
          This is an automated confirmation from Schoolfee · <a href="https://schoolfee.in">schoolfee.in</a><br>
          For support, contact us at support@schoolfee.in
        </div>
      </div>
    </body>
    </html>
  `,
  }),

  schoolRegistrationAdminAlert: (data: {
    schoolName: string;
    schoolType: string;
    registrationId: number;
    paymentId: string;
    principalName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    board: string;
    totalStudents: string;
  }) => ({
    subject: `New School Registration #${data.registrationId} — ${data.schoolName} | Schoolfee Admin`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #00468e; color: white; padding: 24px 28px; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px 28px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .label { color: #64748b; font-weight: 500; }
        .value { font-weight: 600; color: #1e293b; }
        .cta { display: block; margin: 20px 0 0; background: #00468e; color: white; text-decoration: none; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .footer { background: #f8fafc; padding: 16px 28px; font-size: 11px; color: #94a3b8; }
        .amount-badge { background: #e0f2fe; color: #0369a1; border-radius: 6px; padding: 3px 10px; font-size: 13px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>New School Registration Alert 🏫</h1></div>
        <div class="content">
          <div class="row"><span class="label">Application ID</span><span class="value">#${data.registrationId}</span></div>
          <div class="row"><span class="label">School Name</span><span class="value">${data.schoolName}</span></div>
          <div class="row"><span class="label">School Type</span><span class="value">${data.schoolType}</span></div>
          <div class="row"><span class="label">Board</span><span class="value">${data.board}</span></div>
          <div class="row"><span class="label">Principal</span><span class="value">${data.principalName}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>
          <div class="row"><span class="label">Location</span><span class="value">${data.city}, ${data.state}</span></div>
          <div class="row"><span class="label">Total Students</span><span class="value">${data.totalStudents}</span></div>
          <div class="row"><span class="label">Fee Paid</span><span class="amount-badge">₹1111</span></div>
          <div class="row"><span class="label">Payment ID</span><span class="value" style="font-size:12px;font-family:monospace;">${data.paymentId}</span></div>
          <a href="https://schoolfee.in/dashboard/super-admin/schools/school-applications" class="cta">View in Dashboard →</a>
        </div>
        <div class="footer">Schoolfee Admin System · Auto-generated notification</div>
      </div>
    </body>
    </html>
  `,
  }),

   // ── Donation confirmation to donor ────────────────────────────────────────
  donationConfirmation: (data: {
    name: string;
    donationId: number;
    receiptNumber: string;
    paymentId: string;
    donationAmount: number;
    financialYear: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    organizationName: string | null;
    isAnonymous: boolean;
  }) => ({
    subject: `Donation Receipt ${data.receiptNumber} — Thank You | Schoolfee.org / CHM`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 0; color: #2c3e50; }
        .container { max-width: 620px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0B4C8A 0%, #094076 100%); color: white; padding: 36px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.85; }
        .content { padding: 28px 30px; }
        .receipt-box { border: 2px solid #0B4C8A; border-radius: 10px; padding: 18px 20px; margin: 16px 0; background: #f0f6ff; }
        .receipt-num { font-size: 18px; font-weight: 800; color: #0B4C8A; letter-spacing: 1px; }
        .receipt-sub { font-size: 11px; color: #555; margin-top: 3px; }
        .amount-row { background: #0B4C8A; color: white; border-radius: 8px; padding: 14px 20px; margin: 14px 0; display: flex; justify-content: space-between; align-items: center; }
        .amount-big { font-size: 24px; font-weight: 800; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 7px; padding: 10px 13px; }
        .info-box .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; font-weight: 600; margin-bottom: 3px; }
        .info-box .val { font-size: 13px; font-weight: 600; color: #1e293b; }
        .tax-note { background: #fffbe6; border: 1px solid #f0c040; border-radius: 6px; padding: 12px 16px; margin: 16px 0; font-size: 12px; line-height: 1.6; color: #555; }
        .footer { background: #f8fafc; padding: 18px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .footer a { color: #0B4C8A; text-decoration: none; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Donation ❤️</h1>
          <p>Schoolfee.org · An Initiative of Community Health Mission (CHM)</p>
        </div>
        <div class="content">
          <p>Dear <strong>${data.isAnonymous ? "Donor" : data.name}</strong>,</p>
          <p>Your donation has been received and processed successfully. Your generosity directly supports children's education through Schoolfee.org.</p>

          <div class="receipt-box">
            <div class="receipt-num">${data.receiptNumber}</div>
            <div class="receipt-sub">Official 80G Receipt — Financial Year ${data.financialYear}</div>
          </div>

          <div class="amount-row">
            <div>
              <div style="font-size:12px;opacity:0.8;">Donation Amount</div>
              <div class="amount-big">₹${data.donationAmount.toLocaleString("en-IN")}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;opacity:0.8;">Payment ID</div>
              <div style="font-size:12px;font-weight:600;margin-top:2px;">${data.paymentId}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <div class="lbl">Donation ID</div>
              <div class="val">#${data.donationId}</div>
            </div>
            <div class="info-box">
              <div class="lbl">PAN Number</div>
              <div class="val">${data.isAnonymous ? "On Record" : data.panNumber}</div>
            </div>
            <div class="info-box">
              <div class="lbl">Financial Year</div>
              <div class="val">${data.financialYear}</div>
            </div>
            <div class="info-box">
              <div class="lbl">Purpose</div>
              <div class="val">Education Fund</div>
            </div>
            ${data.organizationName ? `
            <div class="info-box" style="grid-column:1/-1">
              <div class="lbl">Organisation</div>
              <div class="val">${data.organizationName}</div>
            </div>` : ""}
          </div>

          ${!data.isAnonymous ? `
          <hr>
          <p style="font-size:12px;color:#555;"><strong>Address on record:</strong><br>
          ${data.address}, ${data.city}, ${data.state} – ${data.pincode}</p>` : ""}

          <div class="tax-note">
            <strong>📌 Section 80G Tax Deduction:</strong><br>
            This donation qualifies for income tax deduction under Section 80G of the Income Tax Act, 1961.
            Please retain this email as your official receipt. Donations are deductible up to 50% of the
            donated amount (subject to 10% of Adjusted Gross Total Income).
            For FY ${data.financialYear} ITR filing, quote receipt: <strong>${data.receiptNumber}</strong>.
          </div>

          <p style="font-size:13px;color:#475569;">Questions? Contact us at <a href="mailto:donations@schoolfee.org" style="color:#0B4C8A;">donations@schoolfee.org</a></p>
          <p style="margin-top:20px;">Warm regards,<br><strong>Team Schoolfee.org</strong></p>
        </div>
        <div class="footer">
          Schoolfee.org · An Initiative of CHM · Registered under 12A &amp; 80G of IT Act 1961<br>
          <a href="https://schoolfee.org">schoolfee.org</a> · © ${new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  }),

  // ── Admin alert for new donation ──────────────────────────────────────────
  donationAdminAlert: (data: {
    name: string;
    email: string;
    phone: string;
    donationId: number;
    receiptNumber: string;
    paymentId: string;
    donationAmount: number;
    panNumber: string;
    city: string;
    state: string;
    organizationName: string | null;
    organizationType: string;
    isAnonymous: boolean;
  }) => ({
    subject: `💰 New Donation #${data.donationId} — ₹${data.donationAmount.toLocaleString("en-IN")} | Schoolfee Admin`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #0B4C8A; color: white; padding: 22px 28px; }
        .header h1 { margin: 0; font-size: 19px; }
        .header .sub { font-size: 12px; opacity: 0.8; margin-top: 4px; }
        .content { padding: 22px 28px; }
        .amount-bar { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 12px 18px; margin-bottom: 16px; }
        .amount-bar .amt { font-size: 22px; font-weight: 800; color: #16a34a; }
        .amount-bar .sub { font-size: 11px; color: #555; margin-top: 2px; }
        .row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .label { color: #64748b; font-weight: 500; }
        .value { font-weight: 600; color: #1e293b; }
        .cta { display: block; margin: 18px 0 0; background: #0B4C8A; color: white; text-decoration: none; text-align: center; padding: 11px 22px; border-radius: 8px; font-weight: 600; font-size: 13px; }
        .footer { background: #f8fafc; padding: 14px 28px; font-size: 10px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Donation Received 💰</h1>
          <div class="sub">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
        </div>
        <div class="content">
          <div class="amount-bar">
            <div class="amt">₹${data.donationAmount.toLocaleString("en-IN")}</div>
            <div class="sub">Receipt: ${data.receiptNumber}</div>
          </div>
          <div class="row"><span class="label">Donation ID</span><span class="value">#${data.donationId}</span></div>
          <div class="row"><span class="label">Donor Name</span><span class="value">${data.isAnonymous ? "Anonymous" : data.name}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>
          <div class="row"><span class="label">PAN</span><span class="value">${data.panNumber}</span></div>
          <div class="row"><span class="label">Location</span><span class="value">${data.city}, ${data.state}</span></div>
          ${data.organizationName ? `<div class="row"><span class="label">Organisation</span><span class="value">${data.organizationName} (${data.organizationType})</span></div>` : ""}
          <div class="row"><span class="label">Payment ID</span><span class="value" style="font-size:11px;font-family:monospace;">${data.paymentId}</span></div>
          <div class="row"><span class="label">Anonymous</span><span class="value">${data.isAnonymous ? "Yes" : "No"}</span></div>
          <a href="https://schoolfee.in/dashboard/super-admin/donations" class="cta">View in Admin Dashboard →</a>
        </div>
        <div class="footer">Schoolfee Admin System · Auto-generated donation alert</div>
      </div>
    </body>
    </html>
    `,
  }),

  teacherDashboardAccess: (data: {
    name: string;
    registrationId: number;
    dashboardUrl: string;
    email: string;
  }) => ({
    subject: `Your Teacher Dashboard Access is Ready — Schoolfee.in`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; padding: 0; color: #2c3e50; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #00305F 0%, #00468E 60%, #0058B4 100%); color: white; padding: 36px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.85; }
        .content { padding: 32px 30px; }
        .content p { color: #2c3e50; margin: 14px 0; font-size: 15px; line-height: 1.6; }
        .access-box { background: linear-gradient(135deg, #EEF4FB, #F6F5F1); border: 2px solid #00468E; border-radius: 10px; padding: 24px; margin: 24px 0; text-align: center; }
        .access-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 8px; }
        .access-box .url { font-size: 14px; font-weight: 600; color: #00468E; word-break: break-all; margin-bottom: 16px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #00305F, #00468E); color: white !important; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #6b7280; font-weight: 500; }
        .info-value { font-weight: 600; color: #1e293b; }
        .steps { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
        .steps p { margin: 0 0 10px 0; font-weight: 600; color: #00468E; font-size: 13px; }
        .steps ol { margin: 0; padding-left: 18px; color: #444; font-size: 13px; }
        .steps li { margin: 6px 0; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Dashboard Access Ready</h1>
          <p>Schoolfee Teacher Registration — Application #${data.registrationId}</p>
        </div>
        <div class="content">
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Your teacher registration has been received and your payment has been processed successfully. You can now access your personalized teacher dashboard using the link below.</p>

          <div class="access-box">
            <div class="label">Your Dashboard URL</div>
            <div class="url">${data.dashboardUrl}</div>
            <a href="${data.dashboardUrl}" class="btn">Access Your Dashboard</a>
          </div>

          <div class="info-row">
            <span class="info-label">Registered Email</span>
            <span class="info-value">${data.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Application ID</span>
            <span class="info-value">#${data.registrationId}</span>
          </div>

          <div class="steps">
            <p>How to log in to your dashboard:</p>
            <ol>
              <li>Click the dashboard link above or visit <strong>${data.dashboardUrl}</strong></li>
              <li>Enter your registered email address: <strong>${data.email}</strong></li>
              <li>An OTP will be sent to your email — enter it to log in</li>
              <li>You will be taken directly to your teacher dashboard</li>
            </ol>
          </div>

          <p style="font-size:13px;color:#475569;">Our team will review your application within 3 to 5 working days. You will receive a notification once your profile is approved. For any questions, write to <a href="mailto:support@schoolfee.in" style="color:#00468E;">support@schoolfee.in</a></p>
        </div>
        <div class="footer">
          Schoolfee.org · CarePay® · National Health Financial Inclusion Initiative<br/>
          &copy; ${new Date().getFullYear()} Schoolfee. All rights reserved.
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
    data,
  );
} 