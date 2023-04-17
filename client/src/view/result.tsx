import React from "react";
import ResultTemplate from "../component/templates/result";
import useBox from "../hooks/useBox";
import useUserStage from "../hooks/useuserstage";
import { useAppSelector } from "../store/store";
import { Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import { GameProps } from "../route/game";


/** Screen displayed after an activity box is completed */
const Result: React.VoidFunctionComponent = () => {
  const route = useRoute();
  const navigation = useNavigation<GameNavigatorProps>();
  const result = useAppSelector(state => state.user.result);
  const { module } = route.params as GameProps["Result"];
  return (
    <ResultTemplate module={module} status={result!}/>
  ) 
};

export default Result;
