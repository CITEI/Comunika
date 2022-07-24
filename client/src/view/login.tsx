import React, { useCallback, useEffect, useState } from "react";
import LoginForm from "../component/organism/login-form";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch } from "../store/store";
import { login } from "../store/auth";
import Button from "../component/atom/button";
import { FullView } from "../component/atom/full-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import Title from "../component/atom/title";
import { Image, View } from "react-native";
import logo from "../../assets/logo.png";
import { dp } from "../helper/resolution";
import Text from "../component/atom/text";
import Modal from "../component/molecule/modal";

export interface LoginProps {}

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authStatus = useSelector((state) => (state as any).auth.status);

  const [first, setFirst] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!first) {
      if (authStatus.isAuthenticated) {
        navigation.popToTop();
        navigation.navigate("Main");
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
    <FullView style={{ paddingHorizontal: dp(20) }}>
      <Modal
        text="Invalid credentials are present!"
        title="Not logged! :("
        onRequestClose={useCallback(() => setModalVisible(false), [])}
        visible={modalVisible}
      ></Modal>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: dp(25),
          marginTop: dp(25),
        }}
      >
        <Image
          source={logo}
          style={{
            width: dp(98),
            height: dp(41),
            marginBottom: dp(39),
          }}
        ></Image>
        <Title>Welcome!</Title>
      </View>
      <VerticalContainer>
        <LoginForm onSubmit={handleLogin} />
        <Button
          title="Create account"
          onPress={handleRegister}
          variant="outline"
        />
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Forgot the password? Click here
        </Text>
      </VerticalContainer>
    </FullView>
  );
};

export default Login;
