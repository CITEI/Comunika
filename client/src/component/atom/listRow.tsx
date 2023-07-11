import { Text } from "react-native";
import React, { useCallback } from "react";
import styled from "styled-components/native";

const RowContainer = styled.TouchableOpacity`
  padding: 20px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: lightgray;
`;

const BoldText = styled.Text`
  font-weight: bold;
`;

export interface ListRowProps {
  id: any
  title: string;
  subtitle: string;
  onPress: (id: any) => void;
}

const ListRow: React.VoidFunctionComponent<ListRowProps> = (props) => {
  return (
    <RowContainer onPress={useCallback(() => props.onPress(props.id), [props.id])}>
      <BoldText>{props.title}</BoldText>
      <Text>{props.subtitle}</Text>
    </RowContainer>
  );
};

export default ListRow;
