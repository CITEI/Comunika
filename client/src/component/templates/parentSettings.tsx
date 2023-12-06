import { ParentI } from "../../store/auth";
import { View } from "react-native";
import ProfileField from "../atom/ProfileField";
import ProfileDisabilities from "../atom/ProfileDisabilities";
import { dp } from "../../helper/resolution";

interface props {
  user: ParentI;
}

function ParentSettings(props: props) {
  return (
    <View style={{ marginBottom: dp(20) }}>
      <ProfileField label="Nome:" value={props.user.name} />
      <ProfileField label="E-mail:" value={props.user.email} />
      <ProfileField
        label="Grau de parentesco:"
        value={props.user.relationship}
      />
      <ProfileDisabilities list={props.user.disabilities} />
    </View>
  );
}

export default ParentSettings;
