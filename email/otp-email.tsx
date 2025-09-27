// email/otp-email.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { APP_NAME } from "@/lib/constants";

interface OTPEmailProps {
  userName: string;
  otp: string;
}

export default function OTPEmail({ userName, otp }: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {APP_NAME} Password Reset OTP</Preview>
      <Tailwind>
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-6">
            <Text className="text-xl font-bold">Password Reset OTP</Text>
            <Text>Hi {userName},</Text>
            <Text>
              You requested a password reset for your {APP_NAME} account.
            </Text>
            <Text>
              Please use the following One-Time Password (OTP) to verify your
              identity:
            </Text>
            <Section className="text-center my-8">
              <Text className="text-4xl font-extrabold tracking-widest text-blue-600">
                {otp}
              </Text>
            </Section>
            <Text>
              This OTP is valid for 10 minutes. Do not share this code with
              anyone.
            </Text>
            <Text>
              If you did not request a password reset, please ignore this email.
            </Text>
            <Text>Thanks,</Text>
            <Text>{APP_NAME} Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// // email/reset-password-email.tsx
// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Html,
//   Preview,
//   Section,
//   Tailwind,
//   Text,
// } from "@react-email/components";
// import { APP_NAME } from "@/lib/constants";

// interface ResetPasswordEmailProps {
//   userName: string;
//   resetLink: string;
// }

// export default function ResetPasswordEmail({
//   userName,
//   resetLink,
// }: ResetPasswordEmailProps) {
//   return (
//     <Html>
//       <Head />
//       <Preview>Reset your {APP_NAME} password</Preview>
//       <Tailwind>
//         <Body className="font-sans bg-white">
//           <Container className="max-w-xl p-6">
//             <Text className="text-xl font-bold">Password Reset Request</Text>
//             <Text>Hi {userName},</Text>
//             <Text>
//               We received a request to reset the password for your account.
//             </Text>
//             <Section className="text-center my-8">
//               <Button
//                 href={resetLink}
//                 className="bg-blue-600 text-white py-3 px-6 rounded-md text-lg"
//               >
//                 Reset Password
//               </Button>
//             </Section>
//             <Text>
//               This link will expire in 1 hour. If you did not request a password
//               reset, please ignore this email.
//             </Text>
//             <Text>Thanks,</Text>
//             <Text>{APP_NAME} Team</Text>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// }
