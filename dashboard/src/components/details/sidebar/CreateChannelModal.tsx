import {
  Box,
  Button,
  Input,
  Modal,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core"
import { useInputState } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import Embed from "assets/embed.svg"
import Inapp from "assets/inapp.svg"
import Instagram from "assets/instagram.svg"
import Twitter from "assets/twitter.svg"
import Whatsapp from "assets/whatsapp.svg"
import Widget from "assets/widget.svg"
import User from "components/tabInfo/channel/User"
import useDashboard from "hooks/useDashboard"
import React from "react"
import { useDispatch } from "react-redux";
import { initDashboard } from "reducer/slice";
import { createChannel } from "service/DashboardService"
import { ArrowLeft } from "tabler-icons-react"
import OnboardingCard from "../inbox/component/OnboardingCard"
import BrandLogoSection from "./BrandLogoSection"

type Props = {
  opened: boolean
  setOpened: (value: boolean) => void
}

const CreateChannelModal = ({ opened, setOpened }: Props) => {
  const [name, setName] = useInputState("")
  const [loading, setLoading] = React.useState(false)
  const { workspaceInfo } = useDashboard();
  const [step, setStep] = React.useState(1);
  const [channelId, setChannelId] = React.useState<string | undefined>(
    undefined
  )
  const dispatch = useDispatch()

  const createChannelFromName = async () => {
    try {
      if (!name) {
        showNotification({
          title: "Error",
          message: "Please enter a name for the workspace",
        })
        return
      }
      setLoading(true)
      const res = await createChannel(workspaceInfo.workspaceId, name)
      setChannelId(res.data.id)
      setLoading(false)
      showNotification({
        title: "Success",
        message: "Channel created successfully",
        color: "green",
      })
      //@ts-ignore
      dispatch(initDashboard(workspaceInfo.workspaceId))
      // reload the page
      setStep(3)
      // window.location.reload();
    } catch (error) {
      setLoading(false)
      console.log(">>>", error)
    }
  }

  const onboardingInfo = [
    {
      heading: "Website Chat Widget",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Widget,
      disabled: false,
    },
    {
      heading: "Web Embeddable",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Embed,
      disabled: true,
    },
    {
      heading: "WhatsApp Chat",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Whatsapp,
      disabled: true,
    },
    {
      heading: "In-App Chat",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Inapp,
      disabled: true,
    },
    {
      heading: "Twitter DM",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Twitter,
      disabled: true,
    },
    {
      heading: "Instagram DM",
      subHeading: "Embed onto your Website Fast",
      imgSrc: Instagram,
      disabled: true,
    },
  ]

  return (
    <Modal
    yOffset="20vh" 
    xOffset={0}
      opened={opened}
      onClose={() => {
        setStep(1)
        setOpened(false)
      }}
      withCloseButton={true}
      // title="Create a New Channel"
      fullScreen
    >
      <div
        style={{
          width: step === 1 ? "40%" : "60%",
          margin: "auto",
        }}
      >
        {step === 1 ? (
          <>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BrandLogoSection />
            </Box>
            <Space h={"30px"} />
            <Text size="md">Get Started</Text>
            <Text
              style={{
                color: "#909296",
              }}
              size="sm"
            >
              To begin, enter a name for your new incoming chat channel
            </Text>
            <Space h={"30px"} />
            <Text size="sm" style={{ fontWeight: "500" }}>
              Channel Name
            </Text>
            <Input
              value={name}
              required
              onChange={setName}
              placeholder="Name"
            />
            <Space h={50} />
            <div>
              <Button
                radius="md"
                loading={loading}
                // style={{ width: "50%" }}
                color="dark"
                onClick={() => setOpened(false)}
                mr="10px"
              >
                {" "}
                Close{" "}
              </Button>

              <Button
                radius="md"
                loading={loading}
                style={{ width: "50%", float: "right" }}
                color="indigo"
                onClick={() => setStep(2)}
                disabled={!name}
              >
                {" "}
                Next{" "}
              </Button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <Text size="md" style={{ fontWeight: "500" }}>
              {" "}
              Select Incoming Channel Source{" "}
            </Text>
            <Text
              style={{
                color: "#909296",
              }}
              size="sm"
            >
              Select an incoming message source for this channel from where you
              want to receive support queries.
            </Text>

            <Space h={"30px"} />
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 980, cols: 3, spacing: "md" },
                { maxWidth: 800, cols: 2, spacing: "sm" },
                { maxWidth: 770, cols: 1, spacing: "sm" },
              ]}
            >
              {onboardingInfo.map((info, index) => (
                <OnboardingCard key={index} {...info} />
              ))}
            </SimpleGrid>
            <Space h={50} />
            <div>
              <Button
                radius="md"
                onClick={() => setStep(1)}
                color={"gray"}
                variant="outline"
                leftIcon={<ArrowLeft />}
              >
                {" "}
                Back{" "}
              </Button>
              <Button
                radius="md"
                loading={loading}
                style={{ width: "50%", float: "right" }}
                color="indigo"
                onClick={() => createChannelFromName()}
              >
                {" "}
                Next{" "}
              </Button>
            </div>
          </>
        ) : (
          <>
            <User channelId={channelId} />
          </>
        )}
      </div>
    </Modal>
  )
}

export default CreateChannelModal
