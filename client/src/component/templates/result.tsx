import React, { useCallback } from "react";
import { StageItem } from "../../store/game-data";
import MainContainer from "../atom/main-container";
import ContentContainer from "../atom/content-container";
import Toolbar from "../organism/toolbar";
import styled from "../../pre-start/themes";
import BaseTitle from "../atom/title";
import BaseText from "../atom/text";
import { dp, sp } from "../../helper/resolution";
import Button from "../atom/button";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../../route/game";
import util from 'util'
import t from "../../pre-start/i18n";

interface ResultProps {
  stage: StageItem;
}

const Container = styled(ContentContainer)`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  text-align: center;
`;

const Image = styled.Image`
  width: ${dp(180)}px;
  height: ${dp(180)}px;
  margin-bottom: ${dp(20)}px;
  margin-top: ${dp(40)}px;
`;

const Text = styled(BaseText)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(16)}px;
  text-align: center;
  margin-bottom: ${dp(20)}px;
`;

const Footer = styled.View`
  width: 100%;
`;

const Result: React.VoidFunctionComponent<ResultProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();

  const handleBack = useCallback(() => {
    navigation.navigate("Main");
  }, []);

  const handleNext = useCallback(() => {
    navigation.navigate("Game");
  }, []);

  return (
    <MainContainer>
      <Toolbar
        accountButton={false}
        closeButton={false}
        logo={true}
        shadow={false}
      />
      <Container>
        <Title>{util.format(t("You made to %s!"), props.stage.name)}</Title>
        <Image
          source={{ uri: props.stage.image }}
          accessibilityHint={props.stage.imageAlt}
          resizeMode="contain"
        />
        <Text>{t("StageSucceeded")}</Text>
        <Footer>
          <Button title={t("Start next")} onPress={handleNext} />
          <Button variant="outline" title={t("Back to menu")} onPress={handleBack} />
        </Footer>
      </Container>
    </MainContainer>
  );
};

export default Result;
