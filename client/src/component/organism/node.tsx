import React from "react";
import styled from "../../pre-start/themes";
import Carrousel from "../molecule/carrousel";
import BaseText from "../atom/text";
import { BaseNode } from "../../store/progress";
import { dp } from "../../helper/resolution";
import Md from "../molecule/md";
import SoundImage from "../molecule/soundimage";

export interface NodeProps extends BaseNode {
  [key: string]: any;
}

const Container = styled.View`
  align-items: center;
`;

const Node: React.FunctionComponent<NodeProps> = (props) => {
  return (
    <Container>
      {
        {
          text: (
            <SoundImage
              image={props.image}
              imageAlt={props.imageAlt}
              audio={props.audio}
            />
          ),
          carrousel: <Carrousel slides={props.images} preview={props.preview} />,
        }[props.type]
      }
      <Md>{props.text}</Md>
    </Container>
  );
};

export default Node;
