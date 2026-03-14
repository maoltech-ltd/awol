import React from "react";
import StatusModal from "./StatusModal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  return (
    <StatusModal
      isOpen={isOpen}
      onClose={onClose}
      title="Success"
      message={message}
    />
  );
};

export default SuccessModal;
