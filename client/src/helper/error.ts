const ErrorMessages: {
  [key: string]: {
    title: string,
    description: string
  }
} = {
  InvalidCredentials: {
    title: "Credeciais inválidas! :(",
    description: "A combinação de e-mail e senha informada é inválida.",
  },
  InvalidToken: {
    title: "Código inválido!",
    description: "O código informado é inválido",
  },
  EmailNotFound: {
    title: "Erro!",
    description: "O email não pode ser enviado, verifique se o email digitado está correto."
  }
};


export type ErrorNames = keyof typeof ErrorMessages;
export default ErrorMessages;
