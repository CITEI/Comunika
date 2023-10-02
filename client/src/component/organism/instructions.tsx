import React, { useCallback } from "react";
import { Node as NodeType } from "../../store/progress";
import BaseTitle from "../atom/title";
import Node from "./node";
import BaseButton from "../atom/button";
import { dp, sp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import BaseTTSPlayer from "./ttsPlayer";
import TTSLabel from "../atom/ttsLabel";
import t from "../../pre-start/i18n";
import util from "util";
import { extractText } from "../../helper/markdown";

interface InstructionProps {
  title: string;
  module: string;
  activity: number;
  nodes: NodeType[];
  onFinish: () => void;
}

const Button = styled(BaseButton)`
  margin-bottom: ${dp(30)}px;
  margin-top: ${dp(20)}px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: ${dp(15)}px;
`;

const ModuleInfo = styled(BaseTitle)`
  font-family: ${(props) => props.theme.fontFamily.titleLight};
  font-size: ${sp(14)}px;
  margin-bottom: ${dp(3)}px;
`;

const Title = styled(BaseTitle)`
  text-align: center;
  font-size: ${sp(16)}px;
`;

const TTSPlayer = styled(BaseTTSPlayer)`
  margin-bottom: ${dp(15)}px;
`;

/** Activity instructions screen */
const Instructions: React.VoidFunctionComponent<InstructionProps> = (props) => {
  const [nodeIndex, setNodeIndex] = React.useState(0);

  const currentNode = props.nodes[nodeIndex] || {};
  const isLast = nodeIndex == props.nodes.length - 1;

  /** Moves to the next activity node */
  const handleNextPressed = useCallback(() => {
    const next = nodeIndex + 1;
    if (next < props.nodes.length) setNodeIndex(nodeIndex + 1);
    else props.onFinish();
  }, [props.onFinish, nodeIndex]);

  return (
    <>
      <Header>
        <ModuleInfo>{props.module}</ModuleInfo>
        <Title>{props.title}</Title>
      </Header>
      <TTSPlayer text={extractText(currentNode.text)} />
      <Node {...currentNode} />
      <Button
        label={isLast ? "Finalizar" : "Próximo"}
        onPress={handleNextPressed}
      />
    </>
  );
};

export default Instructions;
