import React, { useEffect, useState } from "react";
import VerticalContainer from "../component/atom/verticalContainer";
import { useAppDispatch } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import { isEmail } from "../helper/validators";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import ForgotHeader from "../component/organism/forgotHeader";
import { sendcode } from "../store/auth";
import Input from "../component/molecule/input";
import Button from "../component/atom/button";
import ErrorModal from "../component/organism/errorModal";

export interface ForgotPassProps { }

const ForgotPass: React.VoidFunctionComponent<ForgotPassProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();

  const handleSendCode = async () => {
    if (!isValidEmail) return;
    const result = (await dispatch(sendcode(email))).payload;

    if (typeof result === "number") {
      navigation.navigate("ValidateCode", { email: email });
    } else {
      setError(result)
    }
  };

  const onEmailChange = (text: string) => {
    if (isEmail(text)) {
      setEmail(text);
      setIsValidEmail(true);
    } else {
      setEmail("");
      setIsValidEmail(false);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <ErrorModal visible={!!error} close={() => setError(undefined)} errorMessage={error!} />
        <ForgotHeader text="Digite o seu e-mail para recuperação de senha" />
        <VerticalContainer>
          <Input label="E-mail" onChangeText={onEmailChange} />
          <Button
            disabled={!isValidEmail}
            label="Enviar código"
            onPress={handleSendCode}
          ></Button>
          <Button
            disabled={!isValidEmail}
            variant="outline"
            label="Já tenho o código"
            onPress={() => navigation.navigate("ValidateCode", { email: email })}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ForgotPass;
