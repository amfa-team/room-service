import React from "react";
import type { ReactNode } from "react";
import type { RoomDictionary } from "../../i18n/dictionary";
import { useSetDictionary } from "../../i18n/dictionary";

interface DictionaryProviderProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
  dictionary: RoomDictionary;
}

export function DictionaryProvider(
  props: DictionaryProviderProps,
): JSX.Element {
  useSetDictionary(props.dictionary);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{props.children}</>;
}
