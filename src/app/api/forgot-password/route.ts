import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { sendResponse } from "@/lib/responseHandler";
import { sendResetPasswordEmail } from "@/helpers/sendResetPasswordEmail";
import ResetToken from "@/model/ResetToken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const user = await UserModel.findOne({ email });
    //common security practice to prevent enumeration attaks, where an attacker can determine if the email is registered in the system
    if (!user) {
      return sendResponse({
        status: 200,
        success: true,
        message: "If an account with that email exists, we have sent a reset link.",
      });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    await ResetToken.create({
      userId: user._id,
      token,
      // expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      expiresIn: "30s",
    });

    const resetLink = `${process.env.PUBLIC_DOMAIN}/reset-password?token=${token}`;
    await sendResetPasswordEmail(user.username, user.email, resetLink);
    return sendResponse({
      status: 200,
      success: true,
      message: "If an account with that email exists, we have sent a reset link.",
      data: { token, resetLink },
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return sendResponse({
      status: 500,
      success: false,
      message: "Error sending reset password email",
    });
  }
}
