import React, { useState } from "react";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import AudioButton from "../atom/audioButton";
import { SvgUri } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImageModal from "./imageModal";
import ScaledImage from "../atom/scaledImage";

export interface SoundImageProps {
  /** image uri */
  image: string;
  /** image alt description */
  imageAlt: string;
  /** audio uri */
  audio?: string;
}

const Container = styled.View`
  position: relative;
  width: 100%;
  height: ${dp(140)}px;
  background-color: ${(props) => props.theme.color.secondary};
  display: flex;
  justify-content: flex-end;
`;

const Audio = styled(AudioButton)`
  top: 0px;
  position: absolute;
  align-self: flex-start;
  margin: ${dp(10)}px;
`;

const StyledIcon = styled(Icon)`
  top: 0px;
  align-self: flex-end;
  position: absolute;
  padding: ${dp(8)}px;
`

/** Image with an optional sound */
const SoundImage: React.VoidFunctionComponent<SoundImageProps> = (props) => {
  const [displayVisible, setDisplayVisible] = useState<boolean>(false);
  const imageType = props.image.slice(-3);

  return (
    <Container>
      <ImageModal 
        visible={displayVisible} 
        close={() => { setDisplayVisible(false) }} 
        imageType={imageType} 
        imageUri={props.image} 
        imageAlt={props.imageAlt} 
      />
      {imageType == "svg" ? (
        <SvgUri
          accessibilityLabel={props.imageAlt}
          width="100%"
          height="100%"
          preserveAspectRatio="xMaxYMax"
          uri={props.image}
        ></SvgUri>
      ) : (
        <ScaledImage image={props.image} imageAlt={props.imageAlt}/>
      )}
      {props.audio && <Audio audio={props.audio} />}
      <StyledIcon name="arrow-expand" size={sp(16)} onPress={() => setDisplayVisible(true)}/>
    </Container>
  );
};

export default SoundImage;
