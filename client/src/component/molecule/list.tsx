import React from "react";
import ListRow from "../atom/list-row";
import styled from "styled-components/native";
import { View } from "react-native";

const FlatList = styled.FlatList`
  width: 100%;
`;

export interface ListItem {
  id: any;
  title: string;
  subtitle: string;
}

interface ListProps {
  data: ListItem[];
  onItemPress: (id: any) => void;
}

const List: React.FunctionComponent<ListProps> = (props) => {
  return (
    <View>
      <FlatList
        data={props.data}
        renderItem={(el) => (
          <ListRow
            {...(el.item as ListItem)}
            key={el.index}
            onPress={props.onItemPress}
          />
        )}
      />
    </View>
  );
};

export default List;
