import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "on-repeat",
  description: "Your feelings, on repeat.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
