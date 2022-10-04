import React, { useCallback } from "react";
import t from "../../pre-start/i18n";
import MainContainer from "../atom/main-container";
import ContentContainer from "../atom/content-container";
import Toolbar from "../organism/toolbar";
import styled from "../../pre-start/themes";
import BaseTitle from "../atom/title";
import BaseText from "../atom/text";
import { dp, sp } from "../../helper/resolution";
import Button from "../atom/button";
import { ImageSource } from "react-native-vector-icons/Icon";

interface OnboardingProps {
  slides: {
    image: ImageSource;
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
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  text-align: center;
  margin-top: ${dp(50)}px;
  margin-bottom: ${dp(18)}px;
`;

const Image = styled.Image`
  width: ${dp(200)}px;
  height: ${dp(200)}px;
  margin-bottom: ${dp(38)}px;
`;

const Text = styled(BaseText)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(16)}px;
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
          accessibilityHint={slide.imageAlt}
          resizeMode="contain"
        />
        <Footer>
          <Button
            label={isLast ? t("Go to the activities") : t("Next")}
            onPress={handleNext}
          />
        </Footer>
      </Container>
    </MainContainer>
  );
};

export default Onboarding;
