import { Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { inputWrapperData } from "util/Constant";
import CreateChannelFooter from "./CreateChannelFooter";
import CreateChannelHeader from "./CreateChannelHeader";
import ChooseChannel from "./ChooseChannel";
import AddUserToChannel from "./AddUserToChannel";
import { showNotification } from "@mantine/notifications"
import { createChannel } from "service/DashboardService"
import useDashboard from "hooks/useDashboard";
import { useDispatch } from "react-redux";
import {  initDashboard } from 'reducer/slice';
import {  useNavigate } from "react-router";
type ICreateChannelModalNew = {
  opened: boolean;
  setOpened: (value: boolean) => void;
};

const CreateChannelModalNew = ({
  opened,
  setOpened,
}: ICreateChannelModalNew) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [CTABtnTitle, setCTABtnTitle] = useState('Next');
  const [headerTitle, setHeaderTitle] = useState<string>("Get Started");
  const [channelId, setChannelId] = useState<string | undefined>(
    undefined
  )
  const [label, setLabel] = useState<string>(
    "To begin, enter a name for your new channel"
  );
  const [step, setStep] = useState<number>(0);
  const { workspaceInfo } = useDashboard();

  const createChannelFromName = async () => {
    try {
      if (!channelName) {
        showNotification({
          title: "Error",
          message: "Please enter a name for the workspace",
        })
        return
      }
      setLoading(true)
      const createNewChannel = await createChannel(workspaceInfo.workspaceId, channelName)
      if (createNewChannel.status === 200) {
      setChannelId(createNewChannel.data.id)
      setLoading(false)
      showNotification({
        title: "Success",
        message: "Channel created successfully",
        color: "green",
      })
    } else {  
      showNotification({
        title: "Error",
        message: "Channel creation failed",
        color: "red",
      })
    }
    } catch (error) {
      setLoading(false)
      console.log(">>>", error)
    }
  }

  const onModalClose = () => {
    setStep(0);
    setOpened(false);
    setChannelId('');
    setLoading(false);
    setChannelName('');
  }


  return (
      <Modal
          radius={"8px"}
          centered
          withCloseButton={false}
          opened={opened}
          onClose={onModalClose}
      >
          <div>
              <CreateChannelHeader
                  header={headerTitle}
                  label={label}
                  onCloseClick={onModalClose}
              />

              {step === 0 ? (
                  <TextInput
                      radius={"8px"}
                      mb={"300px"}
                      inputWrapperOrder={inputWrapperData}
                      onChange={(e) => {
                          setChannelName(e.target.value);
                      }}
                      label="Channel Name"
                      value={channelName}
                      placeholder={"Enter Channel Name"}
                  />
              ) : step === 1 ? (
                  <ChooseChannel />
              ) : step === 2 ? (
                  <>
                  {
                   channelId && 
                    <AddUserToChannel channelId={channelId} />
                  }
                  </>
              ) : (
                  <></>
              )}

              <CreateChannelFooter
                  loading={loading}
                  ctaButtonTitle={CTABtnTitle}
                  onCancelClick={() => {
                      setOpened(false);
                      setStep(0);
                  }}
                  onNextClick={() => {
                      if (step === 0) {
                          setHeaderTitle("Select Channel Type");
                          setLabel(
                              "Choose the type of channel you want to create"
                          );
                          setStep(1);
                      } else if (step === 1) {
                          setHeaderTitle("Invite users to channel");
                          setLabel(
                              "Invite users to your chat channel to collaborate together"
                          );
                          setCTABtnTitle("Save");
                          createChannelFromName();
                          setStep(2);
                      } else if (step === 2) {
                        //@ts-ignore
                        dispatch(initDashboard(workspaceInfo.workspaceId));
                        onModalClose();
                        navigate(`/${workspaceInfo.workspaceId}/chat?channelId=${channelId}&pageName=${'Overview'}`);
                      }
                      // setStep((value) => {
                      //     return value + 1;
                      // });
                  }}
              />
          </div>
      </Modal>
  );
};

export default CreateChannelModalNew;
