import { generateOTP } from "../helper/otpGenerator";
import { sendVerificationEmail } from "./mailer";

export interface OTPData {
  otp: string;
  otpExpiry: Date;
  otpRequestedAt: Date;
}

/**
 * Generates OTP data with expiry and request timestamp
 * @returns OTP data object with OTP, expiry time (10 minutes), and request timestamp
 */
export function generateOTPData(): OTPData {
  const otp = generateOTP();
  const now = Date.now();
  const otpExpiry = new Date(now + 10 * 60 * 1000); // 10 minutes
  const otpRequestedAt = new Date(now);

  return { otp, otpExpiry, otpRequestedAt };
}

/**
 * Generates email address from UID
 * @param UID - User's university ID
 * @returns Email address in format: UID@cuchd.in
 */
export function getEmailFromUID(UID: string): string {
  return `${UID.trim().toLowerCase()}@cuchd.in`;
}

/**
 * Generates OTP and sends verification email
 * @param UID - User's university ID
 * @returns OTP data object
 */
export async function generateAndSendOTP(UID: string): Promise<OTPData> {
  const otpData = generateOTPData();
  const email = getEmailFromUID(UID);
  await sendVerificationEmail(email, otpData.otp);
  return otpData;
}
