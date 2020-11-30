import type { ReactNode } from "react";
import React from "react";
import classes from "./snackbarContainer.module.css";

interface SnackbarContainerProps {
  children?: ReactNode;
}

export function SnackbarContainer(props: SnackbarContainerProps) {
  return <div className={classes.root}>{props.children}</div>;
}
SnackbarContainer.defaultProps = {
  children: null,
};
