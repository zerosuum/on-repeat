import { VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start-2p",
});

export const metadata = {
  title: "on-repeat: The Mixtape Mission",
  description:
    "Craft a message, pair it with a legendary track, and send it to your Player 2.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "font-sans antialiased",
          vt323.variable,
          pressStart2P.variable
        )}
      >
        <main className="min-h-screen">{children}</main>
        <Toaster
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              fontFamily: "var(--font-vt323)",
              border: "2px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
