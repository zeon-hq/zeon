import {
  Box,
  FileInput,
  Grid,
  LoadingOverlay,
  Space,
  TextInput
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
import { IUpdateDashboardAction, updateDashboardSetting } from "reducer/slice";
import { updateChannel, uploadFile } from "service/DashboardService";
import { inputWrapperData } from "util/Constant";
import {
  InfoContainer,
  MainDiv,
  WidgetContainer,
  Wrapper,
} from "../tabInfo.styles";

const Appearance = () => {
  const { channelsInfo, selectedPage } = useDashboard();
  const dispatch = useDispatch();

  const appearenceDetails = channelsInfo[selectedPage.name]?.appearance;

  const [value, setValue] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = ({
    subType,
    type,
    value,
    key,
  }: IUpdateDashboardAction) => {
    dispatch(
      updateDashboardSetting({
        type: "appearance",
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
                  heading="Zeon Branding"
                  description="Branding can only be disabled on paid plans."
                />

                <Space style={{ marginTop: "32px" }} />



                <Grid>
                  <Grid.Col>
                    <FileInput
                      inputWrapperOrder={inputWrapperData}
                      description="Upload your logo with a transparent background. PNG, SVG Supported. 50px by 50px"
                      // placeholder={
                      //   appearenceDetails?.widgetHeaderSection?.topLogo
                      //     ? "Click to change the top logo"
                      //     : "Select top logo"
                      // }
                      label="Channel Logo"
                      // withAsterisk
                      accept="image/png,image/jpeg"
                      onChange={setValue}
                      name="img"
                      disabled={loading}
                    />
                  </Grid.Col>
                </Grid>

                <Label text={"Widget Button"} size="sm" />

                <Space style={{ marginTop: "32px" }} />

                <SelectColor
                  description="Color should be in HEX format."
                  label={"Color"}
                  value={
                    appearenceDetails?.widgetButtonSetting.widgetButtonColor
                  }
                  handleChange={(colorValue: string) => {
                    handleChange({
                      subType: "widgetButtonSetting",
                      key: "widgetButtonColor",
                      value: colorValue,
                      type: "appearance",
                    });
                  }}
                />
              </Box>

              <Box mb={16}>
                {/* <img src={TopBannerSvg} alt="Widget Header Section" /> */}
                <Space mb={"20px"} />
                {/*                 <SelectColor
                // description="dfdf"
                label={'Top Banner Color'}
                  value={appearenceDetails?.widgetHeaderSection?.topBannerColor}
                  handleChange={(colorValue: string) => {
                    handleChange({
                      subType: "widgetHeaderSection",
                      key: "topBannerColor",
                      value: colorValue,
                      type: "appearance",
                    });
                  }}
                /> */}
                <Space mb={"20px"} />

                <Label text={"Header"} size="sm" />

                <Space style={{ marginTop: "32px" }} />
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

                <Label text={"Sub Heading"} />
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

                {/*                 <Label text={"Text Color"} />
                <Grid>
                  <Grid.Col>
                    <Select
                      rightSection={<MdKeyboardArrowDown />}
                      inputWrapperOrder={inputWrapperData}
                      description="This is the color of the text for whole widget. You can select either black or white depending on the color of the banner."
                      placeholder="Pick one"
                      defaultValue={
                        appearenceDetails?.widgetHeaderSection?.textColor ||
                        "black"
                      }
                      data={[
                        { value: "black", label: "Black" },
                        { value: "white", label: "White" },
                      ]}
                      onChange={(e: string) => {
                        handleChange({
                          subType: "widgetHeaderSection",
                          key: "textColor",
                          value: e,
                          type: "appearance",
                        });
                      }}
                    />
                  </Grid.Col>
                </Grid>
 */}
                {/*                 <Label text={"Stroke Color"} />

                <Grid>
                  <Grid.Col>
                    <Select
                      rightSection={<MdKeyboardArrowDown />}
                      placeholder="Pick one"
                      inputWrapperOrder={inputWrapperData}
                      description="This is the color of the stroke for whole widget. You can select either dark, light or none."
                      defaultValue={
                        appearenceDetails?.widgetHeaderSection?.strokeColor ||
                        "dark"
                      }
                      data={[
                        { value: "dark", label: "Dark" },
                        { value: "light", label: "Light" },
                        { value: "none", label: "None" },
                      ]}
                      onChange={(e: string) => {
                        handleChange({
                          subType: "widgetHeaderSection",
                          key: "strokeColor",
                          value: e,
                          type: "appearance",
                        });
                      }}
                    />
                  </Grid.Col>
                </Grid> */}
              </Box>

              <Box mb={16}>
                <Label text={"New Conversation Button"} size="sm" />

                <Space mb={"20px"} />

                <Label text={"Button Color"} />

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
                <Label text={"Title"} />
                <Grid>
                  <Grid.Col>
                    <TextInput
                      inputWrapperOrder={inputWrapperData}
                      description="Ideally Short (2-3 Words)"
                      value={appearenceDetails.newConversationButton.title}
                      placeholder={"Start a New Conversation Right Now"}
                      onChange={(e) =>
                        handleChange({
                          subType: "newConversationButton",
                          key: "title",
                          value: e.target.value,
                          type: "appearance",
                        })
                      }
                      maxLength={30}
                    />
                  </Grid.Col>
                </Grid>

                {/*                 <Label text={"Sub Title"} />
                <Grid>
                  <Grid.Col>
                    <TextInput
                      value={appearenceDetails.newConversationButton.subTitle}
                      placeholder={
                        "Ask us anything, or share your feedback. We’re here to help, no matter where you’re based in the world."
                      }
                      required
                      onChange={(e) =>
                        handleChange({
                          subType: "newConversationButton",
                          key: "subTitle",
                          value: e.target.value,
                          type: "appearance",
                        })
                      }
                      maxLength={40}
                    />
                  </Grid.Col>
                </Grid> */}

                {/*                 <Label text={"Text Color"} />

                <Grid>
                  <Grid.Col>
                    <Select
                      placeholder="Pick one"
                      rightSection={<MdKeyboardArrowDown />}
                      inputWrapperOrder={inputWrapperData}
                      description="This is the color of the text for whole widget. You can select either black or white depending on the background."
                      defaultValue={
                        appearenceDetails?.newConversationButton.textColor ||
                        "white"
                      }
                      data={[
                        { value: "black", label: "Black" },
                        { value: "white", label: "White" },
                      ]}
                      onChange={(e: string) => {
                        handleChange({
                          subType: "newConversationButton",
                          key: "textColor",
                          value: e,
                          type: "appearance",
                        });
                      }}
                    />
                  </Grid.Col>
                </Grid> */}
                <Space h="32px" />
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
