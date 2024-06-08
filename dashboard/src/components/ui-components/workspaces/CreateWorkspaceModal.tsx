import { Box, Button, Input, Modal, Space } from "@mantine/core"
import { useInputState } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import {  TeamSize } from "constants/core"
import React from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { createWorkspace } from "service/CoreService"

type ICreateWorkspaceModal = {
  opened: boolean
  setOpened: (value: boolean) => void
}

const CreateWorkspaceModal = ({ opened, setOpened }: ICreateWorkspaceModal) => {
  const [name, setName] = useInputState("")
  const [legalCompanyName, setLegalCompanyName] = useInputState("")
  const [teamSize, setTeamSize] = useInputState("")
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const createWorkspaceFunc = async () => {
    try {
      if (!name) {
        showNotification({
          title: "Error",
          message: "Please enter a name for the workspace",
        })
        return
      }
      setLoading(true)
      // Hard coding to ["CHAT"] fror now, will have to change when new modules are added
      const res = await createWorkspace({
        workspaceName: name,
        modules: ["CHAT"],
        legalCompanyName,
        teamSize,
        industry: "Default",
      })
      setLoading(false)
      navigate(`/dashboard/${res.workspace.workspaceId}`)
    } catch (error) {
      setLoading(false)
      showNotification({
        title: "Error",
        message: "Please upgrade the plan to create more workspaces.",
      })
      console.log(">>>", error)
    }
  }
  return (
    <Modal
    yOffset="20vh" 
    xOffset={0}
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create a new workspace!"
    >
      <div>
        <Input required onChange={setName} placeholder="Name" />
        <Input required onChange={setLegalCompanyName} placeholder="Legal Company Name" />

        {/* Dropdown to select team size using Controller and react-select */}

        <Select
          onChange={(e) => setTeamSize(e?.value)}
          placeholder="Select Team Size"
          options={TeamSize}
          isSearchable={true}
        />

        <Box mb={20} />

        {/* Dropdown to select industry using Controller and react-select */}

        <Space h={20} />
        <Button
          radius="md"
          loading={loading}
          fullWidth
          color="indigo"
          onClick={createWorkspaceFunc}
        >
          {" "}
          Create{" "}
        </Button>
      </div>
    </Modal>
  )
}

export default CreateWorkspaceModal
