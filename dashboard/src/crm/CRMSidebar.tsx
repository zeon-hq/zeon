import channelCreate from "assets/channelCreate.svg"
import SubscribeModal from "components/Billing/SubscribeModal"
import PanelLabel from "components/widget/PanelLabel"
import useDashboard from "hooks/useDashboard"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import {
  SideBarInnerWrapper,
  SideBarTopWrapper,
} from "components/details/inbox/inbox.styles"
import NavItem from "components/ui-components/NavItem"
import contactIcon from "assets/user-square.svg"
import companyIcon from "assets/bank.svg"
import {
  setSelectedCompanyPage,
  setSelectedContactPage,
} from "reducer/crmSlice"
import useCrm from "hooks/useCrm"
import { useNavigate } from "react-router"

const MainWrapper = styled.div`
  height: calc(100vh - 62px);
  overflow: auto;
  border-right: 1px solid #eaecf0;
  padding: 16px;
`

const CRMSidebar = ({ workspaceId }: { workspaceId: string }) => {
  const { loading, workspaceInfo } = useDashboard()

  const { selectedPage } = useCrm()
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSidebarOptionClick = (name: string) => {
    if (name === "contacts") {
      dispatch(
        setSelectedCompanyPage({
          type: "all",
        })
      )
    }
    if (name === "companies") {
      dispatch(
        setSelectedContactPage({
          type: "all",
        })
      )
    }
    navigate(`/relation/${workspaceInfo.workspaceId}/${name}`)
  }

  const navItems = [
    {
      label: "Contacts",
      icon: contactIcon,
      onClick: () => {
        handleSidebarOptionClick("contacts")
      },
    },
    {
      label: "Companies",
      icon: companyIcon,
      onClick: () => {
        handleSidebarOptionClick("companies")
      },
    },
  ]

  const isWorkSpaceEmpty = !!_.isEmpty(workspaceInfo)

  const [open, setOpen] = useState(() =>
    workspaceInfo?.subscriptionStatus === "trialing" ||
    workspaceInfo?.subscriptionStatus === "active"
      ? false
      : true
  )

  useEffect(() => {
    if (!!workspaceInfo)
      setOpen(
        workspaceInfo?.subscriptionStatus === "trialing" ||
          workspaceInfo?.subscriptionStatus === "active"
          ? false
          : true
      )
  }, [workspaceInfo])

  return (
    <>
      <MainWrapper>
        <SideBarTopWrapper>
          <SideBarInnerWrapper style={{ paddingBottom: "12px" }}>
            <PanelLabel
              labelTitle="General"
              icon={channelCreate}
              iconOnClick={() => {}}
            />
          </SideBarInnerWrapper>
          {navItems.map((item, index) => {
            return (
              <NavItem
                key={index}
                onClick={item.onClick}
                icon={item.icon}
                label={item.label}
                selected={selectedPage.type === item.label.toLowerCase()}
              />
            )
          })}
        </SideBarTopWrapper>
      </MainWrapper>
      {isWorkSpaceEmpty && <SubscribeModal openModal={open} />}
    </>
  )
}

export default CRMSidebar
