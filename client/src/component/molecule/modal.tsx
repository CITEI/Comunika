import React, { useCallback, useEffect, useState } from "react";
import { View, Modal as RModal, ModalBaseProps } from "react-native";
import styled from "../../pre-start/themes";
import { dp, vw, vh } from "../../helper/resolution";
import Button from "../atom/button";
import Text from "../atom/text";
import Title from "../atom/title";

interface ModalProps extends ModalBaseProps {
  title: string;
  text: string;
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
  width: ${vw(100) - dp(20)}px;
  padding: ${dp(20)}px;
  padding-top: ${dp(26)}px;
  padding-bottom: ${dp(26)}px;
  border-radius: ${dp(10)}px;
  text-align: center;
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
            <Text style={{ textAlign: "center", marginTop: dp(10) }}>
              {props.text}
            </Text>
            <Button
              title="Close"
              style={{ marginHorizontal: dp(20) }}
              onPress={useCallback(() => {
                setVisible(false);
                if (props.onRequestClose) props.onRequestClose()
              }, [])}
            ></Button>
          </StyledModalContainer>
        </StyledModalBackground>
      </RModal>
    </View>
  );
};

export default Modal;
