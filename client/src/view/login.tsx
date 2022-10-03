import React, { useCallback, useEffect, useState } from "react";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch, useAppSelector } from "../store/store";
import { login } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import Text from "../component/atom/text";
import Modal from "../component/molecule/modal";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import LoginHeader from "../component/organism/login-header";
import Form from "../component/organism/form";

export interface LoginProps {}

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authentication = useAppSelector((state) => state.auth.authentication);
  const [validated, setValidated] = useState(false);

  const [first, setFirst] = useState(true);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (!first) {
      if (authentication.status) {
        navigation.navigate("Onboarding");
      } else setModalText(authentication.message);
    } else setFirst(false);
  }, [authentication]);

  const handleChange = useCallback(
    (map: Map<string, string>) => {
      if (
        (map.get("password") || "").length < 8 ||
        !/\w+@\w+\.\w+/.test(map.get("email") || "")
      )
        setValidated(false);
      else setValidated(true);
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

  return (
    <MainContainer>
      <ContentContainer>
        <Modal
          text={t(modalText)}
          title={t("Not logged! :(")}
          onRequestClose={useCallback(() => setModalText(""), [])}
          visible={Boolean(modalText)}
        ></Modal>
        <LoginHeader />
        <VerticalContainer>
          <Form
            inputs={[
              { type: "text", label: t("Email"), name: "email" },
              { type: "password", label: t("Password"), name: "password" },
              {
                type: "submit",
                label: t("Login"),
                name: "login",
                onSubmit: handleLogin,
                disabled: !validated,
              },
              {
                type: "button",
                label: t("Create account"),
                name: "register",
                onPress: handleRegister,
              },
            ]}
            onChange={handleChange}
          />
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            {t("Forgot the password? Click here!")}
          </Text>
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Login;
