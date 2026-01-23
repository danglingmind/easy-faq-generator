"use client";

import { UserButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  user: UserResource | null;
  isSignedIn: boolean;
  isPaid: boolean;
}

export function TopBar({
  user,
  isSignedIn,
  isPaid,
}: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">FAQ Embed Generator</h1>
      </div>
      <div className="flex items-center gap-2">
        {!isPaid && (
          <Button variant="default" size="sm">
            Upgrade
          </Button>
        )}
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
