import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface CustomAlertProps {
  title: string;
  content: string;
  visible: boolean;
  onDismiss: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ title, content, visible, onDismiss }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <CenteredView>
        <ModalView>
          <Title>{title}</Title>
          <Message>{content}</Message>
          <Button onPress={onDismiss}>
            <ButtonText>Confirmar</ButtonText>
          </Button>
        </ModalView>
      </CenteredView>
    </Modal>
  );
};

// Estilos personalizados para el modal de alerta
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
  border-radius: 5px;
  padding: 10px 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export default CustomAlert;
