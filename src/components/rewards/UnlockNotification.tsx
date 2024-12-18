import React from 'react';

import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Text,
  Icon,
  Button
} from '@chakra-ui/react';
import { FaTrophy, FaLock } from 'react-icons/fa';

interface 
UnlockNotificationProps {
  isOpen: boolean;
  onClose:   void;
  unlockedItems: {
    type: feature  title  questLine  interface;
    name: string;
    description: string;
  }[];
}

export const UnlockNotification: React.FC<UnlockNotificationProps> = ({
  isOpen,
  onClose,
  unlockedItems
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            {unlockedItems.map((item, index) => (
              <Box
                key={index}
                p={4}
                borderWidth={1}
                borderRadius="md"
                width="100%"
              >
                <Icon
                  as={item.type === 'feature' ? FaLock : FaTrophy}
                  mr={2}
                  color="green.500"
                />
                <Text fontWeight="bold">{itemname}</Text>
                <Text fontSize="sm" color="gray600">
                  {itemdescription}
                </Text>
              </Box>
            ))}
          </VStack>
          <Button mt={4} colorScheme="green" onClick={onClose}>
            
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 