// components/checkout/ContactInformation.tsx

import { auth } from "@/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// --- 1. IMPORT THE NEW CLIENT COMPONENT ---
import LoggedInContact from "./LoggedInContact";

const ContactInformation = async () => {
  const session = await auth();

  // --- LOGGED IN VIEW ---
  if (session?.user?.email) {
    // --- 2. RENDER THE CLIENT COMPONENT, PASSING THE EMAIL AS A PROP ---
    return <LoggedInContact email={session.user.email} />;
  }

  // --- LOGGED OUT (GUEST) VIEW (This part remains unchanged) ---
  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-lg font-medium text-gray-900">Contact</h2>
        <div className="text-sm">
          <Link
            href="/sign-in"
            className="font-medium text-[#998B20] hover:text-[#998B20]/80"
          >
            Log in
          </Link>
        </div>
      </div>

      <Input
        type="email"
        name="email"
        placeholder="Email or mobile phone number"
        className="mb-3"
        required
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          name="newsletter"
          defaultChecked
          className="data-[state=checked]:bg-[#998B20] data-[state=checked]:text-white border-gray-400"
        />
        <Label
          htmlFor="newsletter"
          className="text-sm font-normal text-gray-700"
        >
          Send me news & offers on Email/SMS/Whatsapp
        </Label>
      </div>
    </div>
  );
};

export default ContactInformation;
