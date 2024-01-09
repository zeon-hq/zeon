import { TextInput,TextInputProps } from '@mantine/core'
import {  RegisterOptions, Controller, Control } from 'react-hook-form'
import React from 'react'
import ErrorMessage from './ErrorMessage'
import { error } from 'console'

/**
 * inspect element to see the class name
 * Go to that component's docs on mantine
 * at the top, there will be a tab called styles api
 * check if the class name is there
 * 
 * ideally it should be there
 * than, check the selector for that class (it is to the left of the class name)
 * make that as key in the styles object
 * start writing the style
 * 
 * if class is not there, then suck thumb
 */

const styles = { 
  // style class .mantine-TextInput-input
  input: {
    border: '1px solid #d5d5d5',
  },
  label: {
    color: '#344054',
    fontSize: '12px',
    fontWeight: 600
  }
}

type Props = {
    formProps: { control: Control<any>,
    name: string,
    rules?: RegisterOptions,
    defaultValue?: string,
    error ?: string | undefined
  },
    

    inputProps: TextInputProps
}

const ZTextInput = (props: Props) => {

    const { formProps, inputProps } = props
    console.log(inputProps)
  return (
    <>
      <Controller
          {...formProps}
          render={({ field }) => (
              <TextInput
                  {...field}
                  {...inputProps}
                  styles={styles} 
                  defaultValue={inputProps.defaultValue}
              />
          )}
      />
      {
        formProps.error && <ErrorMessage message={formProps.error} />
      }
    </>
  )
}

export default ZTextInput