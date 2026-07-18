import styles from "./Splash.module.css";

export default function Splash({ color = "#75c5de" }: { color?: string }) {
  return (
    <div className={styles.splash}>
      <div className={`${styles.splashRow} ${styles.splashRowTop}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={styles.splashBox}
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
      <div className={`${styles.splashRow} ${styles.splashRowBottom}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={styles.splashBox}
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
}
