import React, { useState } from "react";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import AudioButton from "../atom/audioButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import ImageModal from "./imageModal";
import { Image, ImageContentPosition } from 'expo-image';

export interface SoundImageProps {
  /** image uri */
  image: string;
  /** image alt de]ription */
  imageAlt: string;
  /** audio uri */
  audio?: string;
  position?: string;
}

const Container = styled.View`
  width: 100%;
  height: ${dp(120)}px;
  background-color: ${props => props.theme.color.secondary};
`;

const Audio = styled(AudioButton)`
  top: 0px;
  position: absolute;
  align-self: flex-start;
  margin: ${dp(8)}px;
  width: ${dp(30)}px;
  height: ${dp(25)}px;
  border-radius: ${dp(5)}px;
`;

const StyledIcon = styled(Icon)`
  top: 0px;
  align-self: flex-end;
  position: absolute;
  padding: ${dp(8)}px;
`

/** Image with an optional sound */
function SoundImage (props: SoundImageProps) {
  const [displayVisible, setDisplayVisible] = useState<boolean>(false);

  return (
    <Container>
      <ImageModal 
        visible={displayVisible} 
        close={() => { setDisplayVisible(false) }} 
        imageUri={props.image} 
        imageAlt={props.imageAlt} 
        position={props.position}
      />
      <Image
        style={{width: "100%", height: "100%"}}
        contentFit="contain"
        contentPosition={`bottom ${props.position}` as ImageContentPosition}
        source={props.image}
        alt={props.imageAlt}
      />
      {props.audio && <Audio audio={props.audio}/>}
      <StyledIcon name="arrow-expand" size={sp(16)} onPress={() => setDisplayVisible(true)}/>
    </Container>
  );
};

export default SoundImage;
