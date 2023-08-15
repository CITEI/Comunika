import { Modal } from "react-native";
import RawText from "../atom/text";
import RawButton from "../atom/button";
import styled from "../../pre-start/themes";
import { vw, vh, dp, sp } from "../../helper/resolution";
import Title from "../atom/title";
import ErrorMessages from "../../helper/error";

interface ErrorModalProps {
  visible: boolean,
  close: () => void,
  errorMessage: string
}

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
  padding: ${dp(23)}px;
  padding-top: ${dp(26)}px;
  padding-bottom: ${dp(26)}px;
  margin-left: ${dp(20)}px;
  margin-right: ${dp(20)}px;
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

function getContent(error: string) {
  const content = ErrorMessages[error];
  if (!content) {
    return {
      title: "Erro interno!",
      description: "Provavelmente este erro não é sua culpa, tente novamente mais tarde."
    }
  }
  else return content;
}

function ErrorModal(props: ErrorModalProps) {
  const content = getContent(props.errorMessage);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.close}
    >
      <ModalBackground>
        <ModalContainer>
          <Title>{content.title}</Title>
          <Text>{content.description}</Text>
          <Button label="Fechar" onPress={props.close} />
        </ModalContainer>
      </ModalBackground>
    </Modal>
  )
}

export default ErrorModal;