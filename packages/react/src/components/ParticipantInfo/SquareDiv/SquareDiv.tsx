import classnames from "classnames";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import React, { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector/build/withPolyfill";
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
  const { hidden, children } = props;
  const { width, height, ref: targetRef } = useResizeDetector({
    handleWidth: true,
    handleHeight: true,
    refreshMode: "debounce",
    refreshOptions: { leading: true, trailing: true },
    refreshRate: 50,
  });

  const size = Math.min(
    Number.isFinite(height) ? height : 0,
    Number.isFinite(width) ? width : 0,
  );
  const style = useMemo(() => {
    return size === 0 ? {} : { height: size, width: size };
  }, [size]);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={classnames(classes.root, {
        [classes.hidden]: hidden,
      })}
      ref={targetRef}
    >
      <div className={classes.content} style={style}>
        {children}
      </div>
    </motion.div>
  );
}
SquareDiv.defaultProps = {
  hidden: false,
};
