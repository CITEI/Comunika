import React, { useState } from "react";
import VerticalContainer from "../component/atom/verticalContainer";
import { useAppDispatch } from "../store/store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import { isPassword } from "../helper/validators";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import LoginHeader from "../component/organism/forgotHeader";
import { resetpass} from "../store/auth";
import Button from "../component/atom/button";
import PasswordInput from "../component/molecule/passwordInput";

export interface ResetPassProps {}

const ResetPassword: React.VoidFunctionComponent<ResetPassProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { email, code } = route.params as { email: string, code: string };
  const [newPass, setNewPass] = useState<string>("");
  const [newPassRepeat, setNewPassRepeat] = useState<string>("");

  const onPassChange = (
    text: string,
    update: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (isPassword(text)) {
      update(text);
    } else {
      update("")
    }
  };

  const isRecoverAvailable = () => {
    return newPass != "" && newPassRepeat == newPass;
  };

  const handleResetPassword = async () => {
    if(!isRecoverAvailable()) return;
    const result = await dispatch(
      resetpass({ token: code, email: email, password: newPass })
    );

    if (result && result.payload == 250) {
      navigation.pop(3);
      return;
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader text="Digite sua nova senha"/>
        <VerticalContainer>
          <PasswordInput
            label="Nova senha"
            onChangeText={(t) => onPassChange(t, setNewPass)}
          />
          <PasswordInput
            label="Repita a senha"
            onChangeText={(t) => onPassChange(t, setNewPassRepeat)}
          />
          <Button
            disabled={!isRecoverAvailable()}
            label="Alterar senha"
            onPress={handleResetPassword}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ResetPassword;
