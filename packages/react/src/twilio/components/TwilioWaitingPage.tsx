import type { BlameDictionary } from "@amfa-team/user-service";
import { useConnect, useToken as useJwtToken } from "@amfa-team/user-service";
import { captureException } from "@sentry/react";
import React, { useCallback, useEffect, useState } from "react";
import { useJoin } from "../../api/useApi";
import WaitingPage from "../../components/WaitingPage/WaitingPage";
import useTwilioLocalTracks from "../hooks/useTwilioLocalTracks";

interface TwilioWaitingPageProps {
  spaceId: string;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
  blameDictionary: BlameDictionary;
}

type Step = "setup" | "connect" | "join" | "ready";

function TwilioWaitingPage(props: TwilioWaitingPageProps) {
  const { spaceId, roomName, onRoomChanged, blameDictionary } = props;
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
  const [changeRoom, setChangeRoom] = useState(false);
  const { join, isFull, isJoining } = useJoin(
    spaceId,
    changeRoom,
    props.roomName,
  );
  const onJoinClicked = useCallback((change: boolean) => {
    setChangeRoom(change);
    setStep("connect");
  }, []);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Restart
    setStep("setup");
    setChangeRoom(false);
    setRetryCount(0);
  }, [roomName]);

  useEffect(() => {
    // Reset at each step
    setRetryCount(0);
  }, [step]);

  useEffect(() => {
    const abortController = new AbortController();
    if (step === "connect") {
      if (jwtToken !== null) {
        setStep("join");
      } else {
        connect(null)
          .then((result) => {
            if (!abortController.signal.aborted) {
              setStep(result === null ? "setup" : "join");
            }
          })
          .catch((err) => {
            if (!abortController.signal.aborted) {
              console.error(err);
              captureException(err);
              if (retryCount > 3) {
                setStep("setup");
              } else {
                setRetryCount(retryCount + 1);
              }
            }
          });
      }
    }

    return () => {
      abortController.abort();
    };
  }, [step, connect, jwtToken, retryCount]);

  useEffect(() => {
    const abortController = new AbortController();
    if (step === "join" && jwtToken !== null) {
      join(jwtToken, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            if (!result.success) {
              setStep("setup");
            } else if (roomName !== result.room.name) {
              onRoomChanged(result.room.name);
              setStep("ready");
            }
          }
        })
        .catch((err) => {
          if (!abortController.signal.aborted) {
            console.error(err);
            captureException(err);
            if (retryCount > 3) {
              setStep("setup");
            } else {
              setRetryCount(retryCount + 1);
            }
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [step, join, roomName, onRoomChanged, jwtToken, retryCount]);

  return (
    <WaitingPage
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      join={onJoinClicked}
      disabled={step !== "setup"}
      isAcquiringLocalTracks={isAcquiringLocalTracks}
      roomFull={isFull}
      isJoining={isJoining || step !== "setup"}
      audioError={audioError}
      videoError={videoError}
      blameDictionary={blameDictionary}
    />
  );
}

TwilioWaitingPage.defaultProps = {
  roomName: null,
};

export default React.memo<TwilioWaitingPageProps>(TwilioWaitingPage);
