import { Button, Modal } from "@amfa-team/theme-service";
import React, { useEffect, useState } from "react";
import type { NotSupportedPageDictionary } from "../../i18n/dictionary";
import classes from "./notSupported.module.css";

interface NotSupportedProps {
  onForce: () => void;
  dictionary: NotSupportedPageDictionary;
}

export function NotSupported(props: NotSupportedProps) {
  const { dictionary, onForce } = props;
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      id="room-service/not-supported"
      close={() => {
        setIsOpen(false);
      }}
    >
      <h2 className={classes.title}>{dictionary.title}</h2>
      <p className={classes.desc}>{dictionary.desc}</p>
      <Button onClick={onForce}>{dictionary.force}</Button>
    </Modal>
  );
}
