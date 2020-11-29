import React from "react";
import { SquareDiv } from "./SquareDiv";

export default {
  title: "SquareDiv",
  component: SquareDiv,
  decorators: [
    (Story: React.FC) => (
      <div style={{ marginLeft: "10%", marginTop: "5%", width: "80%" }}>
        <Story />
      </div>
    ),
  ],
};

export function Default(): JSX.Element | null {
  return (
    <SquareDiv>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </SquareDiv>
  );
}

export function Hidden(): JSX.Element | null {
  return (
    <SquareDiv hidden>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </SquareDiv>
  );
}
