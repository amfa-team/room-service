import React from "react";
import type { AdminApiSettings } from "../api/api";
import AdminParticipant from "./AdminParticipant/AdminParticipant";
import AdminRoom from "./AdminRoom/AdminRoom";

type AdminPages = {
  room: string;
  participant: string;
};

interface AdminAppProps {
  settings: AdminApiSettings;
  links: AdminPages;
  currentPage: string | null;
}

export default function AdminApp(props: AdminAppProps) {
  return (
    <div>
      <ul>
        <li>
          <a href={props.links.room}>Rooms</a>
        </li>
        <li>
          <a href={props.links.participant}>Participants</a>
        </li>
      </ul>

      <hr />

      {props.currentPage === "room" && <AdminRoom settings={props.settings} />}
      {props.currentPage === "participant" && (
        <AdminParticipant settings={props.settings} />
      )}
    </div>
  );
}
