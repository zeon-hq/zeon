import { Flex, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router";
import { sendForgetPasswordEmail } from "service/CoreService";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthHeading,
  AuthSubHeading,
  FormContainer,
  MainBackground,
} from "./auth.styles";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CheckEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    // if at is present, redirect to workspaces
    const at = localStorage.getItem("at");
    if (at) {
      navigate("/workspaces/chat");
    }
  }, []); // eslint-disable-line

  const onSubmit = async () => {
    try {
      setLoading(true);

      await sendForgetPasswordEmail(email)
        .then(() => {
          setLoading(false);
          //   navigate(`/reset-password?email=${data.email}&token=${res.token}`);
          showNotification({
            title: "Success",
            message: "Email sent successfully",
            color: "green",
          });
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
        <Flex align="center" justify="center">
          <MdOutlineMail style={{ fontSize: "50px", color: "#000" }} />
        </Flex>
        <Space h={16} />
        <AuthContainer>
          <AuthForm>
            <AuthFormHeader>
              {/* <img height={"40px"} src={ULogo} /> */}
              <AuthHeading
                style={{
                  textAlign: "center",
                }}
              >
                {" "}
                Check your Email
              </AuthHeading>
              <AuthSubHeading
                style={{
                  textAlign: "center",
                }}
              >
                We have sent a link to your email to reset your password
              </AuthSubHeading>
            </AuthFormHeader>

            {/* <TextInput
            {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name should be atleast 3 characters long" } })}
            name="name"
            
            type="text"
            label={<AuthLabel> Name </AuthLabel>}
          /> */}
            {/* Split name into first name and last name */}

            {/* @ts-ignore */}
            <AuthButton
              onClick={() => (window.location.href = "mailto:")}
              loading={loading}
              disable={!loading}
              fullWidth
            >
              Open Email app
            </AuthButton>
            <Space h={16} />
          </AuthForm>
        </AuthContainer>
        <Space h={32} />
        <Flex justify="center">
          {/* add space at the end */}
          <AuthSubHeading
            style={{
              fontSize: "14px",
            }}
          >
            {" "}
            Didn’t receive the email?{" "}
          </AuthSubHeading>
          <Text
            style={{
              textDecoration: "none",
              color: "#3054B9",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              onSubmit();
            }}
          >
            <p> {"\u00A0"}Click to Resend </p>
          </Text>
        </Flex>
      </FormContainer>
      {/* <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box> */}
    </MainBackground>
  );
};

export default CheckEmail;
