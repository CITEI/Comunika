import Icon from "@expo/vector-icons/Octicons";
import useDisabilities from "../../hooks/useDisabilities";
import { sp, dp } from "../../helper/resolution";
import Text from "./text";
import styled from "../../pre-start/themes";
import { View } from "react-native";

const Label = styled(Text)`
  font-size: ${sp(13)}px;
`;

const Field = styled(View)`
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: ${dp(15)}px;
`;

interface Props {
  list: string[];
  label?: string;
}

export default function ProfileDisabilities(props: Props) {
  const disabilities = useDisabilities().map((disability) => ({
    option: disability.name,
    value: disability._id,
  }));

  const userDisabilities = props.list.map((d) => {
    return disabilities.find((disability) => disability.value == d);
  });

  return (
    <>
      <Label>{props.label ?? "Deficiência(s) da criança:"}</Label>
      {userDisabilities.map((d) => {
        if (!d) return null;
        return (
          <Field key={d.value}>
            <Icon name="dot-fill" />
            <Text>{d.option}</Text>
          </Field>
        );
      })}
    </>
  );
}
