import React from 'react'
import Input, {InputProps} from './input'

export interface PasswordInputProps extends InputProps {}

/** Input width hidden content */
const PasswordInput: React.VoidFunctionComponent<InputProps> = (props) => {
  return (
    <Input {...props} secureTextEntry={props.secureTextEntry || true} />
  )
}

export default PasswordInput