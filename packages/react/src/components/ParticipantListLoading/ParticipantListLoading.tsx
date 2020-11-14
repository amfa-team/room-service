import { motion } from "framer-motion";
import React from "react";
import DotLoader from "../DotLoader/DotLoader";
import styles from "./ParticipantListLoading.module.css";

const containerAnimation = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
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

export default function ParticipantListLoading(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <div className={styles.shuffleCTA}>
        <span>Shuffle</span>
      </div>
      <motion.ul
        className={styles.participantsContainer}
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        {["0", "1", "2", "3"].map((index) => (
          <motion.li
            key={index}
            className={styles.participant}
            variants={itemAnimation}
          >
            <div className={styles.emptySeatContainer}>
              <div className={styles.emptySeatInnerContainer}>
                <div className={styles.emptySeatAvatarContainer}>
                  <DotLoader />
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
