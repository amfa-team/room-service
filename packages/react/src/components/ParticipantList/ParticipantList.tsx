import { BlameAction } from "@amfa-team/user-service";
import classnames from "classnames";
import { motion, useAnimation } from "framer-motion";
import React, { useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { IParticipant } from "../../entities";
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

interface ControlMenuProps {
  participant: IParticipant;
  participants: IParticipant[];
  isLocalParticipant: boolean;
}

// TODO: This should have its own file
function ControlMenu({
  participant,
  participants,
  isLocalParticipant,
}: ControlMenuProps): ReactElement {
  const dictionary = useDictionary("userDictionary");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const witnesses = useMemo(
    () =>
      participants
        .filter((p) => p.identity !== participant.identity)
        .map((p) => p.identity),
    [participants, participant],
  );

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
        {!isLocalParticipant && (
          <div
            className={classnames(styles.mainMenuIcons, styles.iconCtrl, {
              [styles.iconCtrlOpen]: isMenuOpen,
            })}
          >
            <BlameAction
              accusedId={participant.identity}
              witnesses={witnesses}
              dictionary={dictionary}
            />
          </div>
        )}
        {isLocalParticipant && (
          <i
            className={classnames(styles.mainMenuIcons, styles.iconCtrl, {
              [styles.iconCtrlOpen]: isMenuOpen,
            })}
          />
        )}
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
ControlMenu.defaultProps = {
  isLocalParticipant: false,
};

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
          <ControlMenu
            participant={localParticipant}
            participants={participants}
            isLocalParticipant
          />
          <Participant participant={localParticipant} isLocalParticipant />
        </motion.li>
        {participants.map((participant) => (
          <motion.li
            key={participant.sid}
            className={styles.participant}
            variants={itemAnimation}
            animate={controlsChildren}
          >
            <ControlMenu
              participant={participant}
              participants={participants}
            />
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
