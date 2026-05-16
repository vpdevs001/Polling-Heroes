import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const isEmailConfigured = () => {
  return (
    process.env.EMAIL_USER && 
    process.env.EMAIL_PASS &&
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT
  );
};


export const sendVerificationEmail = async (email: string, token: string) => {
  if (!isEmailConfigured()) {
    console.warn("⚠️ SMTP is not configured. Email verification skipped.");
    console.info(`👉 Verification URL for ${email}: ${process.env.FRONTEND_URL}/verify-email?token=${token}`);
    return;
  }
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Polling Heroes" <${process.env.EMAIL_FROM || "noreply@pollingheroes.com"}>`,
    to: email,
    subject: "Verify Your Email - Polling Heroes",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px;">
        <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Welcome to Polling Heroes!</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Thank you for signing up. Please verify your email address by clicking the button below. This link will expire in 24 hours.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Verify Email Address
        </a>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Polling Heroes. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
