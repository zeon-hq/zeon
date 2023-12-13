import { Select, Space } from "@mantine/core";
import settingIcon from "assets/settingIcon.svg";
import { ChronologyName, FilterName, SubFilterName } from "components/types";
import PanelLabel from "components/widget/PanelLabel";
import { setSelectedSubFilter } from "reducer/slice";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  ISelectedPage,
  setLoading,
  setSelectedChronology,
  setSelectedFilter,
  setSelectedPage,
  setShowSidebar
} from "reducer/slice";
import styled from "styled-components";
import { TicketSearch } from "./TicketSearch";

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

export function MessageListHeader() {
  const dispatch = useDispatch();

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
    const channelId: any = localStorage.getItem("userstak-dashboard-channelId");
    dispatch(setLoading(true));
    handleClick({ type: "loading", name: "Loading.." });
    localStorage.setItem("userstak-dashboard-channelId", channelId);
    setTimeout(() => {
      handleClick({ type: "channel", name: channelId });
      dispatch(setLoading(false));
    }, 500);
  };
  
const onFilterChange = (value: FilterName) => {
  dispatch(setSelectedFilter(value));
};
  return (
      <Wrapper>
          {" "}
          <div style={{ padding: "0px 12px" }}>
              <PanelLabel
                  labelTitle="Inbox"
                  icon={settingIcon}
                  iconOnClick={gotoSettingsPage}
              />
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
  