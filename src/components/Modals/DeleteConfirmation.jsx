// DeleteConfirmationModal.jsx
import React from "react";
import { Modal, Button } from "antd";

const DeleteConfirmation = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Confirm Deletion"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          No
        </Button>,
        <Button key="confirm" type="primary" danger onClick={onConfirm}>
          Yes
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this transaction?</p>
    </Modal>
  );
};

export default DeleteConfirmation;
