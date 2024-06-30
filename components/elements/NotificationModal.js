import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const NotificationModal = ({ show, onHide, message, isSuccess }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center">
        {isSuccess ? (
          <FaCheckCircle style={{ color: "green", fontSize: "4rem" }} />
        ) : (
          <FaTimesCircle style={{ color: "red", fontSize: "4rem" }} />
        )}
        <p style={{ fontSize: "18px", margin: "20px 0" }}>{message}</p>
        <Button variant={isSuccess ? "success" : "danger"} onClick={onHide}>
          Continue
        </Button>
      </Modal.Body>
      <style jsx global>{`
        .modal-content {
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .modal-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Modal>
  );
};

export default NotificationModal;
