import React, { useCallback, useEffect, useState } from "react";
import OnboardingTemplate from "../component/templates/onboarding";
import onb1 from "../../assets/onboarding/1.png";
import onb2 from "../../assets/onboarding/2.png";
import onb3 from "../../assets/onboarding/3.png";
import t from "../pre-start/i18n";
import {
  isOnboardingComplete,
  setOnboardingComplete,
} from "../helper/settings";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";

const Onboarding: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const [first, setFirst] = useState(false);

  const handleFinish = useCallback(async () => {
    await setOnboardingComplete();
    navigation.replace("Main");
  }, [navigation]);

  useEffect(() => {
    isOnboardingComplete().then((completed) => {
      if (completed) navigation.replace("Main");
      else setFirst(true);
    });
  }, [first, navigation]);

  return <OnboardingTemplate
      slides={[
        {
          image: onb1,
          imageAlt: t("Illustration of a woman with a bulb"),
          text: t("Onboarding1"),
          title: t("Hello! :)"),
        },
        {
          image: onb2,
          imageAlt: t("Illustration of people solving a puzzle."),
          text: t("Onboarding2"),
          title: t("How it works"),
        },
        {
          image: onb3,
          imageAlt: t("Illustration of a woman with a pencil."),
          text: t("Onboarding3"),
          title: t("To begin"),
        },
      ]}
      onFinish={handleFinish}
    />
};

export default Onboarding;
