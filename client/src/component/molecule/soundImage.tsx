import React, { useState } from "react";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import AudioButton from "../atom/audioButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImageModal from "./imageModal";
import { Image } from 'expo-image';

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

  return (
    <Container>
      <ImageModal 
        visible={displayVisible} 
        close={() => { setDisplayVisible(false) }} 
        imageUri={props.image} 
        imageAlt={props.imageAlt} 
      />
      <Image
        style={{width: '100%', flex: 1}}
        source={props.image}
        alt={props.imageAlt}
        contentFit="contain"
        contentPosition={'bottom center'}
      />
      {props.audio && <Audio audio={props.audio} />}
      <StyledIcon name="arrow-expand" size={sp(16)} onPress={() => setDisplayVisible(true)}/>
    </Container>
  );
};

export default SoundImage;
