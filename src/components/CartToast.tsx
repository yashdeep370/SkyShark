"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const AUTO_HIDE_MS = 3500;

export default function CartToast() {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the enter transition so back-to-back adds re-animate
    setVisible(false);

    const showFrame = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);

    return () => {
      cancelAnimationFrame(showFrame);
      clearTimeout(hideTimer);
    };
  }, [lastAdded]);

  const current = lastAdded?.item;
  if (!current) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ zIndex: 200 }}
      role="status"
    >
      <div
        className="flex items-center gap-3 rounded-2xl shadow-2xl pl-3 pr-3 py-3 max-w-xs sm:max-w-sm"
        style={{ backgroundColor: "#111111", color: "#f4f1e8" }}
      >
        <div
          className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(244,241,232,0.1)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image}
            alt={current.name}
            className="w-full h-full object-contain p-1"
            draggable={false}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] opacity-60">Added to cart</p>
          <p className="text-sm font-semibold truncate">{current.name}</p>
        </div>

        <Link
          href="/cart"
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#75c5de", color: "#111111" }}
        >
          Checkout
        </Link>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X size={14} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
