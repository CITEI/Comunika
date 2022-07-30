import React from "react";
import styled from '../../pre-start/themes'
import Carrousel from "../molecule/carrousel";

export interface NodeProps {
  type: string;
  title: string;
  text: string;
  onNextPressed: () => void;
}

const Container = styled.View`
  flex: 1;
`

const Node: React.FunctionComponent<NodeProps> = (props) => {

  return (
    <View>
      {{
        "text": (
          <Container>
            <Image source={{uri: props.image}} />
            <Text>{props.text}</Text>
          </Container>
        )
        "carrousel": (
          <Container>
            <Carrousel />
            <Text>{props.text}</Text>
          </Container>
        )
      }[props.type]}
    </View>
  );
};

export default Node;
