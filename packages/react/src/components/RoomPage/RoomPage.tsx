import type { BlameDictionary } from "@amfa-team/user-service";
import { Grid } from "@chakra-ui/react";
import React from "react";
import type { ReactElement } from "react";
import type { IRoom } from "../../entities/Room";
import Controls from "../Controls/Controls";
import ParticipantList from "../ParticipantList/ParticipantList";

interface RoomPageProps {
  room: IRoom | null;
  onShuffle: () => void;
  onHangUp: () => void;
  isJoining: boolean;
  blameDictionary: BlameDictionary;
  helpButton?: ReactElement;
  featuresViewerButton?: any;
}

export default function RoomPage(props: RoomPageProps) {
  const {
    room,
    onShuffle,
    onHangUp,
    isJoining,
    blameDictionary,
    featuresViewerButton,
    helpButton,
  } = props;

  return (
    <Grid column="1" templateRows="calc(100% - 80px) 80px" h="full">
      <ParticipantList
        room={room}
        isJoining={isJoining}
        blameDictionary={blameDictionary}
      />
      <Controls
        onShuffle={onShuffle}
        onHangUp={onHangUp}
        localParticipant={room?.localParticipant ?? null}
        helpButton={helpButton}
        featuresViewerButton={featuresViewerButton}
      />
    </Grid>
  );
}
RoomPage.defaultProps = {
  isJoining: false,
  helpButton: null,
  featuresViewerButton: null,
};
