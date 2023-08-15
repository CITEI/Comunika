import { Modal } from "react-native";
import styled from "../../pre-start/themes";
import { vw, vh, dp, sp } from "../../helper/resolution";
import RawTitle from "../atom/title";
import RawText from "../atom/text";
import RawButton from "../atom/button";

const ModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  width: ${vw(100)}px;
  height: ${vh(100)}px;
  position: absolute;
  z-index: 999;
`;

const ModalContainer = styled.View`
  background-color: ${(props) => props.theme.color.background};
  border-radius: ${dp(10)}px;
  align-items: center;
  padding: ${dp(20)}px;
  padding-top: ${dp(26)}px;
  padding-bottom: ${dp(26)}px;
  margin-left: ${dp(10)}px;
  margin-right: ${dp(10)}px;
`;

const Text = styled(RawText)`
  text-align: center;
  font-size: ${sp(14)}px;
  margin-top: ${dp(10)}px;
`;

const Button = styled(RawButton)`
  width: ${dp(200)}px;
  max-height: ${dp(38)}px;
  margin-top: ${dp(14)}px;
`;

const Bold = styled.Text`
  font-family: ${(props) => props.theme.fontFamily.textBold};
`;

const Title = styled(RawTitle)`
  text-align: center;
`;

interface LeaveActivityModal {
  quit: () => void;
  visible: boolean;
  close: () => void;
}

function LeaveActivityModal(props: LeaveActivityModal) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.close}
    >
      <ModalBackground>
        <ModalContainer>
          <Title>Tem certeza que deseja sair?</Title>
          <Text>Ao clicar em <Bold>sair</Bold> você será direcionado para o menu inicial. Mas não se preocupe, depois você poderá retomar de onde parou!</Text>
          <Button label="Sair" onPress={props.quit} />
          <Button variant="outline" label="Continuar atividade" onPress={props.close} />
        </ModalContainer>
      </ModalBackground>
    </Modal>
  )
}

export default LeaveActivityModal;