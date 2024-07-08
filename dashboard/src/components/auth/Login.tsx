import { Box, Flex, Space, Text, TextInput, Image } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { login } from "service/CoreService";
import { TbUserPlus } from "react-icons/tb";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader, AuthLabel,
  AuthSecondaryButton,
  AuthSubHeading,
  AuthWrapper, FormContainer,
  MainBackground
} from "./auth.styles";
import ErrorMessage from "components/ui-components/common/ErrorMessage";
import { AiOutlineArrowRight } from "react-icons/ai";

type UserDecodedData = {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const ducalisScript = (token: string) => {
    const script = document.createElement("script");
    const { email, userId, name }: UserDecodedData = jwtDecode(token);
    script.innerHTML = `
    !(function (b, c, f, d, a, e) {
        b.dclsPxl ||
            ((((d = b.dclsPxl =
                function () {
                    d.callMethod
                        ? d.callMethod.apply(d, arguments)
                        : d.queue.push(arguments);
                }).push = d).queue = []),
            ((a = c.createElement("script")).async = !0),
            (a.src = f),
            (e = c.getElementsByTagName("script")[0]).parentNode.insertBefore(
                a,
                e
            ));
    })(window, document, "https://ducalis.io/js/widget.js");
    dclsPxl("initWidget", {
        appId: "e760d0ac71ed98e637dc9b3e2c69bedf5441be54", // Required
        boardId: "e030a925513f5f875977c3ee49894126", // Required
        user: {
            // required
            email: "${email}",
            hash: "${token}",
            // optional
            userID: "${userId}",
            name: "${name}",
            avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}",
        },
    });`;

    // Append the script to the document
    document.body.appendChild(script);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await login(data.email, data.password);
      if (res.at) {
        setLoading(false);
        ducalisScript(res.at);
        navigate("/workspaces/chat");
      } else {
        setLoading(false);
        showNotification({
          title: "Error",
          message: "Issue while login, contact support",
          color: "red",
        });
      }
    } catch (error: any) {
      setLoading(false);
      showNotification({
        title: "Error",
        message: error ?? error.message ?? "Something went wrong",
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
  }, [navigate]);

  return (
    <MainBackground>
      <FormContainer>
        <AuthWrapper>
          <AuthContainer>
            <AuthForm onSubmit={handleSubmit(onSubmit)}>
              <AuthFormHeader>
                <Image
                  maw={150}
                  mx="left"
                  src="https://www.zeonhq.com/appupdates"
                  alt="Zeon Logo"
                />
                <Space h={8} />
                <AuthSubHeading>
                  {" "}
                  Welcome back! Please enter your details to continue.{" "}
                </AuthSubHeading>
                <Space h={8} />
              </AuthFormHeader>

              <TextInput
                {...register("email", { required: "Email is required" })}
                name="email"
                type="email"
                label={<AuthLabel> E-Mail </AuthLabel>}
                px={11}
              />
              {errors?.email?.message && (
                <ErrorMessage message={errors.email?.message as string} />
              )}
              <Space h={20} />
              <TextInput
                {...register("password", { required: "Password is required" })}
                name="password"
                label={<AuthLabel> Password </AuthLabel>}
                type="password"
                px={11}
              />
              {errors?.password?.message && (
                <ErrorMessage message={errors.password?.message as string} />
              )}
              <Space h={48} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  padding: "0 11px",
                }}
              >
                {/* @ts-ignore */}
                <AuthSecondaryButton
                  type="button"
                  leftIcon={<TbUserPlus size="1.2rem" />}
                  loading={loading}
                  disabled={loading}
                  onClick={() => navigate("/signup?returnUrl=")}
                >
                  {" "}
                  Sign up{" "}
                </AuthSecondaryButton>
                {/* @ts-ignore */}
                <AuthButton
                  rightIcon={<AiOutlineArrowRight />}
                  loading={loading}
                  disabled={loading}
                  type="submit"
                >
                  {" "}
                  Sign in{" "}
                </AuthButton>
              </Box>
              <Space h={20} />
              <Flex justify="center">
                <Text>
                  <Link
                    style={{
                      textDecoration: "none",
                      fontWeight: "600",
                      color: "#3054B9",
                    }}
                    to={"/forgot-password"}
                  >
                    <Text> {"\u00A0"} Forgot Password? </Text>
                  </Link>
                </Text>
              </Flex>
            </AuthForm>
          </AuthContainer>
          <Box>
            <iframe
              src="https://forum.zeonhq.com/c/product-updates/5"
              height={"100%"}
              width={600}
              title="Changelog"
            ></iframe>
          </Box>
        </AuthWrapper>
      </FormContainer>
    </MainBackground>
  );
};

export default Login;
