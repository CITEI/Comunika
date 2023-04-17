import React, { useCallback, useState } from "react";
import Toolbar from "../organism/toolbar";
import MainContainer from "../atom/main-container";
import BaseTitle from "../atom/title";
import styled from "styled-components/native";
import { dp, sp } from "../../helper/resolution";
import Card from "../molecule/card";
import BaseContentContainer from "../atom/content-container";
import util from "util";
import t from "../../pre-start/i18n";
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
  boxes: StorageBox;
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
          const box = props.boxes[data.id] ?? undefined;
          const status = box ? "ongoing" : data.done ? "completed" : (data.available ? "incomplete" : "locked");
          const length = box?.data.activities.length;

          let description = "";

          if (!box) {
            if (status == "completed") description = 'Clique no botão para refazer este módulo.';
            else if (status == 'incomplete') description = 'Clique no botão para começar este módulo.';
            else description = t('Finish the previous module to unlock this one');
          }
          else {
            if (length > 1) description = `Este módulo contém ${length} atividades a serem realizadas com a criança.`
            else description = `Este módulo contém 1 atividade a ser realizada com a criança.`
          }

          return (
            <Card
              title={data.name}
              description={description}
              image={data.image}
              imageAlt={data.imageAlt}
              progress={box?.answers.length}
              total={box?.data.activities.length}
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
