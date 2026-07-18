import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Link href="/" className={styles.brand}>
            SKYSHARK
          </Link>
          <p className={styles.tagline}>Where your ideas escape the screen.</p>
        </div>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h3>Account</h3>
            <nav>
              <a href="#profile">My Profile</a>
              <a href="#orders">My Orders</a>
              <a href="#cart">Cart</a>
            </nav>
          </div>
          <div className={styles.column}>
            <h3>Explore</h3>
            <nav>
              <a href="#shop">Shop</a>
              <a href="#about">About</a>
              <a href="#help">Help &amp; Support</a>
            </nav>
          </div>
          <div className={styles.column}>
            <h3>Contact</h3>
            <nav>
              <a href="mailto:studio@skyshark.com">studio@skyshark.com</a>
              <a href="#">Instagram</a>
              <a href="#">Behance</a>
            </nav>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {year} Skyshark. All rights reserved.</span>
        <div>
          <Link href="#">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
