import React, { useEffect, useState } from "react";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch } from "../store/store";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";

import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import LoginHeader from "../component/organism/forgot-header";
import Form from "../component/organism/form";
import { codeverify, resetpass, sendcode } from "../store/auth";

export interface ForgotPassProps {}

const ForgotPass: React.VoidFunctionComponent<ForgotPassProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const [email, setEmail] = useState<string>("");
  const dispatch = useAppDispatch();
  const [codeButtonDisabled, setCodeButtonDisabled] = useState<boolean>(false);

  const [validated, setValidated] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const handleResetPassword = async (map: Map<string, string>) => {
    const email = map.get("email");
    const code = map.get("code")?.split("-");
    const newPass = map.get("password");

    if (!code || !email || !newPass) return;

    const result = await dispatch(
      resetpass({ code: code[0] + code[1], email, password: newPass })
    );

    if (result && result.payload == 202) {
      navigation.goBack();
      return;
    }
  };

  let codeTimeout: NodeJS.Timeout;

  const verifyCode = async () => {
    const newcode = code.split("-")[0] + code.split("-")[1];
    const result = await dispatch(codeverify({ code: newcode, email }));

    if (result.payload == 200) {
      setValidated(true);
    }
  };

  const handleSendCode = async () => {
    if (codeButtonDisabled) return;

    setCodeButtonDisabled(true);
    const result = (await dispatch(sendcode(email))).payload;

    if (result == 100) return setCodeButtonDisabled(true);
    if (result != 250) return setCodeButtonDisabled(true);

    codeTimeout = setTimeout(() => {
      setCodeButtonDisabled(false);
    }, 600000);
  };

  useEffect(() => {
    if (code.length == 7) {
      verifyCode();
    }
  }, [code]);

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader />

        <VerticalContainer>
          <Form
            inputs={[
              {
                type: "text",
                label: t("Email"),
                name: "email",
                onChangeText: (text) => {
                  clearTimeout(codeTimeout);
                  setCodeButtonDisabled(false);
                  setEmail(text);
                },
              },
              { type: "password", label: t("Password"), name: "password" },
              {
                type: "password",
                label: t("Repeat the password"),
                name: "re-password",
              },
              {
                type: "code",
                name: "code",
                button: {
                  label: t("send"),
                  disabled: codeButtonDisabled,
                  onPress: handleSendCode,
                },
                input: {
                  label: t("Verify code"),
                  keyboardType: "number-pad",
                  mask: [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
                  onChangeText: (text) => setCode(text),
                },
              },
              {
                type: "submit",
                label: t("Recover"),
                name: "login",
                onSubmit: handleResetPassword,
                disabled: !validated,
              },

              {
                type: "button",
                label: t("Back"),
                name: "back",
                onPress: () => navigation.goBack(),
              },
            ]}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ForgotPass;
