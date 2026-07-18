"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./BurgerMenu.module.css";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "#help", label: "Help & Support" },
];

export default function BurgerMenu({ fixed = true }: { fixed?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelMenuClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleMenuClose() {
    cancelMenuClose();
    closeTimerRef.current = setTimeout(() => setMenuOpen(false), 150);
  }

  useEffect(() => {
    return () => cancelMenuClose();
  }, []);

  const trigger = (
    <button
      type="button"
      className={`${styles.burgerBtn} ${menuOpen ? styles.open : ""}`}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      onClick={() => setMenuOpen((v) => !v)}
      onMouseEnter={cancelMenuClose}
      onMouseLeave={scheduleMenuClose}
    >
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
    </button>
  );

  return (
    <>
      {fixed ? (
        <div className={styles.fixedWrapper}>
          <div className={styles.inner}>{trigger}</div>
        </div>
      ) : (
        trigger
      )}

      <div
        className={`${styles.menuPanel} ${menuOpen ? styles.open : ""}`}
        onMouseEnter={cancelMenuClose}
        onMouseLeave={scheduleMenuClose}
      >
        <nav>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
