import styled from "../../pre-start/themes";
import Text from "./text";
import { sp, dp } from "../../helper/resolution";
import { View } from "react-native";

interface Props {
  label: string;
  value: string;
}

const Label = styled(Text)`
  font-size: ${sp(13)}px;
`;

const Field = styled(Text)`
  font-size: ${sp(16)}px;
  line-height: ${sp(20)}px;
  margin-top: ${dp(5)}px;
  margin-bottom: ${dp(20)}px;
`;

export default function ProfileField(props: Props) {
  return (
    <View>
      <Label>{props.label}</Label>
      <Field>{props.value}</Field>
    </View>
  );
}
