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
import util from "util";
import t from "../../pre-start/i18n";
import { EvaluateStatus } from "../../store/user";

interface ResultProps {
  stage: StageItem;
  status: EvaluateStatus | "ended";
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

const TITLE_MESSAGES: {[key in ResultProps["status"]]: string} = {
  "approved": t("You made to %s!"),
  "ended": t("You finished %s"),
  "reproved": t("Let's reinforce %s again"),
};

const CONTENT_MESSAGES: {[key in ResultProps["status"]]: string} = {
  "approved": t("StageSucceeded"),
  "ended": t("NoContent"),
  "reproved": t("StageFailed"),
};

/** Templated result screen */
const Result: React.VoidFunctionComponent<ResultProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();

  /** Goes back to the modules screen */
  const handleBack = useCallback(() => {
    navigation.pop(2);
  }, []);

  /** Goes to the activities page of the next box */
  const handleNext = useCallback(() => {
    navigation.replace("Game");
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
        <Title>
          {util.format(
            TITLE_MESSAGES[props.status],
            props.stage.name
          )}
        </Title>
        <Image
          source={{ uri: props.stage.image }}
          accessibilityHint={props.stage.imageAlt}
          resizeMode="contain"
        />
        <Text>{CONTENT_MESSAGES[props.status]}</Text>
        <Footer>
          {props.status != "ended" && (
            <Button label={t("Start next")} onPress={handleNext} />
          )}
          <Button
            variant="outline"
            label={t("Back to menu")}
            onPress={handleBack}
          />
        </Footer>
      </Container>
    </MainContainer>
  );
};

export default Result;
