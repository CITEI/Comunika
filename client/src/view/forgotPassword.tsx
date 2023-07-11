import React, { useEffect, useState } from "react";
import VerticalContainer from "../component/atom/verticalContainer";
import { useAppDispatch } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import { isEmail, isPassword } from "../helper/validators";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import t from "../pre-start/i18n";
import LoginHeader from "../component/organism/forgotHeader";
import Form from "../component/organism/form";
import { codeverify, resetpass, sendcode } from "../store/auth";
import Text from "../component/atom/text";
import Md from "../component/molecule/md";
import Input from "../component/molecule/input";
import Button from "../component/atom/button";

export interface ForgotPassProps {}

const ForgotPass: React.VoidFunctionComponent<ForgotPassProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const [email, setEmail] = useState<string>("");
  const [sendButtonAvailable, setSendButtonAvailable] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleSendCode = async () => {
    const result = (await dispatch(sendcode(email))).payload;

    if (result == 100 || result == 250) {
      navigation.navigate("ResetPass", { email: email });
    } else {
    }
  };

  const onEmailChange = (text: string) => {
    if (isEmail(text)) {
      setEmail(text);
      setSendButtonAvailable(true);
    } else if (sendButtonAvailable) {
      setSendButtonAvailable(false);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader />
        <VerticalContainer>
          <Input label="Digite seu Email" onChangeText={onEmailChange} />
          <Button
            disabled={!sendButtonAvailable}
            label="Enviar código"
            onPress={handleSendCode}
          ></Button>
          <Button
            disabled={email == ""}
            label="Já tenho o código"
            onPress={() => navigation.navigate("ResetPass", { email: email })}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ForgotPass;
