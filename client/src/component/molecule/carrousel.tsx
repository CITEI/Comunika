import { dp, sp } from "../../helper/resolution";
import React, { useCallback } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import styled from "../../pre-start/themes";
import { Audio } from "expo-av";

interface CarrouselProps {
  /** slides definition */
  slides: {
    /** image uri */
    image?: string;
    /** image alt description */
    imageAlt?: string;
    /** audio uri */
    audio?: string;
  }[];
}

const Container = styled.View`
  width: 100%;
  height: ${dp(100)}px;
  flex-flow: row;
  background: ${(props) => props.theme.color.secondary};
  align-items: center;
  justify-content: center;
`;

const ArrowContainer = styled.TouchableOpacity`
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: ${dp(20)}px;
`;

const ArrowIcon = styled(Icon)`
  color: ${(props) => props.theme.color.primary};
  font-size: ${sp(16)}px;
`;

const Content = styled.View`
  flex: 1;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding-bottom: ${dp(10)}px;
  padding-top: ${dp(5)}px;
`;

const Image = styled.Image`
  flex: 2;
  width: 100%;
  height: 100%;
`;

const AudioContainer = styled.TouchableOpacity`
  background: ${(props) => props.theme.color.primary};
  border-radius: ${dp(5)}px;
  padding: ${dp(5)}px;
  padding-left: ${dp(7)}px;
  padding-right: ${dp(7)}px;
  align-items: center;
  justify-content: center;
`;

const AudioIcon = styled(ArrowIcon)`
  color: ${(props) => props.theme.color.text};
  font-size: ${sp(12)}px;
`;

const Carrousel: React.VoidFunctionComponent<CarrouselProps> = (props) => {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  const data = props.slides;
  const current = props.slides[index];

  /** Changes the current image to the next */
  const handleNext = useCallback(() => {
    setIndex((index + 1) % data.length);
  }, [index]);

  /** Changes the current image to the previous */
  const handlePrevious = useCallback(() => {
    if (index == 0) setIndex(data.length - 1);
    else setIndex(index - 1);
  }, [index]);

  /** Plays an audio when the speaker button is pressed */
  const handleAudioPress = useCallback(async () => {
    if (current.audio && !playing) {
      setPlaying(true);
      await Audio.Sound.createAsync(
        { uri: current.audio },
        { shouldPlay: true },
        (status) => {
          if (status['didJustFinish']) setPlaying(false);
        }
      );
    }
  }, [playing, index]);

  return (
    <Container>
      <ArrowContainer onPress={handlePrevious}>
        <ArrowIcon name="caretleft" />
      </ArrowContainer>
      <Content>
        {current.image && (
          <Image
            source={{ uri: current.image }}
            resizeMode="contain"
            accessibilityHint={current.imageAlt}
          />
        )}
        {current.audio && (
          <AudioContainer onPress={handleAudioPress}>
            <AudioIcon name="sound" />
          </AudioContainer>
        )}
      </Content>
      <ArrowContainer onPress={handleNext}>
        <ArrowIcon name="caretright" />
      </ArrowContainer>
    </Container>
  );
};

export default Carrousel;
