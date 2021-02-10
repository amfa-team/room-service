import { action } from "@storybook/addon-actions";
import React from "react";
import { defaultRoomDictionary } from "../../i18n/dictionary";
import { NotSupported } from "./NotSupported";

export default {
  title: "NotSupported",
  component: NotSupported,
};

export function Default(): JSX.Element | null {
  return (
    <NotSupported
      onForce={action("onShuffle")}
      dictionary={defaultRoomDictionary.fr.notSupported}
    />
  );
}
