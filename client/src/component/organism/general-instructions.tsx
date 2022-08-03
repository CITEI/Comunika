import React, { useCallback } from "react";
import styled from "../../pre-start/themes";
import BaseTitle from "../atom/title";
import BaseText from "../atom/text";
import { dp, sp } from "../../helper/resolution";
import Button from "../atom/button";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../../route/game";
import BaseTTSPlayer from "./tts-player";
import TTSLabel from "../atom/tts-label";

interface GeneralInstructionsProps {
  slides: {
    text: string;
  }[];
}

const Container = styled.View`
  width: 100%;
  text-align: left;
`

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  text-align: center;
  margin-top: ${dp(50)}px;
  margin-bottom: ${dp(18)}px;
`;

const Text = styled(BaseText)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(16)}px;
  text-align: center;
  margin-bottom: ${dp(38)}px;
`;

const TTSPlayer = styled(BaseTTSPlayer)`
  margin-bottom: ${dp(34)}px;
`

const Footer = styled.View`
  width: 100%;
`;

const GeneralInstructions: React.VoidFunctionComponent<GeneralInstructionsProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slide = props.slides[currentSlide];

  const handleNext = useCallback(() => {
    if (currentSlide < props.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate("Game");
    }
  }, [currentSlide, navigation, props.slides.length]);

  return (
    <Container>
      <Title>General Instructions</Title>
      <TTSLabel />
      <TTSPlayer text={slide.text} />
      <Text>{slide.text}</Text>
      <Footer>
        <Button title="Next" onPress={handleNext} />
      </Footer>
    </Container>
  );
};

export default GeneralInstructions;
