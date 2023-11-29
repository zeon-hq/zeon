import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  Text
} from "@mantine/core";
import AccountSelect from "components/ui-components/AccountSelect";
import AccountTextInput from "components/ui-components/AccountTextInput";
import ReadDocsButton from "components/ui-components/Button/ReadDocsButton";
import notification from "components/utils/notification";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bulkInviteUserToWorkspace, getRolesForWorkspace } from "service/CoreService";
import { showNotification } from "@mantine/notifications";

interface IAddUserModal {
  openModal: boolean;
  onClose: () => void;
}

const AddUserModal = ({ openModal, onClose }: IAddUserModal) => {
  const [email, setEmail] = useState<string>('');
  const [roleId, setRoleId] = useState<string>();
  const [workspaceRoles, setWorkspaceRoles] = useState([]);
  const { workspaceId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchAllRoles = async () => {
    try {
      if (!workspaceId) return
      const res = await getRolesForWorkspace(workspaceId)
      if (res.roles) {
        const options = res.roles.map((role: any) => ({
          value: role.roleId,
          label: role.name,
        }))

        setWorkspaceRoles(options)
      }
    } catch (error) {
      console.log(error)
      notification("error", "Error fetching roles")
    }
  }

  const addUser = async () => {
    if (isEmpty(email) || isEmpty(roleId) || isEmpty(workspaceId)) {
      showNotification({
        title: "error",
        message: "Fill all the fields",
      })
      return
    }

    if(!(/^[^@]+@\w+(\.\w+)+\w$/.test(email))) {
      showNotification({
        title: "error",
        message: "Invalid email",
      })
      return
    }


    const invites: any[] = [{
      email,
      roleId,
      workspaceId,
    }]
    
    try {
      setIsLoading(true);
      const res = await bulkInviteUserToWorkspace(invites)
      setIsLoading(false);
      if (res.status == 200) {
        setEmail('');
        setRoleId('');
        onClose();
        notification("success", "Invites sent successfully!")
      } else {
        notification("error", "Error while inviting user, please contact support team!")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      notification("error", "Error sending invites")
    }
  }

  useEffect(() => {
    fetchAllRoles()
  }, [])

  return (
    <Modal
      size={"40%"}
      yOffset="20vh" 
      xOffset={0}
      title="Add a User"
      opened={openModal}
      onClose={() => {
        onClose();
      }}
    >
      <Text>
        Add users to your workspace to help you manage chat and configuration
      </Text>
      <Box>
        <AccountTextInput
          placeHolder="Enter User E-Mail here"
          value={email}
          type="email"
          label="E-Mail"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        <Divider mt={"16px"} label="Modules" />
        <Checkbox
          mt={"16px"}
          defaultChecked
          disabled
          description="Communications & Ticketing"
          label="Chat"
        />

        <AccountSelect
          label="Permissions"
          value=""
          onChange={(value) => {
            setRoleId(value);
          }}
          dropdownData={workspaceRoles}
        />
      </Box>
      <Flex justify={"space-between"} mt={"32px"}>
        <div className="">
          <ReadDocsButton />
        </div>

        <Flex gap={"12px"}>
     
          <Button
           disabled={isEmpty(email) || isEmpty(roleId)}
        loading={isLoading}
          radius="md" color="indigo" onClick={async () => {
            await addUser();
          }}>
            Add User
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default AddUserModal;
