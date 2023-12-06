import styled from "../../pre-start/themes";
import { sp } from "../../helper/resolution";
import { TextProps } from "react-native";

export interface LabelProps extends TextProps {}

/** Text that describes the purpose of an input */
const Label = styled.Text`
  font-size: ${sp(13)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`;

export default Label;
