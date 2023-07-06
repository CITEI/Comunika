import React, { useCallback, useEffect, useState } from "react";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch, useAppSelector } from "../store/store";
import { login } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import Modal from "../component/molecule/modal";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import LoginHeader from "../component/organism/login-header";
import Form from "../component/organism/form";
import { isEmail, isPassword } from "../helper/validators";
import TextLink from "../component/molecule/text-link";
import { loadToken } from "../helper/settings";
import { fetchUserData } from "../store/user";
import { sp } from "../helper/resolution";

export interface LoginProps {}

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authentication = useAppSelector((state) => state.auth.authentication);
  const storageAuth = useAppSelector((state) => state.user.loaded);
  const [validated, setValidated] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    loadToken().then(() => {
      dispatch(fetchUserData());
    })
  }, []);

  useEffect(() => {
    if (authentication.status || storageAuth) {
      navigation.navigate("Onboarding");
    } else setModalText(authentication.message || "");
  }, [authentication, storageAuth]);

  const handleChange = useCallback(
    (map: Map<string, string>) => {
      if (
        isPassword(map.get("password") || "") &&
        isEmail(map.get("email") || "")
      )
        setValidated(true);
      else setValidated(false);
    },
    [setValidated]
  );

  const handleLogin = (map: Map<string, string>) => {
    const email = map.get("email");
    const password = map.get("password");
    if (email && password) dispatch(login({ email, password }));
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgot = () => {
    navigation.navigate("ForgotPass");
  };

  return (
    <MainContainer>
      <ContentContainer>
        <Modal
          text={t(modalText)}
          title={t("Não logado! :(")}
          onRequestClose={useCallback(() => setModalText(""), [])}
          visible={Boolean(modalText)}
        ></Modal>
        <LoginHeader />
        <VerticalContainer>
          <Form
            inputs={[
              { type: "text", label: "Email", name: "email" },
              { type: "password", label: "Senha", name: "password" },
              {
                type: "submit",
                label: "Entrar",
                name: "login",
                onSubmit: handleLogin,
                disabled: !validated,
              },
              {
                type: "button",
                label: "Criar conta",
                name: "register",
                onPress: handleRegister,
              },
            ]}
            onChange={handleChange}
          />
          <TextLink
            text={"Esqueceu a senha?" + " "}
            link={"Clique aqui"}
            onPress={handleForgot}
          />
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Login;
