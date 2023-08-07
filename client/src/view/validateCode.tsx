import React, { useEffect, useState } from "react";
import VerticalContainer from "../component/atom/verticalContainer";
import { useAppDispatch } from "../store/store";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import PasswordInput from "../component/molecule/passwordInput";
import { dp } from "../helper/resolution";

export interface ValidateCodeProps { }

const ValidateCode: React.VoidFunctionComponent<ValidateCodeProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const [code, setCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | undefined>(undefined);

  const onCodeChange = (text: string) => {
    setCode(text);
  };

  const validadeCode = async () => {
    const result = await dispatch(codeverify({ email: email, token: code }));
    if (result.payload == 200) setIsCodeValid(true);
    else setIsCodeValid(false);
  };

  useEffect(() => {
    if (code.length == 6) {
      validadeCode();
    }
  }, [code]);

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader text="Digite o código para redefinir a sua senha" />
        <VerticalContainer>
          <Input
            autoCorrect={false}
            style={{ textTransform: "uppercase" }}
            mask={[
              /([\w\d])/,
              /([\w\d])/,
              /([\w\d])/,
              /([\w\d])/,
              /([\w\d])/,
              /([\w\d])/,
            ]}
            label="Código"
            value={code}
            onChangeText={onCodeChange}
          />
          {!isCodeValid && isCodeValid != undefined ? (
            <Md style={{ marginTop: dp(5) }}>#### **Código inválido**</Md>
          ) : (
            <></>
          )}
          <Button
            disabled={!isCodeValid}
            label="Recuperar senha"
            onPress={() => navigation.navigate("ResetPass", { email: email, code: code })}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ValidateCode;
