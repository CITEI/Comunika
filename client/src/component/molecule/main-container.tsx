import { Platform, StatusBar } from "react-native";
import styled from "styled-components/native";

const MainContainer = styled.View`
  padding-top: ${Platform.OS == "android" ? StatusBar.currentHeight : 0}px;
  background: ${(props) => props.theme.color.background};
  height: 100%;
`;

export default MainContainer;
