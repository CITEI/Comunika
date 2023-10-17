import { Modal } from "react-native";
import styled from "../../pre-start/themes";
import { vw, vh, dp, sp } from "../../helper/resolution";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, ImageContentPosition } from "expo-image";

const ModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-start;
  align-items: center;
  width: ${vw(100)}px;
  height: ${vh(100)}px;
  position: absolute;
  z-index: 999;
`;

interface ImageModalProps {
  visible: boolean,
  close: () => void,
  imageUri: string,
  imageAlt: string,
  position?: string,
}

const ImageBackground = styled.View`
  display: flex;
  flex: 1;
  background-color: ${(props) => props.theme.color.secondary};
  margin-top: ${dp(170)}px;
  width: ${vw(95)}px;
  max-height: ${vh(30)}px;
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
          <Image
            style={{width: "100%", flex: 1}}
            source={props.imageUri}
            alt={props.imageAlt}
            contentFit="contain"
            contentPosition={`bottom ${props.position}` as ImageContentPosition}
          />
          <StyledIcon name="arrow-collapse" size={sp(16)} onPress={props.close}/>
        </ImageBackground>
      </ModalBackground>
    </Modal>
  )
}

export default ImageModal;