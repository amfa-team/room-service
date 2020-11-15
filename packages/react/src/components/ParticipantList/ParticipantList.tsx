import classnames from "classnames";
import { motion, useAnimation } from "framer-motion";
import React, { useState } from "react";
import type { ReactElement } from "react";
import type { IRoom } from "../../entities/Room";
import useParticipants from "../../hooks/useParticipants";
import { useDictionary } from "../../i18n/dictionary";
import EmptySeat from "../../icons/EmptySeat";
import Participant from "../Participant/Participant";
import styles from "./participantList.module.css";

const containerAnimation = {
  hidden: {
    opacity: 1,
    scale: 0,
  },
  visible: {
    scale: 1,
    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
    transition: {
      delay: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemAnimation = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

function ControlMenu(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <>
      <i
        className={`${styles.mainMenuIcons} ${styles.iconM}`}
        onClick={toggleMenu}
      />
      <div
        className={classnames(styles.list, {
          [styles.dNone]: !isMenuOpen,
        })}
      >
        <i
          className={classnames(styles.mainMenuIcons, styles.iconCtrl, {
            [styles.iconCtrlOpen]: isMenuOpen,
          })}
        />
        <i
          className={classnames(styles.mainMenuIcons, styles.iconPrfle, {
            [styles.iconPrfleOpen]: isMenuOpen,
          })}
        />
        <i
          className={classnames(styles.mainMenuIcons, styles.iconAbout, {
            [styles.iconAboutOpen]: isMenuOpen,
          })}
        />
        <i
          className={classnames(styles.mainMenuIcons, styles.iconHome, {
            [styles.iconHomeOpen]: isMenuOpen,
          })}
        />
      </div>
    </>
  );
}

export interface ParticipantListProps {
  room: IRoom;
  onShuffle: () => void;
}

export default function ParticipantList(
  props: ParticipantListProps,
): JSX.Element | null {
  const dictionary = useDictionary("participantList");
  const {
    room,
    room: { localParticipant },
  } = props;
  const participants = useParticipants(room);

  const controls = useAnimation();
  const controlsChildren = useAnimation();

  const onShuffleButtonClicked = async () => {
    props.onShuffle();
    await new Promise((resolve) => setTimeout(resolve, 400));
    const animationStart = controlsChildren.start("hidden");
    await controls.start("visible");
    return animationStart;
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerAnimation}
      initial="visible"
      animate={controls}
    >
      <motion.div
        className={styles.shuffleCTA}
        whileTap={{ scale: 0.8 }}
        onClick={async () => onShuffleButtonClicked()}
      >
        <span>{dictionary.shuffle}</span>
      </motion.div>
      <ul className={styles.participantsContainer}>
        <motion.li
          className={styles.participant}
          variants={itemAnimation}
          animate={controlsChildren}
        >
          <ControlMenu />
          <Participant participant={localParticipant} isLocalParticipant />
        </motion.li>
        {participants.map((participant) => (
          <motion.li
            key={participant.sid}
            className={styles.participant}
            variants={itemAnimation}
            animate={controlsChildren}
          >
            <ControlMenu />
            <Participant participant={participant} />
          </motion.li>
        ))}
        {["0", "1", "2"]
          .filter((d) => !Object.keys(participants).includes(d))
          .map((index) => (
            <motion.li
              key={index}
              className={styles.participant}
              variants={itemAnimation}
              animate={controlsChildren}
            >
              <div className={styles.emptySeatContainer}>
                <div className={styles.emptySeatInnerContainer}>
                  <div className={styles.emptySeatAvatarContainer}>
                    <EmptySeat />
                    {dictionary.availableSeat}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
      </ul>
    </motion.div>
  );
}
