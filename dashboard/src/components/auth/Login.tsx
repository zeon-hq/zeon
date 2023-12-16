import { Box, Flex, Space, Text, TextInput } from "@mantine/core"
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

type UserDecodedData = {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const Login = () => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    try {
      console.log(data)
      setLoading(true)
      const res = login(data.email, data.password).then((res) => {
        setLoading(false)

        const script = document.createElement('script');
        const decoded:UserDecodedData = jwtDecode(res.at);
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
                email: "${decoded.email}",
                hash: "${res.at}",
                // optional
                userID: "${decoded.userId}",
                name: "${decoded.name}",
                avatar: "https://ui-avatars.com/api/?name=${decoded.name}",
            },
        });`;

        

      // Append the script to the document
      document.body.appendChild(script);




        if(res.at)
        navigate("/workspaces/chat")

      }).catch((err) => {
        setLoading(false)
        console.log(err)
        showNotification({
          title: "Authentication Error. Password or Email is incorrect",
          message: err,
          color: "red",
        })
      })
    } catch (error: any) {
      setLoading(false)
      console.log(error)
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
      navigate("/workspaces/chat")
    }
  }, [])

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            <AuthHeading> Log In </AuthHeading>
            <AuthSubHeading>
              {" "}
              Welcome back! Please enter your details to continue.{" "}
            </AuthSubHeading>
          </AuthFormHeader>

          <TextInput
            {...register("email", { required: true })}
            name="email"
            mb={20}
            type="email"
            label={<AuthLabel> E-Mail </AuthLabel>}
          />
          <TextInput
            {...register("password", { required: true })}
            name="password"
            mb={48}
            label={<AuthLabel> Password </AuthLabel>}
            type="password"
          />
          {/* @ts-ignore */}
          <AuthButton loading={loading} disabled={loading} fullWidth type="submit">
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
  )
}

export default Login
