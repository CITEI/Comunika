import React from "react";
import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";
import AudioButton from "../atom/audioButton";
import { SvgUri } from "react-native-svg";

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
  height: ${(props) => dp(100)}px;
  background-color: ${(props) => props.theme.color.secondary};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

const Audio = styled(AudioButton)`
  position: absolute;
  align-self: flex-start;
  margin: ${(props) => dp(10)}px;
`;

/** Image with an optional sound */
const SoundImage: React.VoidFunctionComponent<SoundImageProps> = (props) => {
  return (
    <Container>
      {props.image.slice(-3) == "svg" ? (
        <SvgUri
          accessibilityLabel={props.imageAlt}
          width="100%"
          height="100%"
          uri={props.image}
        ></SvgUri>
      ) : (
        <Image
          source={{ uri: props.image }}
          accessibilityLabel={props.imageAlt}
          resizeMode="contain"
        ></Image>
      )}
      {props.audio && <Audio audio={props.audio} />}
    </Container>
  );
};

export default SoundImage;
