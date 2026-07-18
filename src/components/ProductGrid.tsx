"use client";

import { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  accent: string;
  glow: string;
  image: string;
  description: string;
  rating: number;
  features: { label: string; value: string }[];
};

const PRODUCTS: Product[] = [
  {
    id: "falcon-wing",
    name: "Falcon Wing",
    price: "$49",
    priceValue: 49,
    accent: "#2E9BFF",
    glow: "#1B4E8C",
    image:
      "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    description: "A sleek aerodynamic figure, sculpted for display and print.",
    rating: 4,
    features: [
      { label: "Print-Ready", value: "Optimized mesh, zero supports" },
      { label: "PBR Textures", value: "4K materials included" },
      { label: "File Formats", value: "STL, OBJ, FBX" },
    ],
  },
  {
    id: "storm-rider",
    name: "Storm Rider",
    price: "$59",
    priceValue: 59,
    accent: "#E84FD1",
    glow: "#7A2C74",
    image:
      "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    description: "Bold silhouette with dynamic detailing for collectors.",
    rating: 5,
    features: [
      { label: "Rigged Mesh", value: "Ready for animation" },
      { label: "Scale Options", value: "1:6 to 1:24" },
      { label: "License", value: "Personal & commercial" },
    ],
  },
  {
    id: "nova-blade",
    name: "Nova Blade",
    price: "$39",
    priceValue: 39,
    accent: "#2FD1B0",
    glow: "#155C4E",
    image:
      "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    description: "Minimal form, maximum presence — built for fast printing.",
    rating: 4,
    features: [
      { label: "Low Poly", value: "Under 50K triangles" },
      { label: "Hollow Base", value: "Filament-friendly" },
      { label: "Support Files", value: "Included, pre-sliced" },
    ],
  },
  {
    id: "eclipse-form",
    name: "Eclipse Form",
    price: "$69",
    priceValue: 69,
    accent: "#FF7A45",
    glow: "#8C3E1B",
    image:
      "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    description: "Premium detail pass with layered geometry and texture.",
    rating: 5,
    features: [
      { label: "High Detail", value: "Sculpted at 8K resolution" },
      { label: "Multi-Part", value: "Modular assembly" },
      { label: "Updates", value: "Free lifetime revisions" },
    ],
  },
];

export default function ProductGrid() {
  return (
    <section
      id="collection"
      className="relative bg-[#0b0b0c] py-16 sm:py-24 px-4 sm:px-10 scroll-mt-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-14 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
            style={{ color: "#75c5de" }}
          >
            Featured Drops
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            Explore The Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.priceValue,
      meta: product.features.slice(0, 2),
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div
      className="group relative rounded-3xl overflow-hidden bg-[#151517] transition-all duration-300 ease-out hover:-translate-y-2"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 45px -10px ${product.accent}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
      }}
    >
      {/* Image area */}
      <div
        className="relative h-56 sm:h-64 flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${product.glow} 0%, #111214 72%)`,
        }}
      >
        {/* decorative rings */}
        <span
          className="absolute w-10 h-10 rounded-full border-2 opacity-30 transition-transform duration-500 group-hover:rotate-90"
          style={{ borderColor: product.accent, top: 18, left: 18 }}
        />
        <span
          className="absolute w-6 h-6 rounded-full border-2 opacity-20 transition-transform duration-500 group-hover:-rotate-45"
          style={{ borderColor: product.accent, bottom: 22, right: 26 }}
        />

        {/* price badge */}
        <span
          className="absolute top-4 right-4 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${product.accent}, ${product.accent}99)`,
          }}
        >
          {product.price}
        </span>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          className="relative z-[1] h-[85%] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1"
        />
      </div>

      {/* Content area */}
      <div className="p-5 sm:p-6 bg-[#1a1b1e]">
        <h3 className="text-xl sm:text-2xl font-bold uppercase text-white leading-tight mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-white/60 mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < product.rating ? product.accent : "none"}
              stroke={i < product.rating ? product.accent : "#4b4b4f"}
            />
          ))}
        </div>

        <div
          className="flex flex-col gap-2 mb-5 pl-3 border-l-2"
          style={{ borderColor: `${product.accent}55` }}
        >
          {product.features.map((f) => (
            <div key={f.label}>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: product.accent }}
              >
                {f.label}
              </span>
              <p className="text-xs text-white/55">{f.value}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
          style={{
            background: justAdded
              ? "#1a1b1e"
              : `linear-gradient(90deg, ${product.accent}, ${product.accent}cc)`,
            border: justAdded ? `1px solid ${product.accent}` : "none",
          }}
        >
          {justAdded ? (
            <>
              <Check size={16} strokeWidth={2.5} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} strokeWidth={2.25} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
