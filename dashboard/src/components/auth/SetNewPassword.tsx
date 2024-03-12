import { Box, Flex, Space, Text, TextInput, Image, Grid } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import AuthHero from "assets/authHero2.png";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  sendForgetPasswordEmail,
  signup,
  updatePassword,
} from "service/CoreService";
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
import { useParams } from "react-router";

const SetNewPassword = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // get token from query params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const res = await updatePassword({
        email,
        token: token,
        password: data.password,
      })
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
    <MainBackground>
      <FormContainer>
        <Space h={32} />
        <Image
          maw={100}
          mx="auto"
          src="https://framerusercontent.com/images/oZHYGFoJF8rwIgs3MTgCCfA.svg"
          alt="Zeon Logo"
        />
        <Space h={16} />
        <AuthContainer>
          <AuthForm onSubmit={handleSubmit(onSubmit)}>
            <AuthFormHeader>
              {/* <img height={"40px"} src={ULogo} /> */}
              <AuthSubHeading
                style={{
                  textAlign: "center",
                }}
              >
                {" "}
                Welcome to Zeon, let's begin!
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
              {...register("password", {
                required: "Password is required",
              })}
              name="password"
              placeholder="Enter your Password"
              label={<AuthLabel> Password </AuthLabel>}
            />
            {errors?.password?.message && (
              <ErrorMessage message={errors.password?.message as string} />
            )}
            {/* @ts-ignore */}
            <AuthButton
              loading={loading}
              disable={!loading}
              fullWidth
              type="submit"
            >
              {" "}
              Update Password{" "}
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

export default SetNewPassword;
