import { Box, Flex, Space, Text, TextInput, Image } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import AuthHero from "assets/authHero2.png";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { signup } from "service/CoreService";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthHeading,
  AuthLabel,
  AuthSubHeading,
  AuthWrapper,
} from "./auth.styles";
import ErrorMessage from "components/ui-components/common/ErrorMessage"

const Signup = () => {
  const { register, handleSubmit, control, formState:{errors} } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const phoneNumber: any = {
        //@ts-ignore
        countryCode: phoneData?.dialCode,
        num: data.phone,
      };
      const res = await signup(
        data.name,
        data.email,
        data.password,
        phoneNumber
      )
        .then((res) => {
          setLoading(false);
          navigate("/workspace-creation");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          showNotification({
            title: "Error",
            message: err,
            color: "red",
          });
        });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      showNotification({
        title: "Error",
        message: error,
        color: "red",
      });
    }
  };

  useEffect(() => {
    // if at is present, redirect to workspaces
    const at = localStorage.getItem("at");
    if (at) {
      navigate("/workspaces/chat");
    }
  }, []);

  const [phoneData, setPhoneData] = useState<CountryData | {}>({});

  return (
    <div>
      <Space h={64} />
      <Image
        maw={100}
        mx="auto"
        src="https://framerusercontent.com/images/oZHYGFoJF8rwIgs3MTgCCfA.svg"
        alt="Zeon Logo"
      />
      <Space h={32} />
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            {/* <img height={"40px"} src={ULogo} /> */}

            <AuthHeading> Sign up </AuthHeading>
            <AuthSubHeading> Welcome to Zeon, let's begin!</AuthSubHeading>
          </AuthFormHeader>

          <TextInput
            {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name should be atleast 3 characters long" } })}
            name="name"
            
            type="text"
            label={<AuthLabel> Name </AuthLabel>}
          />
          {
            errors?.name?.message && <ErrorMessage message={(errors.name?.message as string)} />
          }
          <Space h={20} />
          <TextInput
            {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Please enter a valid email" } })}
            name="email"
            
            type="email"
            label={<AuthLabel> Email </AuthLabel>}
          />
          {
            errors?.email?.message && <ErrorMessage message={(errors.email?.message as string)} />
          }
          {/* Wrap PhoneInput inside react hook forms controller */}
          <Space h={20} />
          <AuthLabel> Phone  </AuthLabel>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "Phone number is required",
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
                  setPhoneData(data);
                  onChange(value);
                }}
              />
            )}
          />
          {
            errors?.phone?.message && <ErrorMessage message={(errors.phone?.message as string)} />
          }
          <Space h={20} />

          <TextInput
            {...register("password", { required: "Password is required" })}
            name="password"
            
            label={<AuthLabel> Password </AuthLabel>}
            type="password"
          />
          {
            errors?.password?.message && <ErrorMessage message={(errors.password?.message as string)} />
          }
          <Space h={20} />
          <TextInput
            {...register("confirmPassword", { required: "This should be same as password" })}
            name="confirmPassword"
            
            label={<AuthLabel> Confirm Password </AuthLabel>}
            type="password"
          />
          {
            errors?.confirmPassword?.message && <ErrorMessage message={(errors.confirmPassword?.message as string)} />
          }
          <Space h={20} />
          {/* @ts-ignore */}
          <AuthButton
            loading={loading}
            disable={!loading}
            fullWidth
            type="submit"
          >
            {" "}
            Get Started{" "}
          </AuthButton>
          <Space h={20} />

          <Flex justify="center">
            {/* add space at the end */}
            <AuthSubHeading> Already have an account? </AuthSubHeading>
            <Text>
              <Link
                style={{
                  textDecoration: "none",
                  color: "#3054B9",
                  fontWeight: "600",
                }}
                to={"/login"}
              >
                <p> {"\u00A0"}Log in </p>
              </Link>
            </Text>
          </Flex>
        </AuthForm>
      </AuthContainer>
      {/* <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box> */}
    </div>
  );
};

export default Signup;
