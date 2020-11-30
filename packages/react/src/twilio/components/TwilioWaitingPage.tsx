import { useConnect, useToken as useJwtToken } from "@amfa-team/user-service";
import React, { useCallback, useEffect, useState } from "react";
import { useJoin } from "../../api/useApi";
import WaitingPage from "../../components/WaitingPage/WaitingPage";
import useTwilioLocalTracks from "../hooks/useTwilioLocalTracks";

interface TwilioWaitingPageProps {
  spaceId: string;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
}

type Step = "setup" | "connect" | "join" | "ready";

export default function TwilioWaitingPage(props: TwilioWaitingPageProps) {
  const { spaceId, roomName, onRoomChanged } = props;
  const [step, setStep] = useState<Step>("setup");
  const jwtToken = useJwtToken();
  const { connect } = useConnect();
  const {
    isAcquiringLocalTracks,
    videoTrack,
    videoError,
    audioTrack,
    audioError,
  } = useTwilioLocalTracks();
  const [roomFull, setRoomFull] = useState(false);
  const { join } = useJoin(spaceId, roomFull, props.roomName);
  const onJoinClicked = useCallback(() => {
    setStep("connect");
  }, []);

  useEffect(() => {
    // Restart
    setStep("setup");
    setRoomFull(false);
  }, [roomName]);

  useEffect(() => {
    const abortController = new AbortController();
    if (step === "connect") {
      connect(null)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setStep(result === null ? "setup" : "join");
          }
        })
        .catch((err) => {
          console.error(err);
          if (!abortController.signal.aborted) {
            setStep("setup");
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [step, connect]);

  useEffect(() => {
    const abortController = new AbortController();
    if (step === "join" && jwtToken !== null) {
      join(jwtToken)
        .then((r) => {
          if (!abortController.signal.aborted) {
            if (r === null) {
              setRoomFull(true);
            } else if (roomName !== r) {
              onRoomChanged(r);
            }
            setStep("ready");
          }
        })
        .catch((err) => {
          console.error(err);
          if (!abortController.signal.aborted) {
            setStep("setup");
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [step, join, roomName, onRoomChanged, jwtToken]);

  return (
    <WaitingPage
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      join={onJoinClicked}
      disabled={step !== "setup"}
      isAcquiringLocalTracks={isAcquiringLocalTracks}
      roomFull={roomFull}
      audioError={audioError}
      videoError={videoError}
    />
  );
}

TwilioWaitingPage.defaultProps = {
  roomName: null,
};
