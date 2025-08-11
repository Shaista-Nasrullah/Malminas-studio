// lib/email/email-service.ts

import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order, ShippingAddress } from "@/types"; // Import ShippingAddress
import PurchaseReceiptEmail from "./purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({
  order,
}: {
  order: Order & { shippingAddress: ShippingAddress };
}) => {
  // --- [THE DEBUGGING FIX] ---
  // We will now capture the response from Resend to see what's happening.
  try {
    console.log(
      `[EMAIL-SERVICE] Attempting to send email to: ${order.user.email}`
    );

    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: `Order Confirmation ${order.id.substring(0, 8)}`, // Using a shorter ID
      react: <PurchaseReceiptEmail order={order} />,
    });

    // If Resend returns an error object, log it and throw an error
    if (error) {
      console.error("[EMAIL-SERVICE] Resend returned an error:", error);
      // Throwing an error here will ensure our main try...catch block in order.actions.ts logs it.
      throw new Error("Failed to send email due to Resend API error.");
    }

    // If successful, log the email ID from Resend
    console.log(
      `[EMAIL-SERVICE] Email sent successfully! Message ID: ${data?.id}`
    );
  } catch (e) {
    // This will catch any other network errors or issues during the send process.
    console.error(
      "[EMAIL-SERVICE] A critical error occurred while sending email:",
      e
    );
    // Re-throw the error so the calling function knows something went wrong.
    throw e;
  }
};
