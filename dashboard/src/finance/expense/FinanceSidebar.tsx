import { Space } from "@mantine/core";
import channelCreate from "assets/channelCreate.svg";
import SubscribeModal from "components/Billing/SubscribeModal";
import PanelLabel from "components/widget/PanelLabel";
import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  SideBarInnerWrapper,
  SideBarTopWrapper,
} from "components/details/inbox/inbox.styles";
import NavItem from "components/ui-components/NavItem";
import expenseIcon from "assets/line-chart-down-03.svg";
import incomeIcon from "assets/file-x-02.svg";
import { setCreateMode, setSelectedExpense } from "reducer/financeSlice";
import { useLocation, useNavigate } from "react-router";
const MainWrapper = styled.div`
  height: calc(100vh - 62px);
  overflow: auto;
  border-right: 1px solid #eaecf0;
  padding: 16px;
`;

const FinanceSidebar = ({ workspaceId }: { workspaceId: string }) => {
  const { workspaceInfo } = useDashboard();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isWorkSpaceEmpty = !!_.isEmpty(workspaceInfo);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filter = query.get('filter') || '';

  const [open, setOpen] = useState(() =>
    workspaceInfo?.subscriptionStatus === "trialing" ||
    workspaceInfo?.subscriptionStatus === "active"
      ? false
      : true
  );

  const navItems = [
    {
      label: "Expense",
      icon: expenseIcon,
      onClick: () => {
        navigate(`/finance/${workspaceId}?filter=all`)
      },
      filterValue: "all"
    },
    {
      label: "Paid",
      icon: incomeIcon,
      onClick: () => {
        navigate(`/finance/${workspaceId}?filter=paid`)
      },
      filterValue: "paid"
    },
    {
      label: "Not Paid",
      icon: incomeIcon,
      onClick: () => {
        navigate(`/finance/${workspaceId}?filter=unpaid`)
      },
      filterValue: "unpaid"
    }
  ]

  useEffect(() => {
    if (!!workspaceInfo)
      setOpen(
        workspaceInfo?.subscriptionStatus === "trialing" ||
          workspaceInfo?.subscriptionStatus === "active"
          ? false
          : true
      );
  }, [workspaceInfo]);

  return (
    <>
      <MainWrapper>
        <SideBarTopWrapper>
          <SideBarInnerWrapper style={{ paddingBottom: "12px" }}>
            <PanelLabel
              labelTitle="General"
              icon={channelCreate}
              iconOnClick={() => {
                dispatch(setSelectedExpense(null))
                dispatch(setCreateMode({
                  attachedDocuments: []
                  }))
                navigate(`/finance/${workspaceId}`)
              }}
            />
          </SideBarInnerWrapper>
          {navItems.map((item, index) => {
            return (
              <NavItem
                key={index}
                onClick={item.onClick}
                icon={item.icon}
                label={item.label}
                selected={filter === item.filterValue}
              />
            );
          })}

          <Space h="md" />
        </SideBarTopWrapper>
      </MainWrapper>

      {isWorkSpaceEmpty && <SubscribeModal openModal={open} />}
    </>
  );
};

export default FinanceSidebar;
