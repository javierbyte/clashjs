import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './modal-styles.css'

export default function CustomModal({ children, modalStyle, ...props }) {
  return (
    <Modal
      classNames={{
        overlay: 'custom-overlay',
        modal: modalStyle ?? 'custom-modal',
      }}
      closeIcon={<FontAwesomeIcon icon={faWindowClose} inverse size="2x" />}
      {...props}
    >
      {children}
    </Modal>
  );
}