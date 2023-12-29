import { Box } from '@mantine/core';
import useCrm from 'hooks/useCrm';
import CreateCompany from './CreateCompany';
import CompaniesDetails from './CompaniesDetails';
import CompaniesTable from './CompaniesTable';

function Companies() {
    const { selectedCompanyPage } = useCrm();
    const { type } = selectedCompanyPage;

    const getPage = (pageName: string) => {
      switch (pageName) {
        case "all":
          return <CompaniesTable />;
        case "create":
          return <CreateCompany />;
        case "edit":
          return <CreateCompany />;
        case "view":
          return <CompaniesDetails />;
      }
    };
  
    return (
      <>
        <Box h="100vh" bg={"white"}>
            {getPage(type)}
        </Box>
      </>
    );
}

export default Companies;