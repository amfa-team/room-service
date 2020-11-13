import { motion, useAnimation } from "framer-motion";
import React from "react";
import type { IRoom } from "../../entities/Room";
import useParticipants from "../../hooks/useParticipants";
import { useSelectedParticipant } from "../../hooks/useSelectedParticipant";
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

export interface ParticipantListProps {
  room: IRoom;
  onShuffle: () => void;
}

export default function ParticipantList(
  props: ParticipantListProps,
): JSX.Element | null {
  const {
    room,
    room: { localParticipant },
  } = props;
  const participants = useParticipants(room);
  const [
    selectedParticipant,
    setSelectedParticipant,
  ] = useSelectedParticipant();

  const controls = useAnimation();
  const controlsChildren = useAnimation();

  const onShuffleClicked = async () => {
    props.onShuffle();
    const animationStart = controlsChildren.start("hidden");
    await controls.start("visible");
    await controlsChildren.start("visible");
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
        onClick={async () => onShuffleClicked()}
      >
        <span>Shuffle</span>
      </motion.div>
      <ul className={styles.itemsContainer}>
        <motion.li
          className={styles.item}
          variants={itemAnimation}
          animate={controlsChildren}
        >
          <Participant
            participant={localParticipant}
            isLocalParticipant
            onClick={() => {
              setSelectedParticipant(localParticipant);
            }}
          />
        </motion.li>
        {participants.map((participant) => (
          <motion.li
            key={participant.sid}
            className={styles.item}
            variants={itemAnimation}
            animate={controlsChildren}
          >
            <Participant
              participant={participant}
              isSelected={participant === selectedParticipant}
              onClick={() => {
                setSelectedParticipant(participant);
              }}
            />
          </motion.li>
        ))}
        <motion.li
          className={styles.item}
          variants={itemAnimation}
          animate={controlsChildren}
        />
      </ul>
    </motion.div>
  );
}
