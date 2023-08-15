import React, { useEffect } from "react";
import MainContainer from "../component/atom/mainContainer";
import Toolbar from "../component/organism/toolbar";
import BaseTitle from "../component/atom/title";
import BaseText from "../component/atom/text";
import styled from "styled-components/native";
import { dp, sp } from "../helper/resolution";
import { useRoute } from "@react-navigation/native";
import { GameProps } from "../route/game";
import ContentContainer from "../component/atom/contentContainer";
import GeneralInstructions from "../component/organism/generalnstructions";
import { GameNavigatorProps } from "../route/game";
import { useNavigation } from "@react-navigation/native";
import t from "../pre-start/i18n";
import useAnswers from "../hooks/useAnswers";
import { SvgUri } from "react-native-svg";

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

const SvgImage = styled(SvgUri)`
  margin-top: ${dp(76)}px;
`;

/** Screen used as a transition between modules screen and activity screen */
const Transition: React.VoidFunctionComponent<TransitionProps> = (props) => {
  const route = useRoute();
  const { module } = route.params as GameProps["Transition"];
  const answers = useAnswers();
  const [timer, setTimer] = React.useState(false);

  const instructions = [
    "1 | Ao iniciar a atividade chamar a criança pelo nome no início e durante a realização para ter a certeza de que ela está participando.\n\n2 | Colocar a criança de frente para quem está conduzindo a atividade e certificar-se de que ela está numa boa posição para realiza-la.",
    "3 | Verificar se a criança esta disposta para realizar as atividades: Se não está com sono, fome ou sob efeito de medicação.\n\n4| Evitar antecipar a resposta! Dê tempo para a criança participar da atividade de acordo com o ritmo dela.",
  ];

  setTimeout(() => {
    setTimer(true);
  }, 1500);

  return (
    <MainContainer>
      <Toolbar
        logo={true}
        shadow={false}
        accountButton={false}
      />
      <Content>
        {timer ? (
          <GeneralInstructions
            slides={[{ text: instructions[0] }, { text: instructions[1] }]}
            module={module}
          />
        ) : (
          <>
            <Title>
              {"Iniciando atividade"}{" "}
              {(answers[module.id]?.answers.length ?? 0) + 1}
            </Title>
            <Subtitle>{module.name}</Subtitle>
            {module.image.slice(-3) == "svg" ? (
              <SvgImage
                width={dp(180)}
                height={dp(180)}
                uri={module.image}
                accessibilityLabel={module.imageAlt}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={{ uri: module.image }}
                accessibilityLabel={module.imageAlt}
              />
            )}
          </>
        )}
      </Content>
    </MainContainer>
  );
};

export default Transition;
