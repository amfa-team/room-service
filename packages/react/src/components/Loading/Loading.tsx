import { ErrorBoundary } from "@sentry/react";
import type { ReactElement } from "react";
import React, { Suspense } from "react";
import { useDictionary } from "../../i18n/dictionary";
import styles from "./loading.module.css";

export function LoadingFallback(): JSX.Element {
  const dictionary = useDictionary("loading");
  return (
    <div className={styles.box}>
      <p className={styles.text}>{dictionary.loading}</p>
    </div>
  );
}

interface ErrorFallbackProps {
  resetError(): void;
}

export function ErrorFallback({ resetError }: ErrorFallbackProps): JSX.Element {
  const dictionary = useDictionary("loading");

  return (
    <div className={styles.box}>
      <h4 className={styles.text}>{dictionary.error}</h4>
      <button className={styles.btn} type="button" onClick={resetError}>
        {dictionary.retry}
      </button>
    </div>
  );
}

export interface AsyncProps {
  children: ReactElement;
}

export function Async(props: AsyncProps): JSX.Element {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}
