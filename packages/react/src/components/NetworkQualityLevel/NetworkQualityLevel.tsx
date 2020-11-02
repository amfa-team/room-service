import classNames from "classnames";
import React from "react";
import type { IParticipant } from "../../entities/Participant";
import style from "./networkQualityLevel.module.css";
import useParticipantNetworkQualityLevel from "./useParticipantNetworkQualityLevel";

const BARS_ARRAY = [
  { level: 0, className: style.barLevel0 },
  { level: 1, className: style.barLevel1 },
  { level: 2, className: style.barLevel2 },
  { level: 3, className: style.barLevel3 },
  { level: 4, className: style.barLevel4 },
];

interface NetworkQualityLevelProps {
  participant: IParticipant;
}

export default function NetworkQualityLevel({
  participant,
}: NetworkQualityLevelProps) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  if (networkQualityLevel === null) return null;

  return (
    <div className={style.container}>
      <div className={style.root}>
        {BARS_ARRAY.map(({ level, className }) => (
          <div
            className={classNames(style.bar, className, {
              [style.active]: networkQualityLevel > level,
            })}
            key={level}
          />
        ))}
      </div>
    </div>
  );
}
