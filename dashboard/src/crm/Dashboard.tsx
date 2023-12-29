import { Box, Flex, Button, Image } from "@mantine/core";
import styled from "styled-components";
import companyIcon from "assets/companies.svg";
import contactIcon from "assets/contacts.svg";

function Dashboard() {
  const Heading = styled.h1`
    font-size: 28px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0em;
    text-align: left;
    color: linear-gradient(0deg, #101828, #101828),
      linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  `;

  return (
    <Flex justify="space-between" align="center">
      <Heading>Welcome back, Aryan</Heading>
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
            marginRight: "10px",
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
        >
          Add Contact
        </Button>
      </Box>
    </Flex>
  );
}

export default Dashboard;
