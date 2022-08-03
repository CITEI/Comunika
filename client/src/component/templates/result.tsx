import React, { useCallback } from 'react'
import { StageItem } from '../../store/game-data'
import { EvaluateStatus } from '../../store/user';
import MainContainer from '../atom/main-container';
import ContentContainer from '../atom/content-container';
import Toolbar from '../organism/toolbar';
import styled from "../../pre-start/themes"
import BaseTitle from '../atom/title';
import BaseText from '../atom/text';
import { dp, sp } from '../../helper/resolution';
import Button from '../atom/button';
import { useNavigation } from '@react-navigation/native';
import { GameNavigatorProps } from '../../route/game';

interface ResultProps {
  stage: StageItem;
}

const Container = styled(ContentContainer)`
  align-items: center;
  justify-content: center;
  height: 100%;
`

const Title = styled(BaseTitle)`
  font-size: ${sp(20)}px;
  text-align: center;
`

const Image = styled.Image`
  width: ${dp(180)}px;
  height: ${dp(180)}px;
  margin-bottom: ${dp(20)}px;
  margin-top: ${dp(40)}px;
`

const Text = styled(BaseText)`
  font-family: ${props => props.theme.fontFamily.titleLight};
  font-size: ${sp(16)}px;
  text-align: center;
  margin-bottom: ${dp(20)}px;
`

const Footer = styled.View`
  width: 100%;
`

const Result: React.VoidFunctionComponent<ResultProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();

  const handleBack = useCallback(() => {
    navigation.navigate("Main");
  }, [])

  const handleNext = useCallback(() => {
    navigation.navigate("Game");
  }, [])

  return (
    <MainContainer>
      <Toolbar accountButton={false} closeButton={false} logo={true} shadow={false} />
      <Container>
        <Title>You made to {props.stage.name}!</Title>
        <Image source={{uri: props.stage.image}} accessibilityHint={props.stage.imageAlt} />
        <Text>Based on your answers, we concluded it is time to move on to the next stage.</Text>
        <Footer>
          <Button title="Start next" onPress={handleNext} />
          <Button variant='outline' title="Back to menu" onPress={handleBack} />
        </Footer>
      </Container>
    </MainContainer>
  )
}

export default Result