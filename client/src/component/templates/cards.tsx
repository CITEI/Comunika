import React, { useCallback } from "react";
import Toolbar from "../organism/toolbar";
import MainContainer from "../atom/main-container";
import BaseTitle from "../atom/title";
import styled from "styled-components/native";
import { dp, sp } from "../../helper/resolution";
import Card from "../molecule/card";
import BaseContentContainer from "../atom/content-container";

interface CardData {
  /** Card image uri */
  image: string;
  /** Card image alt text */
  imageAlt: string;
  /** Card title */
  name: string;
  /** Card description */
  description: string;
  /** Card status. If incomplete, progress and total must be provided */
  status?: "completed" | "incomplete" | "locked";
}

interface CardsProps<T extends CardData> {
  /** Title displayed over the cards */
  title: string;
  /** Card button press handler */
  onPress: (id: T) => void;
  /** Card data */
  data: T[];
  /** index of the current in progress card */
  current: number;
  /** Card activities progress */
  progress?: number;
  /** Card total number of activities */
  total?: number;
}

const ContentContainer = styled(BaseContentContainer)`
  padding-top: ${dp(20)}px;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  margin-bottom: ${dp(20)}px;
`;

/** Screen that shows a list of clickable cards */
const Cards: React.VoidFunctionComponent<CardsProps<any>> = (props) => {
  return (
    <MainContainer>
      <Toolbar
        logo={true}
        accountButton={true}
        closeButton={false}
        shadow={true}
      ></Toolbar>
      <ContentContainer>
        <Title>{props.title}</Title>
        {props.data.map((data, i) => (
          <Card
            title={data.name}
            description={data.description}
            image={data.image}
            imageAlt={data.imageAlt}
            progress={props.progress || 0}
            total={props.total || 1}
            status={
              (i < props.current)
                ? "completed"
                : i == props.current
                ? "incomplete"
                : "locked"
            }
            onPress={useCallback(() => props.onPress(data), [props.onPress])}
            key={i}
          />
        ))}
      </ContentContainer>
    </MainContainer>
  );
};

export default Cards;
