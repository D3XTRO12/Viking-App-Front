import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <CenteredView>
        <ModalView>
          <Title>{title}</Title>
          <Message>{message}</Message>
          <Button onPress={onClose}>
            <ButtonText>Cerrar</ButtonText>
          </Button>
        </ModalView>
      </CenteredView>
    </Modal>
  );
};

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const Message = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

export default AlertModal;
