import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log({ user });
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        console.log({ session });
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

/*
Creation of JWT Token
During Authentication:

When a user attempts to sign in using the credentials provider (or any other provider), NextAuth.js invokes the authorize method 
specified in your provider's configuration.
If the authorize method successfully authenticates the user (e.g., by verifying the password against the hashed password stored 
in the database), it returns a user object.
Upon successful authentication, NextAuth.js creates a JWT token. This happens automatically as part of the session management 
when the strategy is set to "jwt" in the NextAuth configuration.

Callbacks:
The JWT token can be customized and enriched with additional information using the jwt callback. This callback is invoked whenever
a new JWT token is created or updated.
The session callback is used to customize the session object, which can include transferring additional fields from the JWT token 
to the session. */

/*
{
  $or: [
    { email: 'john.doe@example.com' },
    { username: 'john.doe@example.com' }
  ]
    findOne will search for a document in the collection where either the email field or the username field is 'john.doe@example.com'.
} */
