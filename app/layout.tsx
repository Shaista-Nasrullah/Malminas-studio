import type { Metadata } from "next";
// 1. Import Poppins instead of Inter
import { Poppins } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

// 2. Configure and instantiate the Poppins font
// We include a range of weights to be used throughout the app.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, Semi-bold, Bold
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`, // Use template literal for clarity
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. Apply the new Poppins font className to the body */}
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
