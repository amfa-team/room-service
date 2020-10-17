import React from "react";
import { helloWorld } from "@amfa-team/shared";
import styles from "../HelloFromShared/helloFromShared.module.css";
// @ts-ignore
import { name } from "./name";

export function HelloFromReact(): JSX.Element {
  return (
    <div className={styles.box}>
      <h4 className={styles.title}>{helloWorld(null, name)}</h4>
      <p className={styles.text}>
        This title is generated using React library.
      </p>
    </div>
  );
}
