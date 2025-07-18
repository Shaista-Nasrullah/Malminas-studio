// components/checkout/LoggedInContact.tsx

"use client";

import { useState } from "react";
// --- 1. IMPORT `signOut` FROM NEXT-AUTH AND `useRouter` FROM NEXT.JS ---
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

interface LoggedInContactProps {
  email: string;
}

const LoggedInContact = ({ email }: LoggedInContactProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Hook to control routing

  const toggleOpen = () => setIsOpen(!isOpen);

  // --- 2. CREATE THE LOGOUT HANDLER FUNCTION ---
  const handleLogout = async () => {
    // This function will clear the user's session cookie but won't redirect.
    await signOut({ redirect: false });

    // After the session is cleared, manually refresh the page.
    // This tells Next.js to re-fetch the server data for the current route.
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-gray-500">Account</p>
        <button
          onClick={toggleOpen}
          aria-label="Toggle user menu"
          className="bg-[#998B20]/10 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#998B20]/50"
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#998B20]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#998B20]" />
          )}
        </button>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p className="text-gray-800 font-medium">{email}</p>

        {isOpen && (
          // --- 3. USE A BUTTON INSTEAD OF A LINK ---
          // A button is semantically more correct for an action like logging out.
          <button
            onClick={handleLogout}
            className="font-medium text-[#998B20] hover:text-[#998B20]/80 text-sm"
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
};

export default LoggedInContact;
