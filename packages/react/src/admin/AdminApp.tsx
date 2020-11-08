import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";
import type { AdminApiSettings } from "../api/api";
import AdminParticipant from "./AdminParticipant/AdminParticipant";
import AdminRoom from "./AdminRoom/AdminRoom";

interface AdminAppProps {
  settings: AdminApiSettings;
}

export default function AdminApp(props: AdminAppProps) {
  const { url } = useRouteMatch();
  return (
    <div>
      <ul>
        <li>
          <NavLink to={`${url}/room`}>Rooms</NavLink>
        </li>
        <li>
          <NavLink to={`${url}/participant`}>Participants</NavLink>
        </li>
      </ul>

      <hr />
      <Switch>
        <Route exact path={`${url}/room`}>
          <AdminRoom settings={props.settings} />
        </Route>
        <Route exact path={`${url}/participant`}>
          <AdminParticipant settings={props.settings} />
        </Route>
      </Switch>
    </div>
  );
}
