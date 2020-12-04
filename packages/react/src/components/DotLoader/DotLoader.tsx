import type { ReactElement } from "react";
import React from "react";
import styles from "./dotLoader.module.css";

export default function DotLoader(): ReactElement {
  return (
    <div className={styles.threedotloader}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}
