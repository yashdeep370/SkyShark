import type { Metadata } from "next";
import { Inter, Bebas_Neue, Anton } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartToast from "@/components/CartToast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Skyshark",
  description: "Where your ideas escape the screen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${anton.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
