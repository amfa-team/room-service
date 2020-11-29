import React from "react";
import {
  generateRawLocalParticipant,
  generateRawRemoteParticipant,
} from "../../../entities/fixtures/participants.fixture";
import { SquareDiv } from "../SquareDiv/SquareDiv";
import { ParticipantControls } from "./ParticipantControls";

export default {
  title: "ParticipantControls",
  component: ParticipantControls,
  decorators: [
    (Story: React.FC) => (
      <div style={{ marginLeft: "10%", marginTop: "5%", width: "80%" }}>
        <SquareDiv>
          <div
            style={{
              border: "1px solid red",
              borderRadius: "100%",
              width: "100%",
              height: "100%",
            }}
          >
            <Story />
          </div>
        </SquareDiv>
      </div>
    ),
  ],
};

export function Local() {
  return (
    <ParticipantControls
      participants={[]}
      participant={generateRawLocalParticipant()}
      isLocalParticipant
    />
  );
}

export function Remote() {
  return (
    <ParticipantControls
      participants={[]}
      participant={generateRawRemoteParticipant()}
    />
  );
}
