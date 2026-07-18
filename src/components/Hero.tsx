"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BurgerMenu from "./BurgerMenu";
import Splash from "./Splash";
import styles from "./Hero.module.css";

const HEADLINE = "Where your ideas escape the screen.";
const SPOTLIGHT_R = 260;

export default function Hero() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const imgLayer = revealImgRef.current;
    if (!canvas || !imgLayer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const mouse = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    let rafId: number;
    function loop() {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      if (!canvas || !ctx || !imgLayer) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        SPOTLIGHT_R
      );
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(255,255,255,1)");
      grad.addColorStop(0.6, "rgba(255,255,255,0.75)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.4)");
      grad.addColorStop(0.88, "rgba(255,255,255,0.12)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const dataUrl = canvas.toDataURL();
      imgLayer.style.webkitMaskImage = `url(${dataUrl})`;
      imgLayer.style.maskImage = `url(${dataUrl})`;
      imgLayer.style.webkitMaskSize = "100% 100%";
      imgLayer.style.maskSize = "100% 100%";

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <Splash color="#75c5de" />

      <div className={styles.logoWrapper}>
        <div className={styles.inner}>
          <Link href="/" aria-label="Home" className={styles.logoText}>
            SKYSHARK
          </Link>
        </div>
      </div>

      <div className={styles.navPillWrapper}>
        <div className={styles.navPill}>
          <Link
            href="/"
            className={`${styles.navPillLink} ${
              pathname === "/" ? styles.navPillLinkActive : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`${styles.navPillLink} ${
              pathname === "/products" ? styles.navPillLinkActive : ""
            }`}
          >
            Products
          </Link>
        </div>
      </div>

      <BurgerMenu />

      <main className={styles.hero}>
        <div
          className={`${styles.heroBaseImg} ${styles.heroImageAnimate}`}
          style={{
            backgroundImage:
              "url('https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560')",
          }}
        />

        <canvas ref={canvasRef} className={styles.revealCanvas} />
        <div
          ref={revealImgRef}
          className={styles.heroRevealImg}
          style={{
            backgroundImage:
              "url('https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536')",
          }}
        />

        <div className={styles.heroContent}>
          <div className={styles.heroContentInner}>
            <h1 className={styles.heroHeadline}>
              <RevealHeadline text={HEADLINE} />
            </h1>
            <Link href="/products" className={`${styles.ctaBtn} ${styles.ctaAnimate}`}>
              <span className={styles.ctaBtnBg}></span>
              <span className={styles.ctaBtnText}>Order now</span>
              <span className={styles.ctaBtnCircle}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 13L13 5M13 5H6M13 5V12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function RevealHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={styles.wordReveal}
          style={{ animationDelay: `${1 + i * 0.05}s` }}
        >
          {word}
        </span>
      ))}
    </>
  );
}
