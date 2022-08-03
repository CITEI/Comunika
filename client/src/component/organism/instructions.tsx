import React, { useCallback } from "react";
import { Node as NodeType } from "../../store/user";
import Title from "../atom/title";
import Node from "./node";
import BaseButton from "../atom/button";
import { dp, sp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import BaseTTSPlayer from "./tts-player";
import Text from "../atom/text";

interface InstructionProps {
  title: string;
  stage: string;
  activity: number;
  nodes: NodeType[];
  onFinish: () => void;
}

const Button = styled(BaseButton)`
  margin-bottom: ${dp(30)}px;
  margin-top: ${dp(25)}px;
`

const Header = styled.View`
  align-items: center;
  margin-bottom: ${dp(20)}px;
`

const StageInfo = styled(Title)`
  font-family: ${props => props.theme.fontFamily.titleLight};
  font-size: ${sp(14)}px;
  margin-bottom: ${dp(4)}px;
`

const TTSLabel = styled(Text)`
  text-align: center;
  margin-bottom: ${dp(10)}px;
`

const TTSPlayer = styled(BaseTTSPlayer)`
  margin-bottom: ${dp(20)}px;
`

/** Activity instructions screen */
const Instructions: React.VoidFunctionComponent<InstructionProps> = (props) => {
  const [nodeIndex, setNodeIndex] = React.useState(0);

  const currentNode = props.nodes[nodeIndex] || {};
  const isLast = nodeIndex == (props.nodes.length - 1);

  /** Moves to the next activity node */
  const handleNextPressed = useCallback(() => {
    const next = nodeIndex + 1;
    if (next < props.nodes.length)
      setNodeIndex(nodeIndex + 1);
    else
      props.onFinish();
  }, [props.onFinish, nodeIndex])

  return (
    <>
      <Header>
        <StageInfo>
          Activity {props.activity} instructions | {props.stage}
        </StageInfo>
        <Title>{props.title}</Title>
      </Header>
      <TTSLabel>Tap here to listen instructions by audio:</TTSLabel>
      <TTSPlayer text={currentNode.text} />
      <Node {...currentNode} />
      <Button title={isLast ? "Finish" : "Next"} onPress={handleNextPressed} />
    </>
  );
};

export default Instructions;
