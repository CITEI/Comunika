import React from "react";
import styled from "../../pre-start/themes";
import ContentContainer from "../atom/content-container";
import BaseText from "../atom/text";
import Button from "../atom/button";
import { dp, sp } from "../../helper/resolution";
import { Module } from "../../store/modules";

const Container = styled(ContentContainer)`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Text = styled(BaseText)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(16)}px;
  text-align: center;
  margin-bottom: ${dp(20)}px;
`;

const Footer = styled.View`
  width: 100%;
`;

function ResultSuccess(props: {next?: Module, handleNext: () => void, handleBack: () => void}) {
  return (
    <Container>
      <Text>{'Parabéns você conclui o módulo com maestria'}</Text>
      <Footer>
        {props.next && <Button label={"Avançar para o próximo módulo"} onPress={props.handleNext} />}
        <Button
          variant="outline"
          label={'Voltar ao menu.'}
          onPress={props.handleBack}
        />
      </Footer>
    </Container>
  )
}

export default ResultSuccess;