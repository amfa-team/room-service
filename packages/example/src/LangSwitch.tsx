import React from "react";
import { NavLink, useParams } from "react-router-dom";

export default function LangSwitch() {
  const { roomName } = useParams<{
    roomName?: string;
    lang: "en" | "fr";
  }>();

  return (
    <ul>
      <li>
        <NavLink to={roomName ? `/en/${roomName}` : "/en"}>English</NavLink>
      </li>
      <li>
        <NavLink to={roomName ? `/fr/${roomName}` : "/fr"}>Français</NavLink>
      </li>
    </ul>
  );
}
