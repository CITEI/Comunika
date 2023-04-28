import React, { useCallback, useEffect, useState } from "react";
import { register } from "../store/auth";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import ContentContainer from "../component/atom/content-container";
import MainContainer from "../component/atom/main-container";
import LoginHeader from "../component/organism/login-header";
import t from "../pre-start/i18n";
import useDisabilities from "../hooks/usedisabilities";
import Form from "../component/organism/form";
import TextLink from "../component/molecule/text-link";
import { isEmail, isPassword } from "../helper/validators";
import ToS from "../component/molecule/tos";

const isLongerThanTwo = (txt: string) => txt.length > 2;

const validators = {
  email: isEmail,
  password: isPassword,
  confirm: isPassword,
  guardian: isLongerThanTwo,
  relationship: isLongerThanTwo,
  birth: (date: Date) => true,
  disabilities: (arr: string[]) => arr.length > 0,
  region: isLongerThanTwo,
};

const Register: React.VoidFunctionComponent = () => {
  const authenticated = useAppSelector((state) => state.auth.authentication.status);
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const disabilities = useDisabilities();
  const [validated, setValidated] = useState(false);

  const handleChange = (map: Map<string, any>) => {
    for (const key of Object.keys(validators)) {
      if (!map.has(key) || !validators[key](map.get(key))) {
        setValidated(false);
        return;
      }
    }
    if (map.get("password") != map.get("confirm")) setValidated(false);
    else setValidated(true);
  };

  const handleSubmit = useCallback(
    (map: Map<string, string>) => {
      const data = {
        email: map.get("email"),
        password: map.get("password"),
        guardian: map.get("guardian"),
        relationship: map.get("relationship"),
        birth: map.get("birth"),
        disabilities: map.get("disabilities"),
        region: map.get("region"),
      } as any;
      dispatch(register(data));
    },
    [dispatch]
  );

  const handleLogin = useCallback(() => {
    navigation.replace("Login");
  }, [navigation]);

  useEffect(() => {
    if (authenticated)
      navigation.navigate("Onboarding");
  }, [authenticated]);

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader />
        <Form
          inputs={[
            { type: "text", label: "Email", name: "email" },
            { type: "password", label: "Senha", name: "password" },
            { type: "password", label: "Confirmar senha", name: "confirm" },
            {
              type: "text",
              label: "Nome do responsável",
              name: "guardian",
            },
            {
              type: "text",
              label: "Grau de parentesco",
              name: "relationship",
            },
            { type: "date", label: "Data de nascimento da criança", name: "birth" },
            { type: "text", label: "Região onde você mora", name: "region" },
            {
              type: "checkboxset",
              label: "Deficiências da criança",
              name: "disabilities",
              options: disabilities.map((el) => ({
                option: el.name,
                value: el._id,
              })),
            },
            {
              type: "submit",
              label: "Cadastrar",
              name: "submit",
              onSubmit: handleSubmit,
              disabled: !validated,
            },
          ]}
          onChange={handleChange}
        />
        <ToS/>
        <TextLink
          style={{paddingTop: 0}}
          text={t("Já cadastrado?") + " "}
          link={t("Clique aqui")}
          onPress={handleLogin}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default Register;
