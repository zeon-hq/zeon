import { Box, Button, Flex, Image, MantineProvider } from "@mantine/core";
import companyIcon from "assets/companies.svg";
import editIcon from "assets/edit.svg";
import trashIcon from "assets/trash.svg";
import {
    MRT_GlobalFilterTextInput,
    MRT_Row,
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCompanyPage } from "reducer/crmSlice";

export type Company = {
  id: number;
  company: string;
  employeeCount: number;
  annualRevenue: number;
  country: string;
  lastInteraction: string;
};

const companyData: Company[] = [
  {
    id: 1,
    company: "Company A",
    employeeCount: 100,
    annualRevenue: 1000000,
    country: "USA",
    lastInteraction: "2022-12-10",
  },
  {
    id: 2,
    company: "Company B",
    employeeCount: 50,
    annualRevenue: 500000,
    country: "Canada",
    lastInteraction: "2022-11-15",
  },
  {
    id: 3,
    company: "Company C",
    employeeCount: 75,
    annualRevenue: 750000,
    country: "UK",
    lastInteraction: "2022-11-30",
  },
  // Add more company objects as needed
];

const CompaniesTable = () => {
  const [maxAvailableWidth, setMaxAvailableWidth] = useState(0);
  const dispatch = useDispatch();

  // Calculate maxAvailableWidth when the component mounts
  useEffect(() => {
    const container = document.querySelector(".ztable");
    if (container) {
      const containerWidth = container.clientWidth;
      setMaxAvailableWidth(containerWidth - 50);
    }
  }, []);

  const ratios = [0.8, 4.0, 1.2, 1.2, 1.2, 1.2, 1.0];

  const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);

  const unitWidth = maxAvailableWidth / totalRatio;

  const columnSizes = ratios.map((ratio) => ratio * unitWidth);

  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: columnSizes[0],
      },
      {
        accessorKey: "company",
        header: "Company",
        size: columnSizes[1],
      },
      {
        accessorKey: "employeeCount",
        header: "Employee Count",
        size: columnSizes[2],
      },
      {
        accessorKey: "annualRevenue",
        header: "Annual Revenue",
        size: columnSizes[3],
      },
      {
        accessorKey: "country",
        header: "Country",
        size: columnSizes[4],
      },
      {
        accessorKey: "lastInteraction",
        header: "Last Interaction",
        size: columnSizes[5],
      },
      {
        id: "actions",
        header: "Actions",
        size: columnSizes[6],
        Cell: ({ row }) => (
          <Flex gap="sm" style={{ cursor: "pointer" }}>
            <Image
              maw={15}
              src={trashIcon}
              alt="delete"
              onClick={() => handleDelete(row)}
            />
            <Image
              maw={15}
              src={editIcon}
              alt="edit"
              onClick={() => handleEdit(row)}
            />
          </Flex>
        ),
      },
    ],
    [columnSizes]
  );

  const handleDelete = (row: MRT_Row<Company>) => {
    // Handle the delete action here
    alert(`Deleting company with ID: ${row.getValue("id")}`);
  };

  const handleEdit = (row: MRT_Row<Company>) => {
    // Handle the edit action here
    alert(`Editing company with ID: ${row.getValue("id")}`);
  };

  const handleEmail = (row: MRT_Row<Company>) => {
    // Handle the email action here
    alert(`Sending email to company with ID: ${row.getValue("id")}`);
  };

  const table = useMantineReactTable({
    columns,
    data: companyData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    initialState: { showGlobalFilter: true },
    mantineSearchTextInputProps: {
      placeholder: "Search Companies",
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        dispatch(setSelectedCompanyPage({ type: "view" }));
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    mantineTableProps: {
      withColumnBorders: true,
      withBorder: true,
      sx: {
        border: "none",
        boxShadow: "none",
      },
    },
    renderTopToolbar: ({ table }) => {
      const addCompany = () => {
        dispatch(setSelectedCompanyPage({ type: "create" }));
      };

      return (
        <Flex p="md" justify="space-between">
          <Flex gap="xs">
            <MRT_GlobalFilterTextInput table={table} />
          </Flex>
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
              <Image maw={16} mx="auto" src={companyIcon} alt="add company" />
            }
            color="dark"
            variant="outline"
            onClick={addCompany}
          >
            Add Company
          </Button>
        </Flex>
      );
    },
  });

  return (
    <Box className="ztable">
      <MantineProvider
        theme={{
          primaryColor: "blue",
          primaryShade: 8,
        }}
      >
        <MantineReactTable table={table} />
      </MantineProvider>
    </Box>
  );
};

export default CompaniesTable;
