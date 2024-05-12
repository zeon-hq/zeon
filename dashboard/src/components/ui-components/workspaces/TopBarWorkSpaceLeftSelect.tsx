import { Button, Flex, Image, Menu, Text } from "@mantine/core";
import workSpaceDropdown from "assets/workSpaceDropdown.svg";
import { MenuList } from "components/details/inbox/inbox.styles";
import useDashboard from "hooks/useDashboard";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import zeonLogo from "assets/zeonLogo.svg";
import socketInstance from "socket";

interface IDropdownData {
    label: string;
    value: string;
    logo: string
}


const TopBarWorkSpaceLeftSelect = ({ workspaceId }: { workspaceId: string }) => {
    const { workspaces } = useDashboard();
    const [open, setOpened] = useState(false);
    const [dropDownData] = useState<IDropdownData[]>(workspaces?.map((item: any) => ({
        label: item.workspaceName,
        value: item.workspaceId,
        logo: item.workspaceConfig.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.workspaceName}`
    })));

    const navigate = useNavigate();


    const handleChange = (workspaceId: string | null) => {
        socketInstance.emit("join_ticket", {
            workspaceId,
            source: 'dashboard'
        })
        navigate(`/${workspaceId}/chat`);
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
                            src={dropDownData.find((data: IDropdownData) => data.value === workspaceId)?.logo || zeonLogo}
                            alt="Random image"
                        />
                        {dropDownData.find((data: IDropdownData) => data.value === workspaceId)?.label || "loading workspace ..."}
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
                    {dropDownData.map((data: IDropdownData, index: number) => {
                        return (
                            <>
                                <Menu.Item
                                    key={index}
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