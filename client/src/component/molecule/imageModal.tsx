import { Modal } from "react-native";
import styled from "../../pre-start/themes";
import { vw, vh, dp, sp } from "../../helper/resolution";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";

const ModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-start;
  align-items: center;
  width: ${vw(100)}px;
  height: ${vh(100)}px;
  position: absolute;
  z-index: 999;
`;

const ImageStyled = styled(Image)`
  width: 100%;
  height: 100%;
`;

interface ImageModalProps {
  visible: boolean,
  close: () => void,
  imageUri: string,
  imageAlt: string,
}

const ImageBackground = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.color.secondary};
  margin-top: ${dp(170)}px;
  width: ${vw(95)}px;
  max-height: ${vh(30)}px;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
`;

const StyledIcon = styled(Icon)`
  top: 0px;
  right: 0px;
  position: absolute;
  padding: ${dp(8)}px;
`

function ImageModal(props: ImageModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.close}
    >
      <ModalBackground>
        <ImageBackground>
          <ImageStyled 
            source={props.imageUri}
            alt={props.imageAlt}
            contentFit="contain"
            contentPosition={'bottom center'}
          />
          <StyledIcon name="arrow-collapse" size={sp(16)} onPress={props.close}/>
        </ImageBackground>
      </ModalBackground>
    </Modal>
  )
}

export default ImageModal;