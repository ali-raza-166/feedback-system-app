"use client";
import UserProfileForm from "../components/UserProfileForm";
import ProfilePictureForm from "../components/ProfilePictureForm";
import { useSession } from "next-auth/react";
export default function ProfilePage() {
  const { data: session } = useSession();
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      {/* <UserProfileForm /> */}
      <ProfilePictureForm username={session?.user.username} />
    </div>
  );
}
