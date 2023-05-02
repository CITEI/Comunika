import React from "react";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import BaseTitle from "../atom/title";
import RawText from "../atom/text";
import BaseButton from "../atom/button";
import ShadowPanel from "../atom/shadow-panel";
import t from "../../pre-start/i18n";

interface CardProps {
  /** image url */
  image: string;
  /** image alt text */
  imageAlt: string;
  /** card title */
  title: string;
  /** card description */
  description: string;
  /** number of completed activities */
  progress: number;
  /** total number of activities */
  total: number;
  /** status of the card */
  status: "completed" | "incomplete" | "locked" | "ongoing";
  /** card button onPress handler */
  onPress: () => void;
}

const Container = styled(ShadowPanel)`
  background: ${(props) => props.theme.color.background};
  padding: ${dp(20)}px;
  border-radius: ${dp(10)}px;
  margin-bottom: ${dp(20)}px;
  font-family: ${(props) => props.theme.fontFamily.textBold};
  font-weight: bold;
  min-height: ${dp(160)}px;
`;

const Header = styled.View`
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(16)}px;
  flex: 3;
`;

const ProgressContainer = styled.View`
  flex-flow: row;
  flex: 2;
  justify-content: center;
`;

const ProgressText = styled(RawText)`
  font-size: ${sp(10)}px;
`;

const PercentText = styled(ProgressText)`
  font-size: ${sp(10)}px;
  color: ${(props) => props.theme.color.textProgress};
  font-family: ${(props) => props.theme.fontFamily.textBold};
`;

const BlockedText = styled(PercentText)`
  color: ${(props) => props.theme.color.primary};
`;

const ContentContainer = styled.View`
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${dp(13)}px;
  border-top-color: ${(props) => props.theme.color.hr};
  border-top-width: 1px;
  padding-top: ${dp(8)}px;
  flex: 1;
`;

const Icon = styled.Image`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const ContentRightContainer = styled.View`
  flex-flow: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex: 2;
  margin-left: ${dp(20)}px;
`;

const Description = styled(RawText)`
  font-size: ${sp(10)}px;
  text-align: center;
`;

const Button = styled(BaseButton)`
  width: 100%;
`;

/** Card is a component that displays the summarized information of a group
 * of activities. */
const Card: React.VoidFunctionComponent<CardProps> = (props) => {
  return (
    <Container>
      <Header>
        <Title>{props.title}</Title>
        {
          {
            ongoing: (
              <ProgressContainer>
                <ProgressText>
                  {props.progress}/{props.total}
                  {" | "}
                </ProgressText>
                <PercentText>
                  {Math.round((100 * props.progress) / props.total)}% {"completo"}
                </PercentText>
              </ProgressContainer>
            ),
            completed: <PercentText>{"Completo"}</PercentText>,
            incomplete: <PercentText>{"Não Iniciado"}</PercentText>,
            locked: <BlockedText>{"Bloqueado"}</BlockedText>,
          }[props.status || "locked"]
        }
      </Header>
      <ContentContainer>
        <Icon
          source={{ uri: props.image }}
          accessibilityLabel={props.imageAlt}
          style={{}}
          resizeMode="contain"
        />
        <ContentRightContainer>
          <Description>
            {props.description}
          </Description>
          {(props.status == "incomplete" || props.status == "completed" || props.status == "ongoing") && (
            <Button label={"Iniciar"} onPress={props.onPress} />
          )}
        </ContentRightContainer>
      </ContentContainer>
    </Container>
  );
};

export default Card;
