import { Box, Button } from "@mantine/core"
import styled from "styled-components"
import { device } from "../../util/dashboardUtils"

export const Container = styled(Box)`
  display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 100vh;
`

export const AuthWrapper = styled(Box)`
  display: grid;
    grid-template-columns: 60% 40%;
    width: 1000px;
    height: 500px;
    gap: 20px;
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

export const MainBackground = styled(Box)`
  background-image: url('https://zeonhq.b-cdn.net/BG.svg');
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FormContainer = styled(Box)`
  background: white;
  padding: 16px 48px;
  border-radius: 8px;
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

export const AuthSecondaryButton = styled(AuthButton)`
  background: #fff;
  border: 1px solid var(--gray-300, #D0D5DD);
  color: #344054;

  // on hover, change background to var(--gray-100, #F0F2F7)
  &:hover {
    background: var(--gray-100, #F0F2F7)
  }

`
