import { Select, Space } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { IWorkspace } from "reducer/slice"


type Props = {
  workspaceId: string;
};

const SelectWorkspaceDropdown = ({ workspaceId }: Props) => {
  const { user,workspaces } = useDashboard();
  const navigate = useNavigate()

  const getDropdownData = () => {
    return workspaces?.map((item: IWorkspace) => ({
      label: item.workspaceName,
      value: item.workspaceId,
    }));
  };

  const handleChange = (value: string | null) => {
    if(value) {
        navigate(`/${value}/chat`)
        window.location.reload()
    } else {
        console.log(">>>", "No value")
    }
  }

  return (
    <>
      <Select
        placeholder="Pick one"
        data={getDropdownData()}
        value={workspaceId}
        onChange={(value) => handleChange(value)}
        radius="md"
      />
      <Space h={10} />
      {/* <Divider/> */}
    </>
  );
};

export default SelectWorkspaceDropdown;