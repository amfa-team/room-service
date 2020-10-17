import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "@amfa-team/react-service-template/dist/index.css";
import "./global.css";

if (process.env.SENTRY_ENVIRONMENT !== "dev") {
  init({
    dsn: process.env.SENTRY_DNS,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
    environment: process.env.SENTRY_ENVIRONMENT,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root"),
);
