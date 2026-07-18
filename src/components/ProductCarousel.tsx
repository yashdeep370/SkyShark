"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import BurgerMenu from "./BurgerMenu";
import Splash from "./Splash";

type ProductImage = {
  src: string;
  bg: string;
  panel: string;
};

const IMAGES: ProductImage[] = [
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#6BBF7A",
    panel: "#85CC92",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#E882B4",
    panel: "#ED9DC4",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
  },
];

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E";

type NavDirection = "next" | "prev";
type Role = "center" | "left" | "right" | "back";

export default function ProductCarousel() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new window.Image();
      img.src = item.src;
    });
  }, []);

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth < 640);
    }
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  function navigate(direction: NavDirection) {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direction === "next" ? (prev + 1) % 4 : (prev + 3) % 4
    );
    setTimeout(() => setIsAnimating(false), 650);
  }

  function goTo(index: number) {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 650);
  }

  function scrollToCollection() {
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const active = IMAGES[activeIndex];
  const roles = {
    center: activeIndex,
    left: (activeIndex + 3) % 4,
    right: (activeIndex + 1) % 4,
    back: (activeIndex + 2) % 4,
  };

  function roleFor(i: number): Role {
    if (i === roles.center) return "center";
    if (i === roles.left) return "left";
    if (i === roles.right) return "right";
    return "back";
  }

  function itemStyle(role: Role): React.CSSProperties {
    const base: React.CSSProperties = {
      position: "absolute",
      transition:
        "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)",
      willChange: "transform, filter, opacity",
    };

    switch (role) {
      case "center":
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "22%" : 0,
          height: isMobile ? "60%" : "92%",
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: 20,
        };
      case "left":
        return {
          ...base,
          left: isMobile ? "20%" : "30%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "right":
        return {
          ...base,
          left: isMobile ? "80%" : "70%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "back":
      default:
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "13%" : "22%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
        };
    }
  }

  return (
    <div
      style={{
        backgroundColor: active.bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
      className="relative w-full overflow-hidden"
    >
      <Splash color="#F4845F" />

      <div className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Giant ghost text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: "18%" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "#ffffff",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
           --------
          </span>
        </div>

        {/* Header: brand + nav + menu */}
        <header
          className="absolute top-0 inset-x-0 flex items-center justify-between px-4 sm:px-10 py-6"
          style={{ zIndex: 60 }}
        >
          <Link
            href="/"
            className="text-xs font-semibold uppercase text-white"
            style={{ opacity: 0.9, letterSpacing: "0.18em" }}
          >
            SKYSHARK
          </Link>

          <nav className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 p-1 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.18em]">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/products" active={pathname === "/products"}>
              Products
            </NavLink>
          </nav>

          <BurgerMenu fixed={false} />
        </header>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, i) => {
            const role = roleFor(i);
            return (
              <div key={item.src} style={{ ...itemStyle(role), aspectRatio: "0.6 / 1" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom center",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left swatches + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            {IMAGES.map((item, i) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Select model ${i + 1}`}
                onClick={() => goTo(i)}
                className="rounded-full transition-transform hover:scale-110"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: item.panel,
                  border:
                    i === activeIndex
                      ? "2px solid white"
                      : "2px solid rgba(255,255,255,0.4)",
                  boxShadow: i === activeIndex ? "0 0 0 2px rgba(0,0,0,0.15)" : "none",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NavButton
              icon={<ArrowLeft size={26} strokeWidth={2.25} />}
              onClick={() => navigate("prev")}
              label="Previous model"
            />
            <NavButton
              icon={<ArrowRight size={26} strokeWidth={2.25} />}
              onClick={() => navigate("next")}
              label="Next model"
            />
          </div>
        </div>

        {/* Bottom-right See All Products scroll toggle */}
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-10" style={{ zIndex: 60 }}>
          <button
            type="button"
            onClick={scrollToCollection}
            className="group flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-md pl-3 pr-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-white/20"
          >
            <span className="relative w-7 h-4 rounded-full bg-white/25 flex items-center px-0.5 transition-colors duration-300 group-hover:bg-white/40">
              <span className="w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-3" />
            </span>
            See All Products
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative rounded-full px-5 py-2.5 transition-all duration-300 ${
        active
          ? "bg-white text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          : "text-white/85 hover:text-white hover:bg-white/15 hover:scale-105"
      }`}
    >
      {children}
    </Link>
  );
}

function NavButton({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white bg-transparent transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/[0.12]"
      style={{ border: "2px solid white" }}
    >
      {icon}
    </button>
  );
}
