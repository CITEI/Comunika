import React, { useEffect, useState } from "react";
import LoginForm from "../component/organism/login-form";
import VerticalContainer from "../component/atom/vertical-container";
import { useAppDispatch } from "../store/store";
import { login } from "../store/auth";
import Button from "../component/atom/button";
import { showMessage } from "react-native-flash-message";
import { FullView } from "../component/atom/full-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import { Text } from "react-native";

export interface LoginProps {}

const Login: React.VoidFunctionComponent<LoginProps> = (props) => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authStatus = useSelector((state) => (state as any).auth.status);

  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (!first) {
      if (authStatus.isAuthenticated)
        showMessage({
          type: "success",
          message: "Logged",
          onHide: () => {
            navigation.popToTop();
            navigation.navigate("Main");
          },
        });
      else
        showMessage({
          type: "danger",
          description: "Invalid credentials",
          message: "Not logged",
        });
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
    <FullView>
      <Text style={{ fontWeight: "bold" }}>Login</Text>
      <VerticalContainer>
        <LoginForm onSubmit={handleLogin} />
        <Button
          title="Register"
          style={{ marginTop: "5px" }}
          onPress={handleRegister}
        />
      </VerticalContainer>
    </FullView>
  );
};

export default Login;
