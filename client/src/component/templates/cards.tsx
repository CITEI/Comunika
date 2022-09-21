import React, { useCallback } from "react";
import Toolbar from "../organism/toolbar";
import MainContainer from "../atom/main-container";
import BaseTitle from "../atom/title";
import styled from "styled-components/native";
import { dp, sp } from "../../helper/resolution";
import Card from "../molecule/card";
import BaseContentContainer from "../atom/content-container";
import util from "util";
import t from "../../pre-start/i18n";

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
  [key: string]: any;
}

interface CardsProps<T> {
  /** Title displayed over the cards */
  title: string;
  /** Singular name of the card unit */
  unit: string;
  /** Card button press handler */
  onPress: (id: T) => void;
  /** Card data */
  data: T[];
  /** index of the current in progress card */
  current: number;
  /** Card activities progress */
  progress?: number;
  /** Card total number of activities. If total equals progress, it means
   * no incomplete cards */
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
const Cards = (props) => {
  const total = props.total == undefined ? 1 : props.total;
  const progress = props.progress == undefined ? 0 : props.progress;
  const ended = total == progress;

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
        {props.data.map((data, i) => {
          const status =
            ended || i < props.current
              ? "completed"
              : i == props.current
              ? "incomplete"
              : "locked";

          let description = "";
          if (status == "completed")
            description = util.format(t('This %s is already completed'), props.unit);
          else if (status == "incomplete")
            description = util.format(t(
              'This %s contains %s activities to be done with the child'
            ), props.unit, total);
          else {
            const previous = props.data[i - 1].name.toLowerCase();
            description = util.format(
              t('Finish %s activities to unlock this %s'),
              previous, props.unit
            );
          }

          return (
            <Card
              title={data.name}
              description={description}
              image={data.image}
              imageAlt={data.imageAlt}
              progress={progress}
              total={total}
              status={status}
              onPress={useCallback(() => props.onPress(data), [props.onPress])}
              key={i}
            />
          );
        })}
      </ContentContainer>
    </MainContainer>
  );
};

export default Cards;
