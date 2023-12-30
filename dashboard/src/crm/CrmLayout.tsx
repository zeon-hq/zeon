import { Box } from "@mantine/core";
import useCrm from "hooks/useCrm";
import Companies from "./Companies";
import Contacts from "./Contacts";
import Dashboard from "./Dashboard";

const CrmLayout = () => {
  const { selectedPage } = useCrm();
  const { type } = selectedPage;

  const getPage = (pageName: string) => {
    switch (pageName) {
      case "dashboard":
        return <Dashboard />;
      case "contacts":
        return <Contacts />;
      case "companies":
        return <Companies />;
    }
  };

  return (
    <>
      <Box h="100vh" bg={"white"}>
          {getPage(type)}
      </Box>
    </>
  );
};

export default CrmLayout;
