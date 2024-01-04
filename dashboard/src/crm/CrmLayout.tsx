import { Box } from "@mantine/core";
import Companies from "./Companies";
import Contacts from "./Contacts";
import Dashboard from "./Dashboard";
import { useEffect } from "react";
import {
  setSelectedCompanyPage,
  setSelectedContactPage,
  setSelectedPage,
} from "reducer/crmSlice";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router";

interface CrmLayoutProps {
  pageName: "dashboard" | "contacts" | "companies";
}

const CrmLayout = ({ pageName }: CrmLayoutProps) => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("activeTab");

  useEffect(() => {
    dispatch(setSelectedPage({ type: pageName }));
  }, [dispatch, pageName]);

  useEffect(() => {
    if (pageName === "companies" && params.companyId) {
      dispatch(
        setSelectedCompanyPage({
          type: "view",
          companyData: {
            id: params.companyId,
          },
          activeTab: activeTab,
        })
      );
    } else if (pageName === "contacts" && params.contactId) {
      dispatch(
        setSelectedContactPage({
          type: "view",
          contactData: {
            id: params.contactId,
          },
          activeTab: activeTab,
        })
      );
    }
  }, [dispatch, pageName, params, activeTab]);

  const getPage = () => {
    switch (pageName) {
      case "dashboard":
        return <Dashboard />;
      case "contacts":
        return <Contacts />;
      case "companies":
        return <Companies />;
      default:
        return null;
    }
  };

  return (
    <>
      <Box h="100vh" bg={"white"}>
        {getPage()}
      </Box>
    </>
  );
};

export default CrmLayout;
