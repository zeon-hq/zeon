import { Button, Flex, Image, Menu, Text } from "@mantine/core";
import workSpaceDropdown from "assets/workSpaceDropdown.svg";
import { MenuList } from "components/details/inbox/inbox.styles";
import useDashboard from "hooks/useDashboard";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import zeonLogo from "assets/zeonLogo.svg";

const TopBarWorkSpaceLeftSelect = ({ workspaceId }: { workspaceId: string }) => {
  const { workspaces } = useDashboard();
  const [open, setOpened] = useState(false);
  const navigate = useNavigate();

  const getDropdownData = () => {
    return workspaces?.map((item: any) => ({
      label: item.workspaceName,
      value: item.workspaceId,
      logo: item.workspaceConfig.logo || `https://ui-avatars.com/api/?name=${item.workspaceName}`
    }));
  };

  const handleChange = (value: string | null) => {
      navigate(`/dashboard/${value}`);
      window.location.reload();    
  };

  const AvatarImage = styled.img`
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;


  return (
      <>
          <Menu position="bottom-start" width={335} shadow="md">
              <Menu.Target>
                  <Button
                      rightIcon={
                          <Image maw={20} radius="md" src={workSpaceDropdown} />
                      }
                      style={{
                          //borderColor: "#D0D5DD",
                          color: "#101828",
                          backgroundColor: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: "14px",
                          paddingLeft: "10px",
                      }}
                  >
                    <Image
              className="pointer"
              width={"25"}
              height={"25"}
              style={{
                marginRight: "10px",
              }}
              mx="auto"
              radius="sm"
              src={
                  getDropdownData().find((data) => data.value === workspaceId)
                      ?.logo || zeonLogo
              }
              alt="Random image"
          />
                      {getDropdownData().find(
                          (data) => data.value === workspaceId
                      )?.label || "loading workspace ..."}
                  </Button>
              </Menu.Target>

              <Menu.Dropdown>
                  <MenuList>
                      <Text
                          color="#344054"
                          fw={500}
                          fz={"sm"}
                          onClick={() => {
                              navigate(`/workspace-creation`);
                          }}
                      >
                          + Create new workspace
                      </Text>
                  </MenuList>
                  {getDropdownData().map((data) => {
                      return (
                          <>
                              <Menu.Item
                                  onClick={() => {
                                      handleChange(data.value);
                                  }}
                              >
                                  <Flex align={"center"}>
                                      <AvatarImage src={data.logo} />
                                      <Text color="#344054" fw={500} fz={"sm"}>
                                          {data.label}
                                      </Text>
                                  </Flex>
                              </Menu.Item>
                          </>
                      );
                  })}
              </Menu.Dropdown>
              <CreateWorkspaceModal opened={open} setOpened={setOpened} />
          </Menu>
      </>
  );
};

export default TopBarWorkSpaceLeftSelect;
