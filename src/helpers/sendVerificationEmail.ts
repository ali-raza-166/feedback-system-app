import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmailTemplate({ username, otp: verifyCode }),
    });
    console.log("verification email sent");
    console.log({ email });
    console.log({ verifyCode });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
