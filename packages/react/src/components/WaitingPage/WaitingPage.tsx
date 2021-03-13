import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  RawLocalParticipant,
  RawVAudioTrackPublication,
  RawVideoTrackPublication,
} from "../../entities";
import type { ILocalAudioTrack, ILocalVideoTrack } from "../../entities/Track";
import { useMediaErrorMessage } from "../../hooks/useMediaErrorMessage";
import { useDictionary } from "../../i18n/dictionary";
import ParticipantSetup from "../ParticipantSetup/ParticipantSetup";
import { SnackbarContainer } from "../Snackbar/ScnackbarContainer";
import { Snackbar } from "../Snackbar/Snackbar";

export interface WaitingPageProps {
  videoTrack: ILocalVideoTrack | null;
  audioTrack: ILocalAudioTrack | null;
  join: (change: boolean) => void;
  disabled?: boolean;
  roomFull?: boolean;
  isJoining?: boolean;
  videoError?: Error | null;
  audioError?: Error | null;
  isAcquiringLocalTracks?: boolean;
}

function WaitingPage(props: WaitingPageProps) {
  const {
    videoTrack,
    audioTrack,
    join,
    disabled = false,
    roomFull = false,
    isJoining = false,
    videoError = null,
    audioError = null,
    isAcquiringLocalTracks = false,
  } = props;
  const dictionary = useDictionary("waitingPage");
  const videoErrorMessage = useMediaErrorMessage(
    videoError,
    "video",
    videoTrack,
  );
  const audioErrorMessage = useMediaErrorMessage(
    audioError,
    "audio",
    audioTrack,
  );

  const [
    localParticipant,
    setLocalParticipant,
  ] = useState<RawLocalParticipant | null>(null);

  useEffect(() => {
    setLocalParticipant(new RawLocalParticipant("fake"));
  }, []);

  useEffect(() => {
    if (videoTrack) {
      const publication = new RawVideoTrackPublication("camera", videoTrack);
      localParticipant?.addVideoTrack(publication);

      return () => {
        localParticipant?.removeVideoTrack(publication);
      };
    }

    return () => {
      // no-op
    };
  }, [localParticipant, videoTrack]);

  useEffect(() => {
    if (audioTrack) {
      const publication = new RawVAudioTrackPublication("mic", audioTrack);
      localParticipant?.addAudioTrack(publication);

      return () => {
        localParticipant?.removeAudioTrack(publication);
      };
    }

    return () => {
      // no-op
    };
  }, [localParticipant, audioTrack]);

  const onJoinClicked = useCallback(() => {
    join(roomFull);
  }, [join, roomFull]);

  return (
    <Flex
      h="full"
      w="full"
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        column="1"
        templateRows="minmax(0, 1fr) 48px 100px"
        w="full"
        maxW="container.md"
        m="auto"
        h="80%"
      >
        <ParticipantSetup
          participant={localParticipant}
          isLoading={localParticipant === null}
        />
        <Button
          colorScheme="secondary"
          w="full"
          size="lg"
          onClick={onJoinClicked}
          disabled={disabled || audioTrack === null || isAcquiringLocalTracks}
          isLoading={isJoining}
        >
          {dictionary.join}
        </Button>
        <Flex justifyContent="center" alignItems="center">
          <Text textAlign="center">{dictionary.cgu}</Text>
        </Flex>
      </Grid>
      <SnackbarContainer>
        {roomFull && (
          <Snackbar>
            <p>{dictionary.roomFull}</p>
          </Snackbar>
        )}
        {videoErrorMessage && !isAcquiringLocalTracks && (
          <Snackbar>
            <p>{videoErrorMessage}</p>
          </Snackbar>
        )}
        {audioErrorMessage && !isAcquiringLocalTracks && (
          <Snackbar>
            <p>{audioErrorMessage}</p>
          </Snackbar>
        )}
      </SnackbarContainer>
    </Flex>
  );
}

export default React.memo<WaitingPageProps>(WaitingPage);
