import type { Metadata } from "next";
import ProductCarousel from "@/components/ProductCarousel";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Products — Skyshark",
  description: "Discover Skyshark's collectible 3D figurine drops.",
};

export default function ProductsPage() {
  return (
    <>
      <ProductCarousel />
      <ProductGrid />
      <Footer />
    </>
  );
}
