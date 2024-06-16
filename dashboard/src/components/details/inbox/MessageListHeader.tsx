import { Box, Flex, Image, Select, Space, Text } from "@mantine/core";
import settingIcon from "assets/settingIcon.svg";
import AIIconImg from "assets/ai_icon.svg";
import { ChronologyName, FilterName, SubFilterName } from "components/types";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import useDashboard from "hooks/useDashboard";
import { showNotification } from "@mantine/notifications";
import {  Switch } from "@mantine/core";
import { updateChannel } from "service/DashboardService";
import {
    ISelectedPage,
    setLoading,
    setSelectedChronology,
    setSelectedFilter,
    setSelectedPage, setSelectedSubFilter, setShowSidebar,
    updateIsAIEnabled
} from "reducer/slice";
import styled from "styled-components";
import TicketSearch from "./TicketSearch";
import SwitchWithLabel from "components/ui-components/SwitchWithLabel";

const Wrapper = styled.div`
    border-bottom: 1px solid #eaecf0;
`

const MainFilterContainer = styled.div`
  width: 100%;
  margin-bottom: 8px;
  padding: 0px 12px;
  display: flex;
  justify-content: space-between;
`;

const LeftFilterContainer = styled.div`
  width: 100%;
`;

const RightFilterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const MessageListHeader = () => {
    const dispatch = useDispatch();
    const { selectedPage, channelsInfo } = useDashboard();
    const handleClick = ({ type, name, channelId }: ISelectedPage) => {
        dispatch(
            setSelectedPage({
                type,
                name,
                channelId,
            })
        );
    };
    const gotoSettingsPage = () => {
        dispatch(setShowSidebar(false));
        const channelId: string | null = localStorage.getItem("zeon-dashboard-channelId");
        dispatch(setLoading(true));
        handleClick({ type: "loading", name: "Loading.." });
        setTimeout(() => {
            handleClick({ type: "channel", name: channelId || "" });
            dispatch(setLoading(false));
        }, 500);
    };

    const onFilterChange = (value: FilterName) => {
        dispatch(setSelectedFilter(value));
    };

    const channelId: string = selectedPage?.channelId as string;
    const currentChannelInfo = channelsInfo[channelId];
    return (
        <Wrapper>
            {" "}
            <div style={{ padding: "0px 12px" }}>
                <Flex justify={"space-between"} align={"center"}>
                    <Box display={'flex'} style={{
                        gap: '12px',
                        width: "50%",
                    }}>
                        <Text
                            style={{
                                border: "1px solid #D0D5DD",
                                borderRadius: "6px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                marginLeft: "0px",
                            }}
                            color="#344054" fw={"500"} fz="12px">
                            {'Inbox'}
                        </Text>
                        <Image
                            style={{ cursor: "pointer" }}
                            maw={20}
                            onClick={gotoSettingsPage}
                            radius="md"
                            src={settingIcon}
                        />
                    </Box>

                    <Box
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "50%",
                        }}>
                            <div style={{
                                display: "flex",
                                gap: "8px",
                            }}>
                        <Text
                            style={{
                                border: "1px solid #D0D5DD",
                                borderRadius: "6px",
                                paddingLeft: "8px",
                                color:'#344054',
                                fontSize:'12px',
                                fontWeight:'500',
                                paddingRight: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                height: "24px",
                                // marginLeft: "0px",
                            }}
                            color="#344054" fw={"500"} fz="12px">
                                  <Image
                            style={{ cursor: "pointer" }}
                            maw={13}
                            onClick={gotoSettingsPage}
                            radius="md"
                            src={AIIconImg }
                        />
                            {'AI Chat Agent'}
                        </Text>

                        <Switch
            checked={!!currentChannelInfo?.isAIEnabled}
            onClick={async (e:any) => {
                const aiEnablePayload = { isAIEnabled: e.target.checked };

                const updateNotificatonMessage = await updateChannel(channelId, { ...currentChannelInfo, ...aiEnablePayload });
                await dispatch(updateIsAIEnabled({ ...aiEnablePayload, channelId }));
                if (updateNotificatonMessage?.status !== 200) {
                    showNotification({
                        title: "Notification",
                        message: "Something went wrong",
                        color: "red"
                    });
                }
            }}
            color="indigo"
          />
                        </div>
                    </Box>
                </Flex>
            </div>
            <Space h="xs" />
            <TicketSearch />
            <MainFilterContainer>
                <LeftFilterContainer>
                    <Select
                        defaultValue={FilterName.SHOW_ALL}
                        rightSection={<MdKeyboardArrowDown />}
                        size="xs"
                        clearable={false}
                        allowDeselect={false}
                        variant="unstyled"
                        sx={{
                            paddingRight: "8px",
                        }}
                        placeholder="Select"
                        data={[
                            {
                                label: "All Tickets",
                                value: FilterName.SHOW_ALL,
                            },
                            {
                                label: "Open Tickets",
                                value: FilterName.SHOW_OPENED,
                            },
                            {
                                label: "Closed Tickets",
                                value: FilterName.SHOW_CLOSED,
                            },
                        ]}
                        onChange={(value) => onFilterChange(value as FilterName)}
                    />
                </LeftFilterContainer>
                <LeftFilterContainer>
                    <Select
                        defaultValue={SubFilterName.SHOW_ALL}
                        rightSection={<MdKeyboardArrowDown />}
                        size="xs"
                        // radius={'50px'}
                        color="red"
                        clearable={false}
                        allowDeselect={false}
                        variant="unstyled"
                        placeholder="Select"
                        data={[
                            {
                                label: "Team",
                                value: SubFilterName.SHOW_ALL,
                            },
                            {
                                label: "Unassigned",
                                value: SubFilterName.SHOW_UNASSIGNED,
                            },
                            {
                                label: "Assigned to Me",
                                value: SubFilterName.SHOW_ASSIGNED,
                            },
                        ]}
                        onChange={(value: any) => {
                            dispatch(setSelectedSubFilter(value));
                        }}
                    />
                </LeftFilterContainer>

                <RightFilterContainer>
                    <Select
                        defaultValue={ChronologyName.RECENT}
                        size="xs"
                        clearable={false}
                        allowDeselect={false}
                        variant="unstyled"
                        sx={{
                            paddingLeft: "8px",
                        }}
                        rightSection={<MdKeyboardArrowDown />}
                        placeholder="Select"
                        data={[
                            {
                                label: ChronologyName.RECENT,
                                value: ChronologyName.RECENT,
                            },
                            {
                                label: ChronologyName.OLDEST,
                                value: ChronologyName.OLDEST,
                            },
                        ]}
                        onChange={(value: ChronologyName) => {
                            dispatch(setSelectedChronology(value));
                        }}
                    />
                </RightFilterContainer>
            </MainFilterContainer>
        </Wrapper>
    );
}