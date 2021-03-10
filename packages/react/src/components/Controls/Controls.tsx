import {
  CamIcon,
  CamOffIcon,
  MicIcon,
  MicOffIcon,
} from "@amfa-team/theme-service";
import { Button, Flex, IconButton, SimpleGrid, Spacer } from "@chakra-ui/react";
import React, { useCallback } from "react";
import type { ILocalParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import { useDictionary } from "../../i18n/dictionary";

interface ControlsProps {
  localParticipant: ILocalParticipant | null;
  onShuffle?: null | (() => void);
}

export default function Controls(props: ControlsProps) {
  const { localParticipant, onShuffle = null } = props;
  const dictionary = useDictionary("participantList");
  const videoTrack = useParticipantVideoTrack(localParticipant);
  const audioTrack = useParticipantAudioTrack(localParticipant);

  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const hasAudioTrack = audioTrack !== null;
  const onToggleAudio = useCallback(() => {
    audioTrack?.enable(!audioTrack.isEnabled);
  }, [audioTrack]);

  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const hasVideoTrack = videoTrack !== null;
  const onToggleVideo = useCallback(() => {
    videoTrack?.enable(!videoTrack.isEnabled);
  }, [videoTrack]);

  return (
    <Flex
      bg="gray.900"
      centerContent
      w="full"
      maxW="full"
      h="20"
      alignItems="center"
      justify="center"
    >
      <SimpleGrid
        maxW="container.lg"
        w="full"
        h="full"
        column="3"
        templateColumns="1fr 180px"
      >
        <Flex h="full" justifyContent="center" alignItems="center">
          <IconButton
            aria-label="Report"
            icon={isVideoEnabled ? <CamIcon /> : <CamOffIcon />}
            onClick={onToggleVideo}
            disabled={!hasVideoTrack}
            bg="transparent"
            border="none"
            _hover={{
              color: isVideoEnabled ? "red" : "green",
              _disabled: { bg: "none", color: "gray.400", cursor: "auto" },
            }}
            _disabled={{ bg: "none", color: "gray.400" }}
          />
          <Spacer maxW="2" />
          <IconButton
            aria-label="Report"
            icon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
            onClick={onToggleAudio}
            disabled={!hasAudioTrack}
            bg="transparent"
            border="none"
            _hover={{
              color: isAudioEnabled ? "red" : "green",
              _disabled: { bg: "none", color: "gray.400", cursor: "auto" },
            }}
            _disabled={{ bg: "none", color: "gray.400" }}
          />
        </Flex>
        {onShuffle !== null && (
          <Button colorScheme="red" h="full" onClick={onShuffle}>
            {dictionary.shuffle}
          </Button>
        )}
      </SimpleGrid>
    </Flex>
  );
}
