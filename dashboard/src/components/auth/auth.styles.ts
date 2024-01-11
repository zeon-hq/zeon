import { Box, Button } from "@mantine/core"
import styled from "styled-components"
import { device } from "../../util/dashboardUtils"

export const AuthWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 60% 40%;
  height: 100vh;
  padding: 24px;
  padding-top: 64px;
`

export const AuthHeading = styled.p`
  color: var(--gray-900, #101828);
  /* Display sm/Semibold */

  font-size: 30px;
  margin-bottom: 8px;
  font-style: normal;
  font-weight: 600;
  line-height: 38px; /* 126.667% */
`

export const AuthLabel = styled.p`
  color: var(--gray-700, #344054);
  /* Text sm/Medium */

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 6px;
  line-height: 20px; /* 142.857% */
`

export const AuthSubHeading = styled.p`
  color: var(--gray-600, #475467);
  /* Text md/Regular */
  
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`

export const AuthContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AuthForm = styled.form`
  // if device is mobile, then width is 100%
  // if device is tablet or larger, then width is 500px

  @media (${device.mobileL}) {
    width: 100%;
    padding: 0 20px;
  }
  width: 400px;
`

export const AuthFormHeader = styled(Box)`
    margin-bottom: 32px;
`

// accept Button props
export const AuthButton = styled(Button)`
    border-radius: 8px;
    border: 1px solid var(--primary-700, #3054B9);
    background: var(--primary-700, #3054B9);
    /* Shadows/shadow-xs */
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);

`
