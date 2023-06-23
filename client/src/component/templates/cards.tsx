import React, { useCallback, useState } from "react";
import Toolbar from "../organism/toolbar";
import MainContainer from "../atom/main-container";
import BaseTitle from "../atom/title";
import styled from "styled-components/native";
import { dp, sp } from "../../helper/resolution";
import Card from "../molecule/card";
import BaseContentContainer from "../atom/content-container";
import { Module } from "../../store/modules";
import { StorageBox } from "../../store/local/GameStorage";

interface CardsProps {
  /** Title displayed over the cards */
  title: string;
  /** Singular name of the card unit */
  unit: string;
  /** Card button press handler */
  onPress: (id) => void;
  /** Card data */
  data: Module[];
  /** Local Storage Box */
  answers: StorageBox;
}

const ContentContainer = styled(BaseContentContainer)`
  padding-top: ${dp(20)}px;
`;

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  margin-bottom: ${dp(20)}px;
`;

/** Screen that shows a list of clickable cards */
const Cards = (props: CardsProps) => {
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
          const box = props.answers[data.id] ?? undefined;
          const status = box ? "ongoing" : data.done ? "completed" : (data.available ? "incomplete" : "locked");

          let description = "";

          if (!box) {
            if (status == "completed") description = 'Clique no botão para refazer este estágio.';
            else if (status == 'incomplete') description = 'Clique no botão para começar este estágio.';
            else description = 'Finalize o estágio anterior para liberar este.';
          }
          else {
            if (box?.totalActivities > 1) description = `Esse estágio possui ${box.totalActivities} atividades para serem realizadas com a criança!`
            else description = `Esse estágio possui 1 atividade a ser realizada com a criança.`
          }

          return (
            <Card
              title={data.name}
              description={description}
              image={data.image}
              imageAlt={data.imageAlt}
              progress={box?.answers.length}
              total={box?.totalActivities}
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
