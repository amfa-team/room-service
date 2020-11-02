import {
  Participant,
  RawParticipant,
  RawVideoTrack,
  RawVideoTrackPublication,
} from "@amfa-team/room-service";
import type { IParticipant } from "@amfa-team/room-service";
import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";

function App(): ReactElement | null {
  const [participant, setParticipant] = useState<IParticipant | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const videoTrack = new RawVideoTrack("video", stream);
        const publication = new RawVideoTrackPublication("video", videoTrack);
        const p = new RawParticipant("me");
        p.addVideoTrack(publication);
        setParticipant(p);
      })
      .catch((e: Error) => setError(e));
  }, []);

  if (error) {
    throw error;
  }

  if (!participant) {
    return null;
  }

  return (
    <div>
      <Participant participant={participant} onClick={console.log} />
    </div>
  );
}

export default App;
