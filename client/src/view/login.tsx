import React, { useCallback, useEffect, useState } from "react";
import LoginForm from "../component/organism/login-form";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch } from "../store/store";
import { login } from "../store/auth";
import Button from "../component/atom/button";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import Title from "../component/atom/title";
import logo from "../../assets/logo.png";
import { dp } from "../helper/resolution";
import Text from "../component/atom/text";
import Modal from "../component/molecule/modal";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import styled from "styled-components/native";
import t from "../pre-start/i18n";

export interface LoginProps {}

const Header = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${dp(25)}px;
  margin-bottom: ${dp(25)}px;
`

const Logo = styled.Image`
  width: ${dp(98)}px;
  height: ${dp(41)}px;
  margin-bottom: ${dp(39)}px;
  margin-top: ${dp(25)}px;
`

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authStatus = useSelector((state) => (state as any).auth.status);

  const [first, setFirst] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!first) {
      if (authStatus.isAuthenticated) {
        navigation.navigate("Onboarding");
      } else setModalVisible(true);
    } else setFirst(false);
  }, [authStatus]);

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
          text={t("Invalid credentials are present!")}
          title={t("Not logged! :(")}
          onRequestClose={useCallback(() => setModalVisible(false), [])}
          visible={modalVisible}
        ></Modal>
        <Header>
          <Logo source={logo} />
          <Title>{t("Welcome!")}</Title>
        </Header>
        <VerticalContainer>
          <LoginForm onSubmit={handleLogin} />
          <Button
            title={t("Create account")}
            onPress={handleRegister}
            variant="outline"
          />
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            {t('Forgot the password? Click here!')}
          </Text>
        </VerticalContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Login;
