import { Box, Flex, Space, Text, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import AuthHero from "assets/authHero2.png"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import PhoneInput, { CountryData } from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { signup } from "service/CoreService"
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthHeading,
  AuthLabel,
  AuthSubHeading,
  AuthWrapper,
} from "./auth.styles"



const Signup = () => {
  const { register, handleSubmit, control } = useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const phoneNumber: any = {
        //@ts-ignore
        countryCode: phoneData?.dialCode,
        num: data.phone,
      }
      const res = await signup(
        data.name,
        data.email,
        data.password,
        phoneNumber
      ).then((res) => {
        setLoading(false)
        navigate("/workspace-creation")
      }).catch((err) => {
        console.log(err)
        setLoading(false)
        showNotification({
          title: "Error",
          message: err,
          color: "red",
        })
      })
      
      
    } catch (error: any) {
      console.log(error)
      setLoading(false)
      showNotification({
        title: "Error",
        message: error,
        color: "red",
      })
    }
  }

  useEffect(() => {
    // if at is present, redirect to workspaces
    const at = localStorage.getItem("at")
    if (at) {
      navigate("/workspaces")
    }
  }, [])

  const [phoneData, setPhoneData] = useState<CountryData | {}>({})

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            {/* <img height={"40px"} src={ULogo} /> */}

            <AuthHeading> Sign up </AuthHeading>
            <AuthSubHeading> Welcome to Zeon, let's begin!</AuthSubHeading>
          </AuthFormHeader>

          <TextInput
            {...register("name", { required: true })}
            name="name"
            mb={20}
            type="text"
            label={<AuthLabel> Name </AuthLabel>}
          />

          <TextInput
            {...register("email", { required: true })}
            name="email"
            mb={20}
            type="email"
            label={<AuthLabel> Email </AuthLabel>}
          />
          {/* Wrap PhoneInput inside react hook forms controller */}

          <AuthLabel> Phone </AuthLabel>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: true,
            }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                inputStyle={{
                  width: "100%",
                }}
                country={"in"}
                value={value}
                onChange={(value, data) => {
                  setPhoneData(data)
                  onChange(value)
                }}
              />
            )}
          />

          <Space h={20} />

          <TextInput
            {...register("password", { required: true })}
            name="password"
            mb={20}
            label={<AuthLabel> Password </AuthLabel>}
            type="password"
          />

          <TextInput
            {...register("confirmPassword", { required: true })}
            name="confirmPassword"
            mb={20}
            label={<AuthLabel> Confirm Password </AuthLabel>}
            type="password"
          />
          {/* @ts-ignore */}
          <AuthButton loading={loading} disable={!loading}  fullWidth type="submit"> Get Started </AuthButton>
          <Space h={20} />

          <Flex justify="center">
            {/* add space at the end */}
            <AuthSubHeading> Already have an account?  </AuthSubHeading>
            <Text>
              <Link
                style={{
                  textDecoration: "none",
                  color:"#3054B9",
                  fontWeight:"600"
                }}
                to={"/login"}
              >
                <p> {"\u00A0"}Log in{" "}  </p>
              </Link>
            </Text>
          </Flex>
        </AuthForm>
      </AuthContainer>
      <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box>
    </AuthWrapper>
  )
}

export default Signup
