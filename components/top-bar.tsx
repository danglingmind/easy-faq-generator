"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "@/components/checkout-dialog";

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
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleUpgrade = () => {
    if (!isSignedIn) {
      // If not signed in, the SignInButton will handle it
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">FAQ Embed Generator</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isPaid && (
            <Button variant="default" size="sm" onClick={handleUpgrade}>
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
      {isSignedIn && (
        <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      )}
    </>
  );
}
