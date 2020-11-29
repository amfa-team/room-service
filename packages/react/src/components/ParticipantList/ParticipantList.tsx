import classnames from "classnames";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import React, { useCallback, useMemo } from "react";
import type { IRoom } from "../../entities/Room";
import useParticipants from "../../hooks/useParticipants";
import { useDictionary } from "../../i18n/dictionary";
import Participant from "../Participant/Participant";
import styles from "./participantList.module.css";

const containerAnimation = {
  scale: 1,
  borderRadius: ["20%", "20%", "50%", "50%", "20%"],
  transition: {
    delay: 0.1,
    when: "beforeChildren",
    staggerChildren: 0.05,
  },
};

const shuffleVariants = {
  disabled: {
    opacity: 0.4,
  },
  enabled: {
    opacity: 1,
  },
};

const shuffleTapAnimation = { scale: 0.8 };

export interface ParticipantListProps {
  room: IRoom | null;
  onShuffle: () => void;
  isJoining: boolean;
}

export default function ParticipantList(
  props: ParticipantListProps,
): JSX.Element | null {
  const dictionary = useDictionary("participantList");
  const { room, isJoining, onShuffle } = props;

  const localParticipant = room?.localParticipant ?? null;
  const participants = useParticipants(room);

  const debouncedShuffle = useMemo(() => {
    const fn: () => unknown = debounce(onShuffle, 400, { leading: true });
    return fn;
  }, [onShuffle]);

  const onShuffleButtonClicked = useCallback(() => {
    if (!isJoining) {
      debouncedShuffle();
    }
  }, [isJoining, debouncedShuffle]);

  const loading = room === null || isJoining;

  return (
    <motion.div className={styles.container} animate={containerAnimation}>
      <motion.div
        className={classnames(styles.shuffleCTA, {
          [styles.shuffleDisabled]: loading,
        })}
        whileTap={loading ? {} : shuffleTapAnimation}
        onClick={onShuffleButtonClicked}
        initial="disabled"
        animate={loading ? "disabled" : "enabled"}
        variants={shuffleVariants}
      >
        <span>{dictionary.shuffle}</span>
      </motion.div>
      <Participant
        participants={participants}
        participant={localParticipant}
        isLocalParticipant
        loading={loading}
      />
      {participants.map((participant) => (
        <Participant
          key={participant.sid}
          participant={participant}
          participants={participants}
          loading={loading}
        />
      ))}
      {["0", "1", "2"]
        .filter((d) => !Object.keys(participants).includes(d))
        .map((index) => (
          <Participant
            key={index}
            participants={participants}
            participant={null}
            loading={loading}
          />
        ))}
    </motion.div>
  );
}
ParticipantList.defaultProps = {
  isJoining: false,
};
