import notification from "components/utils/notification"
import React, { useEffect, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Link, useParams } from "react-router-dom"
import {
  bulkInviteUserToWorkspace,
  getRolesForWorkspace,
} from "service/CoreService"
import Select from "react-select"
import { Box, Button, Flex, Space, TextInput } from "@mantine/core"
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
import AuthHero from "assets/authHero2.png"
import { Plus } from "tabler-icons-react"
import { AiOutlineDelete } from "react-icons/ai"

type Props = {}

const InviteUsers = (props: Props) => {
  // get workspace id from url
  const { workspaceId } = useParams();
  const [roles, setRoles] = useState([])

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      users: [
        {
          email: "",
          role: "",
        },
      ],
    },
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "users", // unique name for your Field Array
    }
  )

  const fetchAllRoles = async () => {
    try {
      if (!workspaceId) return
      const res = await getRolesForWorkspace(workspaceId)
      if (res.roles) {
        const options = res.roles.map((role: any) => ({
          value: role.roleId,
          label: role.name,
        }))

        setRoles(options)
      }
    } catch (error) {
      console.log(error)
      notification("error", "Error fetching roles")
    }
  }

  const onSubmit = async (data: any) => {
    const invites: any[] = []
    data.users.forEach((user: any) => {
      invites.push({
        email: user.email,
        roleId: user.role.value,
        workspaceId: workspaceId,
      })
    })

    try {
      const res = await bulkInviteUserToWorkspace(invites)
      notification("success", "Invites sent successfully!")
    } catch (error) {
      console.log(error)
      notification("error", "Error sending invites")
    }
  }

  useEffect(() => {
    fetchAllRoles()
  }, [])

  return (
    // map through fields to render one email and role input dropdown for each user
    <AuthWrapper>
      <AuthContainer>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader>
            <AuthHeading> Let’s invite the team </AuthHeading>
            <AuthSubHeading>
              {" "}
              Who’s working on your team together with you?{" "}
            </AuthSubHeading>
          </AuthFormHeader>
          <div
            style={{
              maxHeight: "40vh",
              minHeight:"20vh",
              position: "relative",
              zIndex:1,
              overflowY: "auto",
            }}
          >
            {fields.map((item, index) => (
              <div
                style={{
                  marginBottom: "20px",
                  display: "grid",
                  gridTemplateColumns: "40% 40% 20%",
                  gap: "16px",
                  
                }}
                key={item.id}
              >
                <TextInput
                  {...register(`users.${index}.email` as const, {
                    required: true,
                  })}
                  name={`users.${index}.email` as const}
                  type="email"
                  label={<AuthLabel> Email </AuthLabel>}
                />
                <div>
                  <AuthLabel> Role </AuthLabel>
                  <Controller
                    rules={{
                      required: true,
                    }}
                    name={`users.${index}.role` as const}
                    control={control}
                    defaultValue={item.role}
                    render={({ field }) => <Select 
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        height: "40px",
                        padding: "0px 4px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#3054B9",
                      }),
                      option: (provided) => ({
                        ...provided,
                        color: "#3054B9",
                        fontSize: "14px",
                        fontWeight: "500",
                        zIndex: 100000000000000,
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "#3054B9",
                        fontSize: "14px",
                        fontWeight: "500",
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#3054B9",
                        fontSize: "14px",
                        fontWeight: "500",
                      }),
                    }}
                    {...field} options={roles} />}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AiOutlineDelete
                  size="20px"
                    style={{ cursor: "pointer" }}
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <Space h={20} />
          {/* @ts-ignore */}
          <Flex style={{
            cursor: "pointer"
          }} display="inline" align="center">
            <Plus color="#3054B9" size="14px" display="inline" />
            <AuthLabel
              style={{ marginBottom: "0", color: "#3054B9" }}
              onClick={() => append({ email: "", role: "" })}
            >
              Add User
            </AuthLabel>
          </Flex>
          <Space h={20} />

          {/* Create invite */}
          {/* @ts-ignore */}
          <AuthButton fullWidth type="submit">
            Invite
          </AuthButton>
          <Space h={20} />
          <Flex justify="center">
            <AuthSubHeading>
              <Link
                style={{
                  textDecoration: "none",
                  color: "#3054B9",
                  fontWeight: "600",
                }}
                to={"/workspaces"}
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

export default InviteUsers
