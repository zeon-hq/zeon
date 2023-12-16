import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Space,
  TextInput,
  Textarea,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import ProfileSave from "assets/profile_save.png";
import Heading from "components/details/inbox/component/Heading";
import { Label } from "components/ui-components";
import SwitchWithLabel from "components/ui-components/SwitchWithLabel";
import useDashboard from "hooks/useDashboard";
import moment from "moment-timezone";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  IUpdateDashboardAction,
  setLoading,
  updateDashboardSetting,
} from "reducer/slice";
import { updateChannel } from "service/DashboardService";
import styled from "styled-components";
import { inputWrapperData } from "util/Constant";
import { InfoContainer } from "../tabInfo.styles";

export const MainDiv = styled.div`
  width: 100%;
`;

const TetInputLabel = styled(Label)`
  margin-top: 16px;

  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;
export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  overflow: none;
`;
const Behavior = () => {
  const { channelsInfo, selectedPage } = useDashboard();
  const dispatch = useDispatch();
  const behaviourDetails = channelsInfo[selectedPage.name]?.behavior;

  const handleChange = ({
    subType,
    type,
    value,
    key,
  }: IUpdateDashboardAction) => {
    dispatch(
      updateDashboardSetting({
        type: "behavior",
        subType,
        value,
        key,
      })
    );
  };

  const handleSave = async () => {
    try {
      dispatch(setLoading(true));
      await updateChannel(
        channelsInfo[selectedPage.name].channelId,
        channelsInfo[selectedPage.name]
      );
      showNotification({
        title: "Notification",
        message: "Saved Successfully",
      });
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <Heading
        showDivider
        heading={"Behaviour"}
        subheading="Configure what happens when users visit your website or open Zeon"
      />
      <Wrapper>
        <InfoContainer>
          <MainDiv>
            <Box mb={24} fw={500}>
              <SwitchWithLabel
                onClick={(e) => {
                  handleChange({
                    subType: "widgetBehavior",
                    type: "behavior",
                    value: e.currentTarget.checked,
                    key: "collectUserEmail",
                  });
                }}
                value={
                  behaviourDetails.widgetBehavior.collectUserEmail || false
                }
                heading="Collect User E-Mail"
                description="E-Mail will be collect before a conversation is created."
              />

              <Label text={"E-Mail Input Label"} />
              <Grid>
                <Grid.Col>
                  <TextInput
                    // disabled={true}
                    value={behaviourDetails.widgetBehavior.emailTitle}
                    placeholder={"Enter your E-Mail Label"}
                    description={"Ideally Short (2-3 Words)"}
                    radius={"8px"}
                    inputWrapperOrder={inputWrapperData}
                    onChange={(e) =>
                      handleChange({
                        subType: "widgetBehavior",
                        type: "behavior",
                        value: e.target.value,
                        key: "emailTitle",
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <TetInputLabel text={"E-Mail Input Placeholder"} />
              <Grid>
                <Grid.Col>
                  <TextInput
                    radius={"8px"}
                    inputWrapperOrder={inputWrapperData}
                    value={
                      behaviourDetails.widgetBehavior
                        .placeholderTextForEmailCapture || "E-Mail"
                    }
                    placeholder={"E-Mail Input Placeholder"}
                    onChange={(e) =>
                      handleChange({
                        subType: "widgetBehavior",
                        type: "behavior",
                        value: e.target.value,
                        key: "placeholderTextForEmailCapture",
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <Label text={"E-Mail Input Helper Text"} />
              <Grid>
                <Grid.Col>
                  <TextInput
                    radius={"8px"}
                    defaultValue={
                      "Ask us anything, or share your feedback. We’re here to help, no matter where you’re based in the world."
                    }
                    value={
                      behaviourDetails.widgetBehavior.subTitle ||
                      "Ask us anything, or share your feedback. We’re here to help, no matter where you’re based in the world."
                    }
                    inputWrapperOrder={inputWrapperData}
                    placeholder={
                      "Enter your e-mail so that you get a response both here and in your email in case you miss it."
                    }
                    description={"Maximum 20 Words or 100 Characters"}
                    onChange={(e) =>
                      handleChange({
                        subType: "widgetBehavior",
                        type: "behavior",
                        value: e.target.value,
                        key: "subTitle",
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <SwitchWithLabel
                onClick={(e) => {
                  handleChange({
                    subType: "widgetBehavior",
                    type: "behavior",
                    value: e.currentTarget.checked,
                    key: "collectUserEmail",
                  });
                }}
                value={!!behaviourDetails.widgetBehavior.autoReply || false}
                heading="Auto Responder"
                description="Collect e-mail before a conversation is created."
              />

              <Label text={"Auto-reply"} />
              <Grid>
                <Grid.Col>
                  <Textarea
                    // disabled={true}
                    value={behaviourDetails.widgetBehavior.autoReply}
                    radius={"8px"}
                    inputWrapperOrder={inputWrapperData}
                    description="Set up an auto-response after user submits an email. Available Tags: {useremail}"
                    placeholder={`You’ll get replies here and we might reach out to you via your e-mail:{useremail}`}
                    onChange={(e) =>
                      handleChange({
                        subType: "widgetBehavior",
                        type: "behavior",
                        value: e.target.value,
                        key: "autoReply",
                      })
                    }
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Box mb={16} fw={600}>
              <SwitchWithLabel
                onClick={(e) => {
                  handleChange({
                    subType: "operatingHours",
                    type: "behavior",
                    value: e.currentTarget.checked,
                    key: "enableOperatingHours",
                  });
                }}
                value={
                  behaviourDetails.operatingHours.enableOperatingHours || false
                }
                heading="Operating Hours"
                description="Configure when your business is inactive and have a
                auto-responder takeover"
              />

              {behaviourDetails.operatingHours.enableOperatingHours && (
                <>
                  {/*                   <SwitchWithLabel
                    onClick={(e) => {
                      handleChange({
                        subType: "operatingHours",
                        type: "behavior",
                        value: e.currentTarget.checked,
                        key: "hideNewConversationButtonWhenOffline",
                      });
                    }}
                    value={
                      behaviourDetails.operatingHours
                        .hideNewConversationButtonWhenOffline || false
                    }
                    heading="Prevent users to create new conversations when offline"
                  /> */}
                  <Grid mt={"32px"}>
                    <Grid.Col>
                      <Select
                        width={"100%"}
                        placeholder="Select Timezone"
                        rightSection={<MdKeyboardArrowDown />}
                        defaultValue={behaviourDetails.operatingHours.timezone}
                        data={moment.tz.names().map((name) => ({
                          value: name,
                          label: name,
                        }))}
                        label="Timezone"
                        onChange={(value) =>
                          handleChange({
                            subType: "operatingHours",
                            type: "behavior",
                            value:
                              value || behaviourDetails.operatingHours.timezone,
                            key: "timezone",
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>

                  {/* <TimeInput/> */}
                  <Grid mt={"32px"}>
                    <Grid.Col>
                      <Flex
                        gap={"10"}
                        align={"flex-end"}
                        justify={"space-between"}
                        w={"100%"}
                      >
                        <TimeInput
                          w={"48%"}
                          label="Enter Operating Hours"
                          placeholder="Input placeholder"
                        />
                        <TimeInput w={"48%"} />
                      </Flex>
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col>
                      <Label text={"Auto Responder Text"} />

                      <Textarea
                        placeholder="Enter your message here!"
                        description={
                          "Set up an auto-response when you are Offline, this overrides your default Auto-Reply Message when offline."
                        }
                        inputWrapperOrder={inputWrapperData}
                        defaultValue={
                          behaviourDetails.operatingHours
                            .autoReplyMessageWhenOffline
                        }
                        onChange={(e) =>
                          handleChange({
                            subType: "operatingHours",
                            type: "behavior",
                            value: e.target.value,
                            key: "autoReplyMessageWhenOffline",
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </>
              )}
            </Box>
          </MainDiv>
          <Button
            radius="md"
            className="primary"
            leftIcon={<img src={ProfileSave} />}
            color="indigo"
            onClick={() => {
              handleSave();
            }}
          >
            {" "}
            Save{" "}
          </Button>
        </InfoContainer>
      </Wrapper>
    </>
  );
};

export default Behavior;
