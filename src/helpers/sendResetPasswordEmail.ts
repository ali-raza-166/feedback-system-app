import { resend } from "@/lib/resend";
import ResetPasswordEmailTemplate from "../../emails/ResetPasswordEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendResetPasswordEmail(
  username: string,
  email: string,
  resetLink: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: ResetPasswordEmailTemplate({ username, resetLink }),
    });
    console.log("verification email sent");
    console.log({ email });
    console.log({ email, resetLink });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
