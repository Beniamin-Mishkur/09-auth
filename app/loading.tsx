import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      Loading, please wait...
    </div>
  );
}