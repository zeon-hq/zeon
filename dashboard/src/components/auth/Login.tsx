import { Box, Flex, Space, Text, TextInput, Image } from "@mantine/core"
import { Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications"
import AuthHero from "assets/login-header.svg"
import { jwtDecode } from "jwt-decode"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { login } from "service/CoreService"
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
import ErrorMessage from "components/ui-components/common/ErrorMessage"

type UserDecodedData = {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const Login = () => {
  const { register, handleSubmit, formState:{errors} } = useForm()
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate();


  const ducalisScript = (token:string) =>{
    const script = document.createElement('script');
    const {email, userId, name}:UserDecodedData = jwtDecode(token);
    script.innerHTML =      `
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
  }


  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const res = await login(data.email, data.password)
      if(res.at){
        setLoading(false)
        ducalisScript(res.at)
        navigate("/workspaces/chat")
      } else {
        setLoading(false)
        showNotification({
          title: "Error",
          message: "Issue while login, contact support",
          color: "red",
        })
      }

    } catch (error: any) {
      setLoading(false)
      showNotification({
        title: "Error",
        message: error ?? error.message ?? "Something went wrong",
        color: "red",
      })
    }
  }

  useEffect(() => {
    // if at is present, redirect to workspaces
    const at = localStorage.getItem("at")
    if (at) {
      navigate("/workspaces/chat")
    }
  }, [])

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            <Image
              maw={100}
              mx="left"
              src="https://framerusercontent.com/images/oZHYGFoJF8rwIgs3MTgCCfA.svg"
              alt="Zeon Logo"
            />
            <Space h={32} />
            <AuthHeading> Welcome back </AuthHeading>
            <AuthSubHeading>
              {" "}
              Please enter your details to continue.{" "}
            </AuthSubHeading>
            <Space h={20} />
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="In Open Beta"
              color="red"
            >
              Zeon is currently in open beta. Expect bugs and missing features.
              Our first stable release is slated for 15 January 2024. We do not
              expect any data loss in the migration from closed beta to v1
              stable release.
            </Alert>
          </AuthFormHeader>

          <TextInput
            {...register("email", { required: "Email is required" })}
            name="email"
            type="email"
            label={<AuthLabel> E-Mail </AuthLabel>}
          />
          {
            errors?.email?.message && <ErrorMessage message={(errors.email?.message as string)} />
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
          <Space h={48} />
          {/* @ts-ignore */}
          <AuthButton
            loading={loading}
            disabled={loading}
            fullWidth
            type="submit"
          >
            {" "}
            Log In{" "}
          </AuthButton>
          <Space h={20} />
          <Flex justify="center">
            <AuthSubHeading> Don't have an account? </AuthSubHeading>
            <Text>
              <Link
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  color: "#3054B9",
                }}
                to={"/signup?returnUrl="}
              >
                <Text> {"\u00A0"}Sign up </Text>
              </Link>
            </Text>
          </Flex>
        </AuthForm>
      </AuthContainer>
      <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box>
    </AuthWrapper>
  );
}

export default Login
