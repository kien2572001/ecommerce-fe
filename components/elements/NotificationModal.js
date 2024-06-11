import React from "react";
import { Modal, Button } from "react-bootstrap";

const NotificationModal = ({ show, onHide, message, isSuccess }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isSuccess ? "Success" : "Failure"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={isSuccess ? "success" : "danger"} onClick={onHide}>
          {isSuccess ? "OK" : "Try Again"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
