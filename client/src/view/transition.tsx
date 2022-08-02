import React from "react";
import MainContainer from "../component/molecule/main-container";
import Toolbar from "../component/organism/toolbar";
import BaseTitle from "../component/atom/title";
import BaseText from "../component/atom/text";
import styled from "styled-components/native";
import { dp, sp } from "../helper/resolution";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps, GameProps } from "../route/game";
import ContentContainer from "../component/atom/content-container";

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

/** Screen used as a transition between boxes screen and task screen */
const Transition: React.VoidFunctionComponent<TransitionProps> = (props) => {
  const route = useRoute();
  const navigation = useNavigation<GameNavigatorProps>();
  const { box } = route.params as GameProps["Transition"];

  setTimeout(() => {
    navigation.navigate("Game");
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
        <Title>Starting activity 1</Title>
        <Subtitle>{box.name}</Subtitle>
        <Image resizeMode="contain" source={{ uri: box.image }} />
      </Content>
    </MainContainer>
  );
};

export default Transition;
