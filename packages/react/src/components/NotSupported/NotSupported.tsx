import { Button } from "@amfa-team/theme-service";
import React from "react";
import type { NotSupportedPageDictionary } from "../../i18n/dictionary";
import classes from "./notSupported.module.css";

interface NotSupportedProps {
  onForce: () => void;
  dictionary: NotSupportedPageDictionary;
}

export function NotSupported(props: NotSupportedProps) {
  const { dictionary, onForce } = props;

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>{dictionary.title}</h2>
      <p className={classes.desc}>{dictionary.desc}</p>
      <Button onClick={onForce}>{dictionary.force}</Button>
    </div>
  );
}
