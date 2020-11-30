import type { ReactNode } from "react";
import React from "react";
import classes from "./snackbar.module.css";

interface SnackbarProps {
  children?: ReactNode;
}

export function Snackbar(props: SnackbarProps) {
  return <div className={classes.root}>{props.children}</div>;
}
Snackbar.defaultProps = {
  children: null,
};
