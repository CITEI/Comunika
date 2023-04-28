import React, { useEffect, useState } from "react";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch } from "../store/store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import { isEmail, isPassword } from "../helper/validators";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import LoginHeader from "../component/organism/forgot-header";
import Form from "../component/organism/form";
import { codeverify, resetpass, sendcode } from "../store/auth";
import Text from '../component/atom/text';
import Md from '../component/molecule/md';
import Input from "../component/molecule/input";
import Button from "../component/atom/button";
import PasswordInput from "../component/molecule/password-input";
import { dp } from "../helper/resolution";

export interface ForgotPassProps { }

const ForgotPass: React.VoidFunctionComponent<ForgotPassProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const [code, setCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | undefined>(undefined);
  const [newPass, setNewPass] = useState<string>("");
  const [newPassRepeat, setNewPassRepeat] = useState<string>("");

  const onCodeChange = (text: string) => {
    setCode(text);
  }

  const onPassChange = (
    text: string,
    update: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (isPassword(text)) {
      update(text);
    }
  }

  const validadeCode = async () => {
    const result = await dispatch(codeverify({ email: email, token: code }));
    if (result.payload == 200) setIsCodeValid(true);
    else setIsCodeValid(false);
  }

  const handleResetPassword = async () => {
    const result = await dispatch(
      resetpass({ token: code, email: email, password: newPass })
    );

    if (result && result.payload == 202) {
      navigation.pop(2);
      return;
    }
  };

  const isRecoverAvailable = () => {
    return newPass != "" && (newPassRepeat == newPass) && isCodeValid;
  }

  useEffect(() => {
    if (code.length == 6) {
      validadeCode();
    }
  }, [code])

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader />
        <VerticalContainer>
          <Input
            autoCorrect={false}
            style={{ textTransform: 'uppercase' }}
            mask={[/([\w\d])/, /([\w\d])/, /([\w\d])/, /([\w\d])/, /([\w\d])/, /([\w\d])/]}
            label="Código"
            value={code}
            onChangeText={onCodeChange} />
          <PasswordInput label="Nova senha" onChangeText={(t) => onPassChange(t, setNewPass)} />
          <PasswordInput label="Repita a senha" onChangeText={(t) => onPassChange(t, setNewPassRepeat)} />
          {(!isCodeValid && isCodeValid != undefined) ? <Md style={{ marginTop: dp(5) }}>#### **Código inválido**</Md> : <></>}
          <Button disabled={!isRecoverAvailable()} label="Restaurar a senha" onPress={handleResetPassword} />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ForgotPass;