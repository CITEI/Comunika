import styled from "../../pre-start/themes";
import { Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons"
import { dp, sp } from "../../helper/resolution";

const Container = styled.View`
`;

const Label = styled.Text`
  font-size: ${sp(13)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`;

const PressableLabel = styled(Label)`
  margin-left: ${dp(8)}px;
`;

function RelationSelection(props: { handle: (state: string) => void, parentSelected: boolean}) {
  return (
    <Container>
      <Label>Qual a relação com a criança?</Label>
      <Pressable onPress={() => props.handle('parent')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: dp(14), marginTop: dp(16)}}>
        <Icon name={props.parentSelected ? "radio-button-on" : "radio-button-off"} size={sp(24)}></Icon>
        <PressableLabel>Sou responsável</PressableLabel>
      </Pressable>
      <Pressable onPress={() => props.handle('educator')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: dp(16)}}>
        <Icon name={props.parentSelected ? "radio-button-off" : "radio-button-on"} size={sp(24)}></Icon>
        <PressableLabel>Sou educador (a)</PressableLabel>
      </Pressable>
    </Container>
  )
}

export default RelationSelection;