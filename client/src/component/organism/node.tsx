import React from "react";
import styled from '../../pre-start/themes'
import Carrousel from "../molecule/carrousel";
import BaseText from '../atom/text'
import { BaseNode } from "../../store/user";
import AudibleMosaic from "../molecule/audible-mosaic";
import { dp, sp } from "../../helper/resolution";

export interface NodeProps extends BaseNode {
  [key: string]: any;
}

const Container = styled.View`
  align-items: center;
`

const Text = styled(BaseText)`
  margin-top: ${dp(16)}px;
  text-align: left;
  width: 100%;
`

const Image = styled.Image`
  width: 100%;
  height: ${dp(100)}px;
`

const Node: React.FunctionComponent<NodeProps> = (props) => {
  return (
    <Container>
      {{
        "text": (
          <Image source={{uri: props.image}} accessibilityHint={props.imageAlt} />
        ),
        "carrousel": (
          <Carrousel slides={props.images} />
        ),
        "audible_mosaic": (
          <AudibleMosaic images={props.images} />
        )
      }[props.type]}
      <Text>{props.text}</Text>
    </Container>
  );
};

export default Node;
