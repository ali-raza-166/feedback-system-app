"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { LogOut, UserRound, MessageSquareDot, Cog, BadgeHelp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </Link>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt="User Image" />
                    <AvatarFallback className="text-xl bg-white text-gray-900 flex items-center justify-center h-full w-full">
                      {session.user.username.toUpperCase()[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-75 p-4" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-medium leading-none">
                      {session.user.username}
                    </p>
                    <p className="text-sm leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      className="flex items-center gap-2"
                      href={`/profile/${session.user.username}`}
                    >
                      <UserRound className="h-5 w-6" />
                      <p className="text-md pt-1 w-full md:w-auto text-black">Profile</p>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link className="flex items-center gap-2" href={`/profile`}>
                      <MessageSquareDot className="h-5 w-6" />
                      <p className="text-md pt-1 w-full md:w-auto text-black">Messages</p>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link className="flex items-center gap-2" href={`/profile`}>
                      <BadgeHelp className="h-5 w-6" />
                      <p className="text-md pt-1 w-full md:w-auto text-black">Help</p>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div className="flex items-center gap-2" onClick={() => signOut()}>
                      <LogOut className="h-5 w-6" />
                      <p className="text-md w-full md:w-auto text-black">Logout</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
