import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";

interface ICallingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  onAccept: () => void;
  username: string | undefined | null;
}

const CallingModal: React.FunctionComponent<ICallingModalProps> = ({
  isOpen,
  onClose,
  username,
  onAccept,
  onReject,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{username && username.split("-")[0]} is Calling...</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" variant="outline" mr={3} onClick={onReject}>
            Reject
          </Button>
          <Button
            variant="solid"
            colorScheme="blue"
            autoFocus
            onClick={onAccept}
          >
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CallingModal;
