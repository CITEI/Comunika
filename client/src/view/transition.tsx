import React from "react";
import MainContainer from "../component/atom/main-container";
import Toolbar from "../component/organism/toolbar";
import BaseTitle from "../component/atom/title";
import BaseText from "../component/atom/text";
import styled from "styled-components/native";
import { dp, sp } from "../helper/resolution";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps, GameProps } from "../route/game";
import ContentContainer from "../component/atom/content-container";
import GeneralInstructions from "../component/organism/general-instructions";

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

/** Screen used as a transition between boxes screen and activity screen */
const Transition: React.VoidFunctionComponent<TransitionProps> = (props) => {
  const route = useRoute();
  const { stage, boxIndex } = route.params as GameProps["Transition"];
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
            slides={[
              {
                text:
                  "1 | Ao iniciar a atividade chamar a criança pelo nome no " +
                  "início e durante a realização para ter a certeza de que ela " +
                  "está participando.\n\n" +
                  "2 | Colocar a criança de frente para quem está conduzindo a " +
                  "atividade e certificar-se de que ela está numa boa posição " +
                  "para realiza-la.",
              },
              {
                text:
                  "3 | Verificar se a criança esta disposta para realizar as " +
                  "atividades: Se não está com sono, fome ou sob efeito de " +
                  "medicação.\n\n" +
                  "4| Evitar antecipar a resposta! Dê tempo para a criança " +
                  "participar da atividade de acordo com o ritmo dela.",
              },
            ]}
          />
        ) : (
          <>
            <Title>Starting activity {boxIndex}</Title>
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
