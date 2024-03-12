import { Box, Flex, Space, Text, TextInput, Image, Grid } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import AuthHero from "assets/authHero2.png";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { sendForgetPasswordEmail, signup } from "service/CoreService";
import SectionImg from "assets/Section.png";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthHeading,
  AuthLabel,
  AuthSubHeading,
  AuthWrapper,
  FormContainer,
  MainBackground,
} from "./auth.styles";
import ErrorMessage from "components/ui-components/common/ErrorMessage";
import { LiaKeySolid } from "react-icons/lia";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { da } from "date-fns/locale";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const res = await sendForgetPasswordEmail(data.email)
        .then((res) => {
          setLoading(false);
          navigate(`/check-email?email=${data.email}`);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          showNotification({
            title: "Error",
            message: "Something went wrong. Check if the email is correct and there is an account with this email.",
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
    <MainBackground>
      <FormContainer>
        <Space h={16} />
        <AuthSubHeading
          style={{
            textAlign: "center",
            fontWeight: 600,
            display: "flex", // Add this line
            alignItems: "center", // Add this line
            justifyContent: "center", // Add this line
            gap: "8px", // Add this line
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          <AiOutlineArrowLeft style={{ fontSize: "16px", color: "#000" }} />{" "}
          Back to Login
        </AuthSubHeading>
        <Space h={16} />
        <Flex justify="center" align="center">
          <LiaKeySolid style={{ fontSize: "50px", color: "#000" }} />
        </Flex>
        <Space h={16} />
        <AuthContainer>
          <AuthForm onSubmit={handleSubmit(onSubmit)}>
            <AuthFormHeader>
              {/* <img height={"40px"} src={ULogo} /> */}
              <AuthHeading
                style={{
                  textAlign: "center",
                }}
              >
                {" "}
                Forgot Password?{" "}
              </AuthHeading>
              <AuthSubHeading
                style={{
                  textAlign: "center",
                }}
              >
                {" "}
                No worries, we’ll send you reset instructions.
              </AuthSubHeading>
            </AuthFormHeader>

            {/* <TextInput
            {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name should be atleast 3 characters long" } })}
            name="name"
            
            type="text"
            label={<AuthLabel> Name </AuthLabel>}
          /> */}
            {/* Split name into first name and last name */}
            <TextInput
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              })}
              name="email"
              placeholder="Enter your email address"
              type="email"
              label={<AuthLabel> Email </AuthLabel>}
            />
            {errors?.email?.message && (
              <ErrorMessage message={errors.email?.message as string} />
            )}
            <Space h={16} />
            {/* @ts-ignore */}
            <AuthButton
              loading={loading}
              disable={!loading}
              fullWidth
              type="submit"
            >
              {" "}
              Reset Password{" "}
            </AuthButton>
            <Space h={16} />
          </AuthForm>
        </AuthContainer>
        <Space h={32} />
      </FormContainer>
      {/* <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box> */}
    </MainBackground>
  );
};

export default ForgetPassword;
