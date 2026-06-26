import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { sendResponse } from "@/lib/responseHandler";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ZodError } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  //check if a verified user with same username exists, return from there.
  //check if a user with same email exists, if he is a verified user, return from there, if he not a verified user
  try {
    const { username, email, password } = await request.json();
    const validateData = await signUpSchema.parseAsync({ username, email, password });
    console.log({ validateData });
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return sendResponse({
        status: 400,
        success: false,
        message: "Username already taken",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      //exising user, but verified, simply return.
      if (existingUserByEmail.isVerified) {
        return sendResponse({
          status: 400,
          success: false,
          message: "User already exists with this email",
        });
      } else {
        //exising user, but not verified, create valid verification code, and save in db,
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      //New user, save in db
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return sendResponse({
        status: 500,
        success: false,
        message: emailResponse.message,
      });
    }

    return sendResponse({
      status: 201,
      success: true,
      message: "User registered successfully. Please verify your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendResponse({
        status: 400,
        success: false,
        message: "Validation error",
        data: { errors: validationErrors },
      });
    }
    return sendResponse({
      status: 500,
      success: false,
      message: "Error registering user",
    });
  }
}
