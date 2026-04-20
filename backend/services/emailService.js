import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create nodemailer transporter
// Using Gmail SMTP - you can configure this with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// Send enrollment notification email
export const sendEnrollmentNotificationEmail = async (
  teacherEmail,
  teacherName,
  studentName,
  courseName,
) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">New Course Enrollment!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A student has enrolled in your course</p>
        </div>
        
        <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0; color: #333;">Hi <strong>${teacherName}</strong>,</p>
          <p style="margin: 0 0 20px 0; color: #555; line-height: 1.6;">
            Great news! <strong>${studentName}</strong> has just enrolled in your course <strong>"${courseName}"</strong>.
          </p>
          <p style="margin: 0 0 20px 0; color: #555; line-height: 1.6;">
            Log in to your teacher dashboard to view the enrollment details and manage your students.
          </p>
        </div>
        
        <div style="background: #e8f4f8; padding: 15px; border-left: 4px solid #667eea; margin-bottom: 20px;">
          <p style="margin: 0; color: #333; font-size: 14px;">
            <strong>Student Name:</strong> ${studentName}<br>
            <strong>Course:</strong> ${courseName}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © 2024 Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@learningplatform.com",
      to: teacherEmail,
      subject: `New Enrollment: ${studentName} joined ${courseName}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is configured correctly");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
