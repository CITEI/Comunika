import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FullView } from "../component/atom/full-view";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../store/store";
import Button from "../component/atom/button";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import List from "../component/molecule/list";
import { fetchHistory } from "../store/user";

const Item = styled.Text`
  margin-top: 5px;
`;

const BoldItem = styled.Text`
  margin-top: 5px;
  font-weight: bold;
`;

const Spacing = styled.View`
  flex: 1;
`;

const Settings: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const info = useAppSelector((state) => state.user.info);
  const dispatch = useAppDispatch();
  const historyLoaded = useAppSelector((state) => state.user.historyLoaded);
  const history = useAppSelector((state) => state.user.history);

  useEffect(() => {
    if (!historyLoaded) dispatch(fetchHistory());
  }, [historyLoaded]);

  const handlePress = () => {
    navigation.navigate("Main");
  };

  return (
    <FullView>
      <BoldItem>Information</BoldItem>
      <Item>Email: {info.email}</Item>
      <Item>Name: {info.name}</Item>
      <BoldItem>History</BoldItem>
      <List
        data={history.map((el, i) => ({
          title: `#${i} ${el.category}`,
          subtitle: "",
          id: i,
        }))}
        onItemPress={() => {}}
      ></List>
      <Button title="Return" onPress={handlePress} />
    </FullView>
  );
};

export const SettingsButton: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();

  return (
    <Button
      title="Settings"
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate("Settings")}
    />
  );
};

export default Settings;
