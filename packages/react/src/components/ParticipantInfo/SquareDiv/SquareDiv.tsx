import classnames from "classnames";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import React from "react";
import classes from "./squareDiv.module.css";

interface SquareDivProps {
  hidden: boolean;
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const initial = { scale: 1.5, opacity: 0 };
const animate = { scale: 1, opacity: 1 };
const transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  delay: 0.3,
};

export function SquareDiv(props: SquareDivProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={classnames(classes.root, {
        [classes.hidden]: props.hidden,
      })}
    >
      <div className={classes.content}>{props.children}</div>
    </motion.div>
  );
}
SquareDiv.defaultProps = {
  hidden: false,
};
