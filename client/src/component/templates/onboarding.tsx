import React, { useCallback } from "react";
import { ImageSourcePropType } from "react-native";
import MainContainer from "../atom/mainContainer";
import ContentContainer from "../atom/contentContainer";
import Toolbar from "../organism/toolbar";
import styled from "../../pre-start/themes";
import BaseTitle from "../atom/title";
import BaseText from "../atom/text";
import { dp, sp } from "../../helper/resolution";
import Button from "../atom/button";

interface OnboardingProps {
  slides: {
    image: ImageSourcePropType;
    imageAlt: string;
    text: string;
    title: string;
  }[];
  onFinish?: () => void;
}

const Container = styled(ContentContainer)`
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: ${dp(25)}px;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(18)}px;
  text-align: center;
  margin-bottom: ${dp(18)}px;
`;

const Image = styled.Image`
  width: ${dp(200)}px;
  height: ${dp(200)}px;
  margin-bottom: ${dp(38)}px;
`;

const Text = styled(BaseText)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(14)}px;
  text-align: center;
  margin-bottom: ${dp(38)}px;
`;

const Footer = styled.View`
  width: 100%;
`;

/** Onboarding screen */
const Onboarding: React.VoidFunctionComponent<OnboardingProps> = (props) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slide = props.slides[currentSlide];
  const isLast = currentSlide == props.slides.length - 1;

  /** Advances to the next slide */
  const handleNext = useCallback(() => {
    if (isLast) {
      props.onFinish?.();
    } else setCurrentSlide(currentSlide + 1);
  }, [currentSlide, props.slides.length]);

  return (
    <MainContainer>
      <Toolbar
        accountButton={false}
        closeButton={false}
        logo={true}
        shadow={false}
      />
      <Container>
        <Title>{slide.title}</Title>
        <Text>{slide.text}</Text>
        <Image
          source={slide.image}
          accessibilityLabel={slide.imageAlt}
          resizeMode="contain"
        />
        <Footer>
          <Button
            label={isLast ? "Ir para as atividades" : "Próximo"}
            onPress={handleNext}
          />
          <Text />
        </Footer>
      </Container>
    </MainContainer>
  );
};

export default Onboarding;
