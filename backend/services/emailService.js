const nodemailer = require('nodemailer');

// Create transporter lazily inside the function so env vars are
// always read at call-time (important on Render where vars load after module init).
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(`Email env vars missing — EMAIL_USER: ${user ? 'set' : 'MISSING'}, EMAIL_PASS: ${pass ? 'set' : 'MISSING'}`);
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,          // STARTTLS (NOT SSL on 465)
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false, // handles some cloud-host cert issues
    },
  });
};

const sendOTP = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"IntelliTour" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'IntelliTour - Verify Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Welcome to IntelliTour!</h2>
        <p style="font-size: 16px; color: #333;">Thank you for signing up. To complete your registration, please use the verification code below:</p>
        <div style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #111827; margin: 0;">${otpCode}</h1>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 IntelliTour. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };

