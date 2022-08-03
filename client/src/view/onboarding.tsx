import React from 'react'
import OnboardingTemplate from "../component/templates/onboarding"
import onb1 from "../../assets/onboarding/1.png";
import onb2 from "../../assets/onboarding/2.png";
import onb3 from "../../assets/onboarding/3.png";

const Onboarding: React.VoidFunctionComponent = () => {
  return (
    <OnboardingTemplate
      slides={[
        {
          image: onb1,
          imageAlt: "Illustration of a woman with a bulb",
          text: "O Zica App tem o objetivo de auxiliar no desenvolvimento da comunicação de crianças afetas pelo Zica Virus e por outros problemas genéticos ou cogênitos.",
          title: "Olá! :)",
        },
        {
          image: onb2,
          imageAlt: "Illustration of people solving a puzzle.",
          text: "O App possui 3 estágios com diferentes atividades para o responsável realizar com a criança e auxiliá-la no seu desenvolvimento.",
          title: "Como funciona",
        },
        {
          image: onb3,
          imageAlt: "Illustration of a woman with a pencil.",
          text: "Todas as atividades contarão com instruções detalhadas de como realiza-las e ao final você poderá registrar o desempenho da criança.",
          title: "Para começar",
        },
      ]}
      />
  )
}

export default Onboarding