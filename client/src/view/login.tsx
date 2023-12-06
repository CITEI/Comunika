import React, { useCallback, useEffect, useState } from "react";
import VerticalContainer from "../component/atom/verticalContainer";
import { useAppDispatch, useAppSelector } from "../store/store";
import { login } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import LoginHeader from "../component/organism/loginHeader";
import Form from "../component/organism/form";
import { isEmail, isPassword } from "../helper/validators";
import TextLink from "../component/molecule/textLink";
import { loadToken } from "../helper/settings";
import { fetchUserData } from "../store/user";
import { isOnboardingComplete } from "../helper/settings";
import ErrorModal from "../component/organism/errorModal";

export interface LoginProps {}

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authentication = useAppSelector((state) => state.auth.authentication);
  const storageAuth = useAppSelector((state) => state.user.loaded);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadToken().then(() => {
      dispatch(fetchUserData());
    });
  }, []);

  useEffect(() => {
    if (authentication.status || storageAuth) {
      isOnboardingComplete().then((completed) => {
        if (completed) navigation.navigate("Main");
        else navigation.navigate("Onboarding");
      });
    } else setError(authentication.message ?? "");
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

  function clearError() {
    setError(undefined);
  }

  return (
    <MainContainer>
      <ContentContainer>
        <ErrorModal
          visible={!!error}
          close={clearError}
          errorMessage={error!}
        />
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
