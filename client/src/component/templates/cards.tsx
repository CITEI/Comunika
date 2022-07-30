import React, { useCallback } from "react";
import Toolbar from "../organism/toolbar";
import MainContainer from "../molecule/main-container";
import BaseTitle from "../atom/title";
import styled from "styled-components/native";
import { dp, sp } from "../../helper/resolution";
import Card from "../molecule/card";
import { toUri } from "../../helper/api";
import { ScrollView } from "react-native";

interface CardData {
  image: string;
  /** Card image uri */
  imageAlt: string;
  /** Card image alt text */
  name: string;
  /** Card title */
  description: string;
  /** Card description */
  progress?: number;
  /** Card tasks progress */
  total?: number;
  /** Card total number of tasks */
  status?: "completed" | "incomplete" | "locked";
  /** Card status. If incomplete, progress and total must be provided */
}

interface CardsProps<T extends CardData> {
  title: string;
  /** Title displayed over the cards */
  onPress: (id: T) => void;
  /** Card button press handler */
  data: T[];
  /** Card data */
  current: number;
  /** index of the current in progress card */
}

const PaddedContainer = styled.View`
  padding-left: ${dp(20)}px;
  padding-right: ${dp(20)}px;
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
      <ScrollView>
        <PaddedContainer>
          <Title>{props.title}</Title>
          {props.data.map((data, i) => (
            <Card
              title={data.name}
              description={data.description}
              image={toUri(data.image)}
              imageAlt={data.imageAlt}
              progress={0}
              total={1}
              status={
                i == props.current ? "incomplete" : data.status || "locked"
              }
              onPress={useCallback(() => props.onPress(data), [props.onPress])}
              key={i}
            />
          ))}
        </PaddedContainer>
      </ScrollView>
    </MainContainer>
  );
};

export default Cards;
