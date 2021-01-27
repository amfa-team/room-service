import classnames from "classnames";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import React from "react";
import ReactResizeDetector from "react-resize-detector";
import classes from "./squareDiv.module.css";

interface SquareDivProps {
  hidden: boolean;
  children: JSX.Element | JSX.Element[] | ReactNode;
}

interface RenderProps {
  // eslint-disable-next-line react/no-unused-prop-types
  height: number;
  // eslint-disable-next-line react/no-unused-prop-types
  width: number;
  // eslint-disable-next-line react/no-unused-prop-types
  targetRef: React.Ref<HTMLDivElement>;
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
    <ReactResizeDetector
      handleWidth
      handleHeight
      refreshMode="debounce"
      refreshOptions={{ leading: true, trailing: true }}
      refreshRate={50}
    >
      {({ width, height, targetRef }: RenderProps) => {
        const size = Math.min(
          Number.isNaN(height) ? 10 : height,
          Number.isNaN(width) ? 10 : width,
        );
        return (
          <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={classnames(classes.root, {
              [classes.hidden]: props.hidden,
            })}
            ref={targetRef}
          >
            <div
              className={classes.content}
              style={{ height: size, width: size }}
            >
              {props.children}
            </div>
          </motion.div>
        );
      }}
    </ReactResizeDetector>
  );
}
SquareDiv.defaultProps = {
  hidden: false,
};
