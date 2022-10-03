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

const isLongerThanTwo = (txt: string) => txt.length > 2;

const validators = {
  email: isEmail,
  password: isPassword,
  confirm: isPassword,
  guardian: isLongerThanTwo,
  relationship: isLongerThanTwo,
  birth: (date: Date) => true,
  comorbidity: (arr: string[]) => arr.length > 0,
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
        comorbidity: map.get("comorbidity"),
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
            { type: "text", label: t("Email"), name: "email" },
            { type: "password", label: t("Password"), name: "password" },
            { type: "password", label: t("Confirm password"), name: "confirm" },
            {
              type: "text",
              label: t("Parent or guardian name"),
              name: "guardian",
            },
            {
              type: "text",
              label: t("Relationship level"),
              name: "relationship",
            },
            { type: "date", label: t("Child's date of birth"), name: "birth" },
            { type: "text", label: t("Region you live"), name: "region" },
            {
              type: "checkboxset",
              label: t("Child's comorbidity level"),
              name: "comorbidity",
              options: disabilities.map((el) => ({
                option: el.name,
                value: el._id,
              })),
            },
            {
              type: "submit",
              label: t("Login"),
              name: "submit",
              onSubmit: handleSubmit,
              disabled: !validated,
            },
          ]}
          onChange={handleChange}
        />
        <TextLink
          text={t("Already registered?") + " "}
          link={t("Click here")}
          onPress={handleLogin}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default Register;
