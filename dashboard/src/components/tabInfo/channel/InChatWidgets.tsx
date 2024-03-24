import { Button, Divider, Grid, Space, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import deleteBtn from "assets/deleteBtnAppear.svg";
import ProfileSave from "assets/profile_save.png";
import Heading from "components/details/inbox/component/Heading";
import { Label } from "components/ui-components";
import Widget from "components/widget/Widget";
import useDashboard from "hooks/useDashboard";
import { useDispatch } from "react-redux";
import {
  InChatWidgetInterface,
  InChatWidgetInterfaceKeys,
  addInChatWidget,
  deleteInChatWidget,
  setLoading,
  updateInChatWidget,
} from "reducer/slice";
import { updateChannel } from "service/DashboardService";
import { Plus } from "tabler-icons-react";
import { inputWrapperData } from "util/Constant";
import {
  InfoContainer,
  MainDiv,
  WidgetContainer,
  Wrapper,
} from "../tabInfo.styles";

const InChatWidgets = () => {
  const dispatch = useDispatch();

  const { channelsInfo, selectedPage } = useDashboard();
  const inChatWidgets = channelsInfo[selectedPage.name]?.inChatWidgets;

  const handleAddWidget = () => {
    const newWidget: InChatWidgetInterface = {
      title: "New Widget",
      subTitle: "New Widget Subtitle",
      topLogo: "Space",
      link: "",
    };
    dispatch(addInChatWidget(newWidget));
  };

  const handleValueChange = ({
    property,
    value,
    index,
  }: {
    property: InChatWidgetInterfaceKeys;
    value: string;
    index: number;
  }) => {
    dispatch(
      updateInChatWidget({
        property,
        data: value,
        index,
      })
    );
  };

  const handleDeleteWidget = (index: number) => {
    dispatch(deleteInChatWidget({ index }));
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
        heading="In Chat Widgets"
        showDivider
        icon={<img alt="profile" src={ProfileSave} />}
        subheading="Create widgets with content and give them a link. This is useful if you want to create a button for scheduling meetings, documentation and invites to your social channels."
        onSave={() => handleSave()}
        buttonText="Save"
      />
      <Wrapper>
        <InfoContainer>
          <MainDiv>
            {(inChatWidgets || []).map(
              (item: InChatWidgetInterface, index: number) => (
                <>
                  <Label text={`Widget ${index + 1}`} />
                  <Label text={"Title"} />
                  <Grid>
                    <Grid.Col >
                      <TextInput
                        value={item.title}
                        placeholder={"Enter title here"}
                        onChange={(e) =>
                          handleValueChange({
                            property: "title",
                            value: e.target.value,
                            index,
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>

                  <Label text={"Sub Heading"} />
                  <Grid>
                    <Grid.Col>
                      <TextInput
                        inputWrapperOrder={inputWrapperData}
                        value={item.subTitle}
                        description={"Maximum 20 Words or 100 Characters"}
                        placeholder={"Enter subtitle here"}
                        onChange={(e) =>
                          handleValueChange({
                            property: "subTitle",
                            value: e.target.value,
                            index,
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>

                  <Label text={"Target Link"} />
                  <Grid>
                    <Grid.Col>
                      <TextInput
                        // value={item.link}
                        defaultValue={item.link || "https://"}
                        placeholder={"Enter your link here"}
                        onChange={(e) =>
                          handleValueChange({
                            property: "link",
                            value: e.target.value,
                            index,
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>
                  <Space h="md" />
                  <Button
                    radius="md"
                    leftIcon={<img alt="delete" src={deleteBtn} />}
                    style={{
                      color: "#B42318",
                    }}
                    variant="subtle"
                    onClick={() => handleDeleteWidget(index)}
                  >
                    {" "}
                    Delete Widget{" "}
                  </Button>
                  <Space h="md" />
                  <Divider />
                </>
              )
            )}
            <Space h="md" />
            {inChatWidgets?.length < 4 && (
              <Button
                variant="light"
                color="#3054B9"
                leftIcon={<Plus />}
                radius="md"
                onClick={handleAddWidget}
              >
                {" "}
                Add Widget{" "}
              </Button>
            )}
          </MainDiv>
        </InfoContainer>
        <WidgetContainer>
          <Widget configType="inChatWidgets" />
        </WidgetContainer>

        {/* <Widget widgetButtonColor={widgetButtonColor} /> */}
      </Wrapper>
    </>
  );
};

export default InChatWidgets;
