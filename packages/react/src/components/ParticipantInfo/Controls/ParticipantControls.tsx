import type { BlameDictionary } from "@amfa-team/user-service";
import { BlameAction } from "@amfa-team/user-service";
import classnames from "classnames";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import type { IParticipant } from "packages/react/src/entities";
// import { CamIcon } from "./Icons/CamIcon";
import { SettingsIcon } from "./Icons/SettingsIcon";
// import { SoundIcon } from "./Icons/SoundIcon";
import classes from "./participantControls.module.css";

interface ParticipantControlsProps {
  participant: IParticipant;
  participants: IParticipant[];
  isLocalParticipant: boolean;
  blameDictionary: BlameDictionary;
}

function getAngle(value: number) {
  return {
    top: `${(50 - Math.sin(value * Math.PI) * 50).toFixed(2)}%`,
    left: `${(50 + Math.cos(value * Math.PI) * 50).toFixed(2)}%`,
  };
}

function getAnimation(from: number, to: number, steps: number) {
  const angleInc = (to - from) / steps;
  const animation: { top: string[]; left: string[] } = {
    top: [],
    left: [],
  };

  for (let i = 0; i <= steps; i += 1) {
    const angle = getAngle(from + angleInc * i);
    animation.top.push(angle.top);
    animation.left.push(angle.left);
  }

  return animation;
}

const p1 = {
  opened: getAnimation(5 / 6, 3 / 6, 10),
  closed: getAnimation(3 / 6, 5 / 6, 10),
};

// const p2 = {
//   opened: getAnimation(5 / 6, 1 / 6, 10),
//   closed: getAnimation(1 / 6, 5 / 6, 10),
// };

// const p3 = {
//   opened: getAnimation(5 / 6, -1 / 6, 10),
//   closed: getAnimation(-1 / 6, 5 / 6, 10),
// };

const renderAnimation = {
  opacity: [null, 0, 1],
};

const renderTransition = { type: "ease", duration: 0.5 };
const transition = { type: "linear", duration: 0.3, delay: 0 };

export function ParticipantControls({
  participant,
  participants,
  isLocalParticipant,
  blameDictionary,
}: ParticipantControlsProps): JSX.Element | null {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isLocalParticipant]);

  const witnesses = useMemo(
    () =>
      participants
        .filter((p) => p.identity !== participant.identity)
        .map((p) => p.identity),
    [participants, participant],
  );

  if (isLocalParticipant) {
    return null;
  }

  return (
    <motion.div
      className={classes.root}
      // @ts-ignore
      animate={renderAnimation}
      transition={renderTransition}
    >
      <div
        onClick={toggleMenu}
        className={classnames(classes.control, classes.toggle)}
      >
        <SettingsIcon />
      </div>
      {/* <motion.div
        initial={"closed"}
        animate={isMenuOpen ? "opened" : "closed"}
        variants={p1}
        transition={transition}
        className={classnames(classes.control)}
      >
        <CamIcon toggle={console.log} />
      </motion.div>
      <motion.div
        initial={"closed"}
        animate={isMenuOpen ? "opened" : "closed"}
        variants={p2}
        transition={transition}
        className={classnames(classes.control)}
      >
        <SoundIcon />
      </motion.div> */}
      <motion.div
        initial={"closed"}
        animate={isMenuOpen ? "opened" : "closed"}
        variants={p1}
        transition={transition}
        className={classnames(classes.control)}
      >
        <BlameAction
          accusedId={participant.identity}
          witnesses={witnesses}
          dictionary={blameDictionary}
        />
      </motion.div>
    </motion.div>
  );
}
ParticipantControls.defaultProps = {
  isLocalParticipant: false,
};
