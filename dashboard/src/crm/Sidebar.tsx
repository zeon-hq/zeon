import { LoadingOverlay, Navbar, Space } from "@mantine/core";
import companyIcon from "assets/companies.svg";
import contactIcon from "assets/contacts.svg";
import dasboardIcon from "assets/dashboard.svg";
import PanelLabel from "components/widget/PanelLabel";
import useCrm from "hooks/useCrm";
import { useDispatch } from "react-redux";
import { setSelectedPage } from "reducer/crmSlice";
import SidebarOption from "./SidebarOption";

const Sidebar = ({ workspaceId }: { workspaceId: string }) => {
  const dispatch = useDispatch();
  const { selectedPage } = useCrm();
  const { type } = selectedPage;
  const loading = false;

  const handleSidebarOptionClick = (name: string) => {
    dispatch(setSelectedPage({ type: name }));
  }

  return (
    <>
      <Navbar width={{ base: 300 }} height={"100vh"}>
        <div style={{ marginTop: "38px", padding: "16px" }}>
          {/* <div style={{ paddingBottom: "12px" }}>
            <PanelLabel labelTitle="General" />
          </div> */}
          <SidebarOption
            name="Dashboard"
            icon={dasboardIcon}
            onClick={() => handleSidebarOptionClick("dashboard")}
            selected={type === "dashboard"}
          />
          <SidebarOption
            name="Contacts"
            icon={contactIcon}
            onClick={() => handleSidebarOptionClick("contacts")}
            selected={type === "contacts"}
          />
          <SidebarOption
            name="Companies"
            icon={companyIcon}
            onClick={() => handleSidebarOptionClick("companies")}
            selected={type === "companies"}
          />

          <Space h="md" />
          <Navbar.Section>
            <div style={{ height: "43vh", overflow: "auto" }}>
              <LoadingOverlay visible={loading} />
            </div>
          </Navbar.Section>
        </div>
      </Navbar>
    </>
  );
};

export default Sidebar;
