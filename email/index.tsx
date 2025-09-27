// lib/email/email-service.ts

import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order, ShippingAddress } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";
import OTPEmail from "./otp-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({
  order,
}: {
  order: Order & { shippingAddress: ShippingAddress };
}) => {
  try {
    console.log(
      `[EMAIL-SERVICE] Attempting to send purchase receipt email to: ${order.user.email}`
    );

    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: `Order Confirmation ${order.id.substring(0, 8)}`,
      react: <PurchaseReceiptEmail order={order} />,
    });

    if (error) {
      console.error("[EMAIL-SERVICE] Resend returned an error:", error);
      throw new Error("Failed to send email due to Resend API error.");
    }

    console.log(
      `[EMAIL-SERVICE] Purchase receipt email sent successfully! Message ID: ${data?.id}`
    );
  } catch (e) {
    console.error(
      "[EMAIL-SERVICE] A critical error occurred while sending purchase receipt email:",
      e
    );
    throw e;
  }
};

// NEW FUNCTION: Send OTP email
export const sendOTPEmail = async ({
  email,
  userName,
  otp,
}: {
  email: string;
  userName: string;
  otp: string;
}) => {
  try {
    console.log(`[EMAIL-SERVICE] Attempting to send OTP email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: `Your ${APP_NAME} Password Reset OTP`,
      react: <OTPEmail userName={userName} otp={otp} />,
    });

    if (error) {
      console.error(
        "[EMAIL-SERVICE] Resend returned an error for OTP email:",
        error
      );
      throw new Error("Failed to send OTP email due to Resend API error.");
    }

    console.log(
      `[EMAIL-SERVICE] OTP email sent successfully! Message ID: ${data?.id}`
    );
  } catch (e) {
    console.error(
      "[EMAIL-SERVICE] A critical error occurred while sending OTP email:",
      e
    );
    throw e;
  }
};

