import { Box, Flex, Button, Image } from "@mantine/core";
import styled from "styled-components";
import companyIcon from "assets/companies.svg";
import contactIcon from "assets/contacts.svg";
import { setSelectedCompanyPage, setSelectedContactPage, setSelectedPage } from "reducer/crmSlice";
import { useDispatch } from "react-redux";
import useCrm from "hooks/useCrm";
import CreateCannedResponseModal from "components/ui-components/CreateCannedResponseModal";
import CreateNoteModal from "./CreateNoteModal";

function Dashboard() {
  const dispatch = useDispatch();
  const {showNoteCreateModal} = useCrm();

  const Heading = styled.h1`
    font-size: 28px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: left;
    color: linear-gradient(0deg, #101828, #101828),
      linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  `;

  const handleAddCompany = () => {
    dispatch(setSelectedPage({ type: "companies" }));
    dispatch(setSelectedCompanyPage({ type: "create" }));
  }

  const handleAddContact = () => {
    dispatch(setSelectedPage({ type: "contacts" }));
    dispatch(setSelectedContactPage({ type: "create" }));
  }

  return (
    <Flex justify="space-between" mx={10} align="center">
      <Heading>Welcome back</Heading>
      <Box>
        <Button
          style={{
            borderRadius: "8px",
            paddingTop: "8px",
            paddingBottom: "8px",
            color: "#344054",
            paddingLeft: "14px",
            border: "1px solid #D0D5DD",
            paddingRight: "14px",
            marginRight: "10px",
          }}
          radius="xs"
          size="xs"
          fw={600}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={companyIcon} alt="Company" />
          }
          color="dark"
          variant="outline"
          onClick={handleAddCompany}
        >
          Add Company
        </Button>

        <Button
          style={{
            borderRadius: "8px",
            paddingTop: "8px",
            paddingBottom: "8px",
            color: "#344054",
            paddingLeft: "14px",
            border: "1px solid #D0D5DD",
            paddingRight: "14px",
          }}
          radius="xs"
          size="xs"
          fw={600}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={contactIcon} alt="Contact" />
          }
          color="dark"
          variant="outline"
          onClick={handleAddContact}
        >
          Add Contact
        </Button>
      </Box>
      {
        showNoteCreateModal && <CreateNoteModal showNoteCreateModal={showNoteCreateModal} />
      }
    </Flex>
  );
}

export default Dashboard;
