import React from "react";
import ResultTemplate from "../component/templates/result";
import { useAppSelector } from "../store/store";
import { Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import { GameProps } from "../route/game";

/** Screen displayed after an activity box is completed */
const Result: React.VoidFunctionComponent = () => {
  const route = useRoute();
  const grade = useAppSelector((state) => state.progress.grade);
  const { module } = route.params as GameProps["Result"];
  return <ResultTemplate module={module} grade={grade!} />;
};

export default Result;
