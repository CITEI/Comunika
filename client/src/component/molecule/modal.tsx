import React, { useCallback, useEffect, useState } from "react";
import { View, Modal as RModal, ModalBaseProps } from "react-native";
import styled from "../../pre-start/themes";
import { dp, sp, vh, vw } from "../../helper/resolution";
import RawButton from "../atom/button";
import RawText from "../atom/text";
import Title from "../atom/title";

interface ModalProps extends ModalBaseProps {
  title: string;
  text: string;
  setText(text: string): void;
}

const StyledModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  margin-top: 0;
  width: ${vw(100)}px;
  height: ${vh(100)}px;
  position: absolute;
  z-index: 999;
`;

const StyledModalContainer = styled.View`
  background-color: ${(props) => props.theme.color.background};
  border-radius: ${dp(10)}px;
  align-items: center;
  padding: ${dp(23)}px;
  padding-top: ${dp(26)}px;
  padding-bottom: ${dp(20)}px;
`;

const Text = styled(RawText)`
  text-align: center;
  font-size: ${sp(14)}px;
  margin-top: ${dp(10)}px;
`;

const Button = styled(RawButton)`
  width: ${vw(70)}px;
  max-height: ${dp(45)}px;
  margin-top: ${dp(14)}px;
`;

const Modal: React.VoidFunctionComponent<ModalProps> = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(props.visible || false);
  }, [props.visible]);

  return (
    <View>
      <RModal
        animationType="fade"
        transparent={true}
        {...props}
        visible={visible}
      >
        <StyledModalBackground>
          <StyledModalContainer>
            <Title style={{ textAlign: "center" }}>{props.title}</Title>
            <Text>{props.text}</Text>
            <Button label="Fechar" onPress={() => props.setText("")}></Button>
          </StyledModalContainer>
        </StyledModalBackground>
      </RModal>
    </View>
  );
};

export default Modal;
