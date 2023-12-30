import { Box, Button, Flex, Image, MantineProvider } from "@mantine/core";
import editIcon from "assets/edit.svg";
import mailIcon from "assets/mail.svg";
import trashIcon from "assets/trash.svg";
import userPlus from "assets/userPlus.svg";
import {
  MRT_GlobalFilterTextInput,
  MRT_Row,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedContactPage } from "reducer/crmSlice";

export type Employee = {
  id: number;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  startDate: string;
};

const data: Employee[] = [
  {
    id: 1,
    company: "Company A",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    jobTitle: "Manager",
    salary: 60000,
    startDate: "2022-01-15",
  },
  {
    id: 2,
    company: "Company B",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    jobTitle: "Engineer",
    salary: 75000,
    startDate: "2022-03-20",
  },
  {
    id: 3,
    company: "Company C",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    jobTitle: "Designer",
    salary: 55000,
    startDate: "2022-02-10",
  },
  // Add more employee objects as needed
];

const ContactsTable = () => {
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

  const ratios = [0.8, 1.4, 4.0, 1.5, 2.0, 1.2];

  const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);

  const unitWidth = maxAvailableWidth / totalRatio;

  const columnSizes = ratios.map((ratio) => ratio * unitWidth);

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
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
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: "Contact Name",
        size: columnSizes[2],
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "jobTitle",
        header: "Position",
        size: columnSizes[3],
      },
      {
        accessorKey: "email",
        header: "Email",
        size: columnSizes[4],
        enableClickToCopy: true,
      },
      {
        id: "actions",
        header: "",
        size: columnSizes[5],
        Cell: ({ row }) => (
          <Flex
            gap="sm"
            style={{
              cursor: "pointer",
            }}
          >
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
            <Image
              maw={15}
              src={mailIcon}
              alt="mail"
              onClick={() => handleEmail(row)}
            />
          </Flex>
        ),
      },
    ],
    [columnSizes]
  );

  const handleDelete = (row: MRT_Row<Employee>) => {
    // Handle the delete action here
    alert(`Deleting employee with ID: ${row.getValue("id")}`);
  };

  const handleEdit = (row: MRT_Row<Employee>) => {
    // Handle the edit action here
    alert(`Editing employee with ID: ${row.getValue("id")}`);
  };

  const handleEmail = (row: MRT_Row<Employee>) => {
    // Handle the email action here
    alert(`Sending email to employee with ID: ${row.getValue("id")}`);
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    initialState: { showGlobalFilter: true },
    mantineSearchTextInputProps: {
      placeholder: "Search Contacts",
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        dispatch(setSelectedContactPage({ type: "view" }));
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
      const addContact = () => {
        dispatch(setSelectedContactPage({ type: "create" }));
      };

      return (
        <Flex p="md" justify="space-between">
          <Flex gap="xs">
            {/* Import MRT sub-components */}
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
              <Image maw={16} mx="auto" src={userPlus} alt="add contact" />
            }
            color="dark"
            variant="outline"
            onClick={addContact}
          >
            Add Contact
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
        {/* Your table component */}
        <MantineReactTable table={table} />
      </MantineProvider>
    </Box>
  );
};

export default ContactsTable;
