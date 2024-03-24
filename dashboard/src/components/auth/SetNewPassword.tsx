import { Space, TextInput, Image } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router";

import {
  updatePassword,
} from "service/CoreService";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthLabel,
  AuthSubHeading,
  FormContainer,
  MainBackground,
} from "./auth.styles";
import ErrorMessage from "components/ui-components/common/ErrorMessage";


const SetNewPassword = () => {
  const {
    register,
    handleSubmit,
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

      await updatePassword({
        email,
        token: token,
        password: data.password,
      })
        .then(() => {
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
  }, []); // eslint-disable-line

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
