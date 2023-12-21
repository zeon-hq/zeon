import React from 'react'
import styled from 'styled-components'

const ErrorText = styled.div`
    color: red;
    font-size: 12px;
    margin-top: 5px;

`    

type Props = {
    message: string
}

const ErrorMessage = ({message}: Props) => {
  return (
    <ErrorText>
      {message}
    </ErrorText>
  )
}

export default ErrorMessage