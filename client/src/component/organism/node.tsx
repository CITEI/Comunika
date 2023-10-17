import React, { useState } from "react";
import styled from "../../pre-start/themes";
import Carrousel from "../molecule/carrousel";
import BaseText from "../atom/text";
import { BaseNode } from "../../store/progress";
import { dp } from "../../helper/resolution";
import Md from "../molecule/md";
import SoundImage from "../molecule/soundImage";
import { View } from "react-native";

export interface NodeProps extends BaseNode {
  [key: string]: any;
}

const Container = styled.View`
  margin-top: ${dp(5)}px;
  align-items: center;
`;

function Node(props: NodeProps) {
  const [text, setText] = useState<string>(
    props.type == "carrousel"
      ? props.text.replace("$uniqueText", props.images[0].uniqueText ?? '')
      : props.text
  );

  return (
    <Container>
      {
        {
          text: (
            <SoundImage
              image={props.image}
              imageAlt={props.imageAlt}
              audio={props.audio}
              position={props.position}
            />
          ),
          carrousel: (
            <Carrousel
              slides={props.images}
              preview={props.preview}
              text={props.text}
              setText={setText}
            />
          ),
        }[props.type]
      }
      <View>
        <Md>{text}</Md>
      </View>
    </Container>
  );
}

export default Node;
