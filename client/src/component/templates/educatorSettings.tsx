import { EducatorI } from "../../store/auth";
import { dp } from "../../helper/resolution";
import { View } from "react-native";
import ProfileField from "../atom/ProfileField";
import ProfileDisabilities from "../atom/ProfileDisabilities";

interface props {
  user: EducatorI;
}

function EducatorSettings(props: props) {
  return (
    <View style={{ marginBottom: dp(20) }}>
      <ProfileField label="Nome:" value={props.user.name} />
      <ProfileField label="Escola:" value={props.user.school} />
      <ProfileField label="E-mail:" value={props.user.email} />
      <ProfileDisabilities
        label="Deficiência(s) das crianças:"
        list={props.user.disabilities}
      />
    </View>
  );
}

export default EducatorSettings;
