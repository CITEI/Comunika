import React, { useCallback } from "react";
import styled from "../../pre-start/themes";
import BaseTitle from "../atom/title";
import BaseText from "../atom/text";
import { dp, sp } from "../../helper/resolution";
import Button from "../atom/button";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../../route/game";
import BaseTTSPlayer from "./ttsPlayer";
import TTSLabel from "../atom/ttsLabel";
import t from "../../pre-start/i18n";
import Md from "../molecule/md";
import { Module } from "../../store/modules";

interface GeneralInstructionsProps {
  slides: {
    text: string;
  }[];
  module: Module;
}

const Container = styled.View`
  width: 100%;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  text-align: center;
  margin-top: ${dp(50)}px;
  margin-bottom: ${dp(30)}px;
`;

const Text = styled(Md)`
`;

const TTSPlayer = styled(BaseTTSPlayer)`
  margin-bottom: ${dp(5)}px;
`;

const Footer = styled.View`
  width: 100%;
`;

const GeneralInstructions: React.VoidFunctionComponent<
  GeneralInstructionsProps
> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slide = props.slides[currentSlide];

  const handleNext = useCallback(() => {
    if (currentSlide < props.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate("Game", { module: props.module });
    }
  }, [currentSlide, navigation, props.slides.length]);

  function handleSkip() {
    navigation.navigate("Game", { module: props.module });
  }

  return (
    <Container>
      <Title>{"Instruções gerais"}</Title>
      <TTSLabel />
      <TTSPlayer text={slide.text} />
      <Text textStyle={{ fontSize: sp(13), lineHeight: sp(20) }}>{slide.text}</Text>
      <Footer>
        <Button label={"Próximo"} onPress={handleNext} />
        <Button variant="outline" label={"Pular tutorial"} onPress={handleSkip} />
      </Footer>
    </Container>
  );
};

export default GeneralInstructions;
