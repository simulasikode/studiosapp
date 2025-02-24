// app/service/color-process/components/Authentication.tsx
"use client";

import Link from "next/link";
import { useFirebaseCalculations } from "../hooks/useFirebaseCalculations";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

const Authentication = () => {
  const { user, signOut, isGuestUser, isSigningOut } =
    useFirebaseCalculations(); // Destructure isSigningOut

  if (user && !isGuestUser) {
    // Logged-in, not guest user. Show Logout.
    return (
      <button
        className="text-sm" // Use button classes, if any
        onClick={signOut}
        disabled={isSigningOut} // Disable while signing out
      >
        {isSigningOut ? (
          "Signing out..."
        ) : (
          <>
            <FaSignOutAlt className="inline-block mr-1" /> Logout
          </>
        )}
      </button>
    );
  }

  // Not logged in or is a guest user. Show Login/Signup link.
  return (
    <Link href="/color-process/auth/login">
      <button className="text-sm hover:underline">
        <FaSignInAlt className="inline-block mr-1" /> Login / Signup
      </button>
    </Link>
  );
};

export default Authentication;
