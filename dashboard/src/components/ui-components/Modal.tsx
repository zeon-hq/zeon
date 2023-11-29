import React,{ ReactNode } from "react";
import { Modal } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode
};

const GenericModal = (props: Props) => {
  return (
    <>
      <Modal 
         yOffset="20vh" 
         xOffset={0}
      opened={props.opened} onClose={props.onClose} title={props.title}>
        {props.children}
      </Modal>
    </>
  );
};

export default GenericModal;
