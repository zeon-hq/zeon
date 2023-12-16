import { Box, LoadingOverlay } from "@mantine/core"
import useDashboard from "hooks/useDashboard"
import Account from "./Account"
import ChannelDetail from "./ChannelDetail"
import Dashboard from "./Dashboard"
import Inbox from "./inbox"

const Details = () => {
  const { selectedPage, loading } = useDashboard()
  const { type, name } = selectedPage

  const getPage = (pageName: string) => {
    switch (pageName) {
      case "dashboard":
        return <Dashboard />
      case "account":
        return <Account />
      case "inbox":
        return <Inbox />
    }
  }

  return (
    <>
      <div style={{ height: "100vh", overflow: "hidden" }}>
        {type === "loading" ? (
          <LoadingOverlay visible={loading} />
        ) : type === "detail" ? (
          getPage(name)
        ) : (
          <ChannelDetail />
        )}
        {/* </Box> */}
      </div>
    </>
  )
}

export default Details
