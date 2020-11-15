import { AdminApp } from "@amfa-team/room-service";
import React from "react";
import { useParams } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";

const adminPages = {
  room: "/admin/room",
  participant: "/admin/participant",
};

export default function Admin(props: { endpoint: string }) {
  const [secret, setSecret] = useLocalStorage("API_SECRET", "super-SECRET");
  const params = useParams<{ page?: string }>();

  return (
    <>
      <form noValidate autoComplete="off">
        <label htmlFor="secret">API Secret</label>
        <input
          id="secret"
          value={secret}
          onChange={(e) => {
            setSecret(e.target.value);
          }}
        />
      </form>
      <AdminApp
        settings={{ endpoint: props.endpoint, secret }}
        currentPage={params.page ?? null}
        links={adminPages}
      />
    </>
  );
}
