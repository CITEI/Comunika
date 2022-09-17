import React, { useEffect, useState } from "react";
import { FullView } from "../component/atom/full-view";
import RegisterForm from "../component/organism/register-form";
import { Text } from "react-native";
import { showMessage } from "react-native-flash-message";
import { register } from "../store/auth";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";

const Register: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);

  const [first, setFirst] = useState(true);

  const handleSubmit = (map: Map<string, string>) => {
    const email = map.get("email");
    const password = map.get("password");
    const name = map.get("name");
    if (email && password && name)
      dispatch(register({ email, password, name }));
  };

  useEffect(() => {
    if (!first) {
      if (authStatus.isAuthenticated)
        showMessage({
          message: "Registered",
          type: "success",
        });
      else
        showMessage({
          message: "Not registered",
          description: "Invalid fields are present",
          type: "danger",
        });
    } else setFirst(false);
  }, [authStatus]);

  return (
    <FullView>
      <Text style={{ fontWeight: "bold" }}>Register</Text>
      <RegisterForm onSubmit={handleSubmit} />
    </FullView>
  );
};

export default Register;
