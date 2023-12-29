import { Box } from '@mantine/core';
import useCrm from 'hooks/useCrm';
import ContactsDetails from './ContactsDetails';
import ContactsTable from './ContactsTable';
import CreateContact from './CreateContact';

function Contacts() {
    const { selectedContactPage } = useCrm();
    const { type } = selectedContactPage;

    const getPage = (pageName: string) => {
      switch (pageName) {
        case "all":
          return <ContactsTable />;
        case "create":
          return <CreateContact />;
        case "edit":
          return <CreateContact />; 
        case "view":
          return <ContactsDetails />;  
      }
    };
  
    return (
      <>
        <Box h="100vh" mt={"40px"} bg={"white"}>
            {getPage(type)}
        </Box>
      </>
    );
}

export default Contacts