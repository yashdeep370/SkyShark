import type { Metadata } from "next";
import CartCheckout from "@/components/CartCheckout";

export const metadata: Metadata = {
  title: "Checkout — Skyshark",
  description: "Review your bag and complete your Skyshark order.",
};

export default function CartPage() {
  return <CartCheckout />;
}
