import {
  Box,
  Divider,
  FileInput,
  Grid,
  LoadingOverlay,
  Select,
  Space,
  TextInput,
  Text
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import ProfileSave from "assets/profile_save.png";
import Heading from "components/details/inbox/component/Heading";
import { Label } from "components/ui-components";
import SelectColor from "components/ui-components/SelectColor";
import SwitchWithLabel from "components/ui-components/SwitchWithLabel";
import Widget from "components/widget/Widget";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IUpdateDashboardAction, enableInChatWidget, updateDashboardSetting, updateSingleInChatWidget, updateUserAvatarsVisibility } from "reducer/slice";
import { updateChannel, uploadFile } from "service/DashboardService";
import { inputWrapperData } from "util/Constant";
import {
  InfoContainer,
  MainDiv,
  WidgetContainer,
  Wrapper,
} from "../tabInfo.styles";

function getFilenameFromUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    const pathname = url.pathname;
    const filename = pathname.split("/").pop();
    return decodeURIComponent(filename || '');
  } catch (e) {
    console.error(e);
    return '';
  }
}

const Appearance = () => {
  const { channelsInfo, selectedPage } = useDashboard();
  const dispatch = useDispatch();

  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;
  const inChatWidgets = channelsInfo[selectedPage.name]?.inChatWidgets;

  const [value, setValue] = useState<File | null>(null);
  const [userAvatarValue, setUserAvatarValue] = useState<string | null>(null);
  const [botAvatarValue, setBotAvatarValue] = useState<File | null>(null);
  const [userAvatarIndex, setUserAvatarIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleChange = ({
    subType,
    type,
    value,
    key,
  }: IUpdateDashboardAction) => {
    dispatch(
      updateDashboardSetting({
        type: type || "appearance",
        subType,
        value,
        key,
      })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (value) {
        const formData = new FormData();
        formData.append("file", value);
        // formData.append('fileName', value.name);
        const res = await uploadFile(formData);
        handleChange({
          subType: "widgetHeaderSection",
          type: "appearance",
          value: res.uploadedUrl,
          key: "topLogo",
        });

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error while uploading file",
      });
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserAvatarSubmit = async () => {
    setLoading(true);
    try {
      if (userAvatarValue) {
        const formData = new FormData();
        formData.append("file", userAvatarValue);
        // formData.append('fileName', value.name);
        const res = await uploadFile(formData);

        const curAvatar = [...appearenceDetails?.userAvatars?.userAvatarsLinks]
        // add new avatar at userAvatarIndex
        curAvatar[userAvatarIndex] = {link:res.uploadedUrl, enabled:true}
        handleChange({
          subType: "userAvatars",
          type: "appearance",
          //@ts-ignore
          value: curAvatar,
          key: "userAvatarsLinks",
        });

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error while uploading file",
      });
      setLoading(false);
      console.log(error);
    }
  }

  const handleBotAvatarSubmit = async () => {
    setLoading(true);
    try {
      if (botAvatarValue) {
        const formData = new FormData();
        formData.append("file", botAvatarValue);
        // formData.append('fileName', value.name);
        const res = await uploadFile(formData);

        handleChange({
          subType: "miscellaneous",
          type: "appearance",
          value: res.uploadedUrl,
          key: "botAvatar",
        });

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error while uploading file",
      });
      setLoading(false);
      console.log(error);
    }
  }

  const handleSave = async () => {
    try {
      //@ts-ignore
      setLoading(true);
      await updateChannel(
        channelsInfo[selectedPage.name].channelId,
        channelsInfo[selectedPage.name]
      );
      showNotification({
        title: "Notification",
        message: "Saved Successfully",
      });
      //@ts-ignore
      setLoading(false);
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [value]); // eslint-disable-line

  useEffect(() => {
    handleUserAvatarSubmit();
  }, [userAvatarValue]); // eslint-disable-line

  useEffect(() => {
    handleBotAvatarSubmit();
  }, [botAvatarValue]); // eslint-disable-line

  return (
    <>
      <div className="">
        <Box>
          <Heading
            icon={<img alt="profile save" src={ProfileSave} />}
            heading={"Appearance"}
            subheading="Configure how Zeon looks so it better suits your brand experience"
            onSave={() => handleSave()}
            buttonText="Save"
          />
        </Box>
        <Wrapper>
          <LoadingOverlay visible={loading} />
          <InfoContainer>
            <MainDiv>
              <Box mb={16} fw={600}>
                <SwitchWithLabel
                  onClick={(e) => {
                    handleChange({
                      subType: "miscellaneous",
                      key: "showBranding",
                      value: e.target.checked,
                      type: "appearance",
                    });
                  }}
                  value={appearenceDetails?.miscellaneous?.showBranding ?? true}
                  heading="Branding"
                  description="Branding can only be disabled on paid plans."
                />

                <Space style={{ marginTop: "16px" }} />

                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  <Grid.Col>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                      // placeholder={
                      //   appearenceDetails?.widgetHeaderSection?.topLogo
                      //     ? "Click to change the top logo"
                      //     : "Select top logo"
                      // }
                      label={
                        <Text size="12px"> Widget Branding </Text>
                      }
                      //@ts-ignore
                      placeholder={
                        appearenceDetails?.widgetHeaderSection?.topLogo ?
                          getFilenameFromUrl(appearenceDetails?.widgetHeaderSection?.topLogo || '')
                          : "Click to change the top logo"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      onChange={setValue}
                      
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>

                <Space style={{ marginTop: "16px" }} />

                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  <Grid.Col>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your bot avatar"
                      // placeholder={
                      //   appearenceDetails?.widgetHeaderSection?.topLogo
                      //     ? "Click to change the top logo"
                      //     : "Select top logo"
                      // }
                      label={
                        <Text size="12px"> Bot Avatar </Text>
                      }
                      //@ts-ignore
                      placeholder={
                        appearenceDetails?.widgetHeaderSection?.topLogo ?
                          getFilenameFromUrl(appearenceDetails?.miscellaneous?.botAvatar || '')
                          : "Click to change the bot avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      onChange={setBotAvatarValue}
                      
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
              <Divider my="sm" />
              <Box mb={16}>
                

                <Label style={{marginTop:"16px"}} text={"Heading and Initial Message"} size="sm" />
                <Label text={"Heading"} size="sm" />
                <Grid>
                  <Grid.Col>
                    <TextInput
                      inputWrapperOrder={inputWrapperData}
                      description="Ideally Short (2-3 Words)"
                      onChange={(e) =>
                        handleChange({
                          subType: "widgetHeaderSection",
                          key: "mainHeading",
                          value: e.target.value,
                          type: "appearance",
                        })
                      }
                      value={
                        appearenceDetails?.widgetHeaderSection?.mainHeading
                      }
                      placeholder={"Enter color to be picked"}
                    />
                  </Grid.Col>
                </Grid>

                <Label text={"Initial Message"} />
                <Grid>
                  <Grid.Col>
                    <TextInput
                      description="Maximum 20 Words or 100 Characters"
                      inputWrapperOrder={inputWrapperData}
                      onChange={(e) =>
                        handleChange({
                          subType: "widgetHeaderSection",
                          key: "subHeading",
                          value: e.target.value,
                          type: "appearance",
                        })
                      }
                      value={appearenceDetails?.widgetHeaderSection?.subHeading}
                      placeholder={"Enter color to be picked"}
                    />
                  </Grid.Col>
                </Grid>
                <Space mb={"20px"} />
              </Box>
              <Divider my="sm" />
              <Box mb={16}>
                <Space mb={"20px"} />
                <Grid>
                  <Grid.Col>
                    <SwitchWithLabel
                      onClick={(e) => {
                        handleChange({
                          subType: "userAvatars",
                          key: "enableUserAvatars",
                          value: e.target.checked,
                          type: "appearance",
                        });
                      }}
                      value={appearenceDetails?.userAvatars?.enableUserAvatars}
                      heading="User Avatars"
                      description="Customize and manage your online chat agents to highlight for your users"
                    />
                  </Grid.Col>
                </Grid>

                <Space style={{ marginTop: "32px" }} />
                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                  mb="md"
                >
                  <Grid.Col span={2}>
                    <SwitchWithLabel
                      checkBoxFirst={true}
                      onClick={(e) => {
                        
                        dispatch(updateUserAvatarsVisibility({
                          index: 0,
                          //@ts-ignore
                          value: e.target.checked
                        }))
                      }}
                      value={appearenceDetails.userAvatars.userAvatarsLinks[0].enabled}
                      heading="Avatar 1"
                      // description="Show user avatars in the chat widget"
                    />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                      //@ts-ignore
                      placeholder={
                        appearenceDetails.userAvatars.userAvatarsLinks[0].link
                          ? getFilenameFromUrl(appearenceDetails.userAvatars.userAvatarsLinks[0].link)
                          : "Click to change the avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      //@ts-ignore
                      onChange={
                        (file) => {
                          setUserAvatarIndex(0);
                          //@ts-ignore
                          setUserAvatarValue(file)
                        }
                      }
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                  mb="md"
                >
                  <Grid.Col span={2}>
                    <SwitchWithLabel
                    checkBoxFirst={true}
                      onClick={(e) => {
                        dispatch(updateUserAvatarsVisibility({
                          index: 1,
                          //@ts-ignore
                          value: e.target.checked
                        }))
                      }}
                      value={appearenceDetails.userAvatars.userAvatarsLinks[1].enabled}
                      heading="Avatar 2"
                      // description="Show user avatars in the chat widget"
                    />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                      //@ts-ignore
                      placeholder={
                        appearenceDetails.userAvatars.userAvatarsLinks[1].link
                          ? getFilenameFromUrl(appearenceDetails.userAvatars.userAvatarsLinks[1].link)
                          : "Click to change the avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      //@ts-ignore
                      onChange={
                        (file) => {
                          setUserAvatarIndex(1);
                          //@ts-ignore
                          setUserAvatarValue(file)
                        }
                      }
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                  mb="md"
                >
                  <Grid.Col span={2}>
                    <SwitchWithLabel
                    checkBoxFirst={true}
                      onClick={(e) => {
                        
                        dispatch(updateUserAvatarsVisibility({
                          index: 2,
                          //@ts-ignore
                          value: e.target.checked
                        }))
                      }}
                      value={appearenceDetails.userAvatars.userAvatarsLinks[2].enabled}
                      heading="Avatar 3"
                      // description="Show user avatars in the chat widget"
                    />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                       //@ts-ignore
                       placeholder={
                        appearenceDetails.userAvatars.userAvatarsLinks[2].link
                          ? getFilenameFromUrl(appearenceDetails.userAvatars.userAvatarsLinks[2].link)
                          : "Click to change the avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      //@ts-ignore
                      onChange={
                        (file) => {
                          setUserAvatarIndex(2);
                          //@ts-ignore
                          setUserAvatarValue(file)
                        }
                      }
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  <Grid.Col span={2}>
                    <SwitchWithLabel
                    checkBoxFirst={true}
                      onClick={(e) => {
                        dispatch(updateUserAvatarsVisibility({
                          index: 3,
                          //@ts-ignore
                          value: e.target.checked
                        }))
                      }}
                      value={appearenceDetails.userAvatars.userAvatarsLinks[3].enabled}
                      heading="Avatar 4"
                      // description="Show user avatars in the chat widget"
                    />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                       //@ts-ignore
                       placeholder={
                        appearenceDetails.userAvatars.userAvatarsLinks[3].link
                          ? getFilenameFromUrl(appearenceDetails.userAvatars.userAvatarsLinks[3].link)
                          : "Click to change the avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      //@ts-ignore
                      onChange={
                        (file) => {
                          setUserAvatarIndex(3);
                          //@ts-ignore
                          setUserAvatarValue(file)
                        }
                      }
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  <Grid.Col span={2}>
                    <SwitchWithLabel
                    checkBoxFirst={true}
                      onClick={(e) => {
                        dispatch(updateUserAvatarsVisibility({
                          index: 4,
                          //@ts-ignore
                          value: e.target.checked
                        }))
                      }}
                      value={appearenceDetails.userAvatars.userAvatarsLinks[4].enabled}
                      heading="Avatar 5"
                      // description="Show user avatars in the chat widget"
                    />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                       //@ts-ignore
                       placeholder={
                        appearenceDetails.userAvatars.userAvatarsLinks[4].link
                          ? getFilenameFromUrl(appearenceDetails.userAvatars.userAvatarsLinks[4].link)
                          : "Click to change the avatar"
                      }
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      //@ts-ignore
                      onChange={
                        (file) => {
                          setUserAvatarIndex(4);
                          //@ts-ignore
                          setUserAvatarValue(file)
                        }
                      }
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
              <Divider my="sm" />
              <Box mb={16}>
                <Label text={"Submit Button"} size="sm" />

                <Space mb={"20px"} />
                {/* <Label text={"Button Color"} /> */}
                <SelectColor
                  description="This sets the color of the new conversation button. Color should be in HEX format."
                  label={"Color"}
                  value={appearenceDetails?.newConversationButton?.buttonColor}
                  handleChange={(colorValue: string) => {
                    handleChange({
                      subType: "newConversationButton",
                      key: "buttonColor",
                      value: colorValue,
                      type: "appearance",
                    });
                  }}
                />
              </Box>
              <Divider my="sm" />
              <Space h="16px" />
              <Box mb={16}>
                <SwitchWithLabel
                  onClick={(e) => {
                    dispatch(
                      enableInChatWidget({
                        index: 0,
                        value: e.target.checked,
                      })
                    )
                  }}
                  value={inChatWidgets[0].enabled}
                  heading="CTA 1"
                  description=""
                />
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        { value: "slack", label: "Slack" },
                        { value: "docs", label: "Documentation" },
                        { value: "discord", label: "Discord" },
                        { value: "twitter", label: "Twitter" },
                        {value:"whatsapp", label:"Whatsapp"},
                        {value:'youtube', label:'Youtube'},
                        {value: "calendar", label: "Calendar"}
                      ]}
                      styles={(theme) => ({
                        item: {
                          // applies styles to selected item
                          '&[data-selected]': {
                            '&, &:hover': {
                              backgroundColor: '#4263EB',
                              color: 'white'
                            },
                          },
                
                          // applies styles to hovered item (with mouse or keyboard)
                          '&[data-hovered]': {},
                        },
                      })}
                      placeholder="Select an option"
                      label={
                        <Text size="12px"> Icon </Text>
                      }
                      onChange={(e) => {
                        dispatch(
                          updateSingleInChatWidget({
                            index: 0,
                            key: "topLogo",
                            value: e || "slack",

                          })
                        )
                      }}
                      value={inChatWidgets[0].topLogo}
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <TextInput value={
                      inChatWidgets[0].title
                      
                    }
                    onChange={
                      (event) => {
                        dispatch(
                          updateSingleInChatWidget({
                            index: 0,
                            key: "title",
                            value: event.target.value
                          })
                        )
                      }
                    }
                     placeholder="Enter text" label={
                      <Text size="12px"> Title </Text>
                    }  />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                    value={inChatWidgets[0].link}
                    onChange={(event) => {
                      dispatch(
                        updateSingleInChatWidget({
                          index: 0,
                          key: "link",
                          value: event.target.value
                        })
                      )
                    }}
                    placeholder="Enter text" label={
                      <Text size="12px"> Target Link </Text>
                    }  />
                  </Grid.Col>
                </Grid>
              </Box>

              <Box mb={16}>
                <Grid>
                  <Grid.Col>
                    <SwitchWithLabel
                     onClick={(e) => {
                      dispatch(
                        enableInChatWidget({
                          index: 1,
                          value: e.target.checked,
                        })
                      )
                    }}
                      value={
                        inChatWidgets[1].enabled
                      }
                      heading="CTA 2"
                      description=""
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        { value: "slack", label: "Slack" },
                        { value: "docs", label: "Documentation" },
                        { value: "discord", label: "Discord" },
                        { value: "twitter", label: "Twiiter" },
                        {value:"whatsapp", label:"Whatsapp"},
                        {value:'youtube', label:'Youtube'}
                      ]}
                      placeholder="Select an option"
                      label={
                        <Text size="12px"> Icon </Text>
                      }
                      onChange={(e) => {
                        dispatch(
                          updateSingleInChatWidget({
                            index: 1,
                            key: "topLogo",
                            value: e || "slack"
                          })
                        )
                      }}
                      value={inChatWidgets[1].topLogo}
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <TextInput onChange={(event) => {
                      dispatch(
                        updateSingleInChatWidget({
                          index: 1,
                          key: "title",
                          value: event.target.value
                        })
                      )
                    }

                    } placeholder="Enter text" value={
                      inChatWidgets[1].title
                    } label={
                      <Text size="12px"> Title </Text>
                    } />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                    onChange={(event) => {
                      dispatch(
                        updateSingleInChatWidget({
                          index: 1,
                          key: "link",
                          value: event.target.value
                        })
                      )
                    }
                    }
                    value={inChatWidgets[1].link}
                    placeholder="Enter text" label={
                      <Text size="12px"> Target Link </Text>
                    }  />
                  </Grid.Col>
                </Grid>
              </Box>
            </MainDiv>
          </InfoContainer>
          <WidgetContainer>
            <Widget configType="appearance" />
          </WidgetContainer>
        </Wrapper>
      </div>
    </>
  );
};

export default Appearance;
