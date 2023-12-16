import { Box, Button, Flex, TextInput, Text, Space } from "@mantine/core"
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  AuthHeading,
  AuthLabel,
  AuthSubHeading,
  AuthWrapper,
} from "components/auth/auth.styles"
import notification from "components/utils/notification"
import { TeamSize, Industries } from "constants/core"
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router"
import Select from "react-select"
import { createWorkspace } from "service/CoreService"
import AuthHero from "assets/authHero2.png"
import { Link } from "react-router-dom"

type Props = {}

const WorkspaceCreation = (props: Props) => {
  const { register, handleSubmit, control } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const res = await createWorkspace({
        workspaceName: data.name,
        modules: ["CHAT"],
        legalCompanyName: data.legalCompanyName,
        teamSize: data.teamSize.value,
        industry: data.industry.value,
      })
      setLoading(false)
      notification("success", "Workspace created successfully!")
      navigate(`/workspace/${res.workspace.workspaceId}/invite-user`)
    } catch (error: any) {
      setLoading(false)
      console.log(error)
      notification("error", error)
    }
  }

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            <AuthHeading>Let's setup your workspace</AuthHeading>
            <AuthSubHeading>
              {" "}
              This helps us to personalise your experience{" "}
            </AuthSubHeading>
          </AuthFormHeader>
          <TextInput
            {...register("name", { required: true })}
            name="name"
            mb={20}
            type="text"
            label={<AuthLabel> Workspace Name </AuthLabel>}
          />

          <TextInput
            {...register("legalCompanyName", { required: true })}
            name="legalCompanyName"
            mb={20}
            type="text"
            label={<AuthLabel> Legal Company Name </AuthLabel>}
          />

          <AuthLabel> Team Size </AuthLabel>

          {/* Dropdown to select team size using Controller and react-select */}
          <Controller
            name="teamSize"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Team Size"
                options={TeamSize}
                isSearchable={true}
              />
            )}
          />
          <Box mb={20} />

          <AuthLabel> Industry </AuthLabel>

          {/* Dropdown to select industry using Controller and react-select */}
          <Controller
            name="industry"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Industry"
                options={Industries}
              />
            )}
          />
          <Box mb={20} />
          {/* @ts-ignore */}
          <AuthButton loading={loading} disable={loading} fullWidth type="submit">Continue</AuthButton>
          <Space h={20} />
          <Flex justify="center">
            <AuthSubHeading>
              <Link
                style={{
                  textDecoration: "none",
                  color: "#3054B9",
                  fontWeight: "600",
                }}
                to={"/workspaces/chat"}
              >
                <p> Skip and go to workspace selection </p>
              </Link>
            </AuthSubHeading>
          </Flex>
        </AuthForm>
      </AuthContainer>
      <Box>
        <img style={{ height: "100%", width: "100%" }} src={AuthHero} />
      </Box>
    </AuthWrapper>
  )
}

export default WorkspaceCreation
