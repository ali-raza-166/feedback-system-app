import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import ResetToken from "@/model/ResetToken";
import dbConnect from "@/lib/dbConnect";
import { sendResponse } from "@/lib/responseHandler";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { token, newPassword } = await request.json();
    console.log(token, newPassword);
    const storedToken = await ResetToken.findOne({ token });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      await ResetToken.deleteOne({ token });
      return sendResponse({
        status: 400,
        success: false,
        message: "Invalid or expired token",
      });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return sendResponse({
        status: 400,
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await ResetToken.deleteOne({ token });

    return sendResponse({
      status: 200,
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return sendResponse({
      status: 500,
      success: false,
      message: "Failed to reset password",
    });
  }
}
