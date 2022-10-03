import React, { useCallback } from 'react'
import Input, {InputProps} from './input'
import {Masks} from 'react-native-mask-input'
import moment from 'moment'

export interface DateInputProps extends Omit<InputProps, "mask" | "onChangeText"> {
  onChangeDate: (date: Date) => void;
}

/** Date masked input */
const DateInput: React.VoidFunctionComponent<DateInputProps> = (props) => {
  const {onChangeDate, ...inputProps} = props;

  const handleOnChangeText = useCallback((text: string) => {
    const date = moment(text, 'DDMMYYYY').toDate();
    onChangeDate(date);
  }, [onChangeDate]);

  return (
    <Input
      {...inputProps}
      onChangeText={handleOnChangeText}
      mask={Masks.DATE_DDMMYYYY}
    ></Input>
  )
}

export default DateInput
