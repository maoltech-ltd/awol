import React from 'react';
import StatusModal from './StatusModal';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <StatusModal
      isOpen={isOpen}
      onClose={onClose}
      title="Error"
      message={message}
    />
  );
};

export default ErrorModal;
