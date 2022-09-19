import React from "react";
import MainContainer from "../component/atom/main-container";
import Toolbar from "../component/organism/toolbar";
import BaseTitle from "../component/atom/title";
import BaseText from "../component/atom/text";
import styled from "styled-components/native";
import { dp, sp } from "../helper/resolution";
import { useRoute } from "@react-navigation/native";
import { GameProps } from "../route/game";
import ContentContainer from "../component/atom/content-container";
import GeneralInstructions from "../component/organism/general-instructions";
import t from "../pre-start/i18n";

interface TransitionProps {}

const Content = styled(ContentContainer)`
  align-items: center;
  justify-content: center;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(22)}px;
  margin-top: ${dp(50)}px;
`;

const Subtitle = styled(BaseText)`
  font-size: ${sp(17)}px;
  margin-top: ${dp(8)}px;
`;

const Image = styled.Image`
  width: ${dp(180)}px;
  height: ${dp(180)}px;
  margin-top: ${dp(76)}px;
`;

/** Screen used as a transition between stages screen and activity screen */
const Transition: React.VoidFunctionComponent<TransitionProps> = (props) => {
  const route = useRoute();
  const { stage, activityIndex } = route.params as GameProps["Transition"];
  const [timer, setTimer] = React.useState(false);

  setTimeout(() => {
    setTimer(true);
  }, 1500);

  return (
    <MainContainer>
      <Toolbar
        logo={true}
        shadow={false}
        accountButton={false}
        closeButton={false}
      />
      <Content>
        {timer ? (
          <GeneralInstructions
            slides={[{text: t("General1"),}, {text: t("General2"),},
            ]}
          />
        ) : (
          <>
            <Title>{t("Starting activity")} {activityIndex}</Title>
            <Subtitle>{stage.name}</Subtitle>
            <Image
              resizeMode="contain"
              source={{ uri: stage.image }}
              accessibilityHint={stage.imageAlt}
            />
          </>
        )}
      </Content>
    </MainContainer>
  );
};

export default Transition;
