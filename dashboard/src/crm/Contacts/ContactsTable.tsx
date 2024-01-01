import { Box, Button, Flex, Image, MantineProvider } from "@mantine/core";
import editIcon from "assets/edit.svg";
import mailIcon from "assets/mail.svg";
import trashIcon from "assets/trash.svg";
import userPlus from "assets/userPlus.svg";
import Contacts from "crm/type";
import useDashboard from "hooks/useDashboard";
import {
  MRT_GlobalFilterTextInput,
  MRT_Row,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedContactPage } from "reducer/crmSlice";
import { fetchContacts } from "service/CRMService";

const ContactsTable = () => {
  const [maxAvailableWidth, setMaxAvailableWidth] = useState(0);
  const dispatch = useDispatch();
  const { workspaceInfo } = useDashboard();

  // Calculate maxAvailableWidth when the component mounts
  useEffect(() => {
    const container = document.querySelector(".ztable");
    if (container) {
      const containerWidth = container.clientWidth;
      setMaxAvailableWidth(containerWidth - 50);
    }
  }, []);

  const [data, setData] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [row, setRow] = useState<any>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response = await fetchContacts(
          workspaceInfo.workspaceId,
          pagination.pageSize.toString(),
          pagination.pageIndex.toString()
        );
        setData(response.data.contacts);

        const totalCount = response.data.count;
        const totalPages = Math.ceil(totalCount / pagination.pageSize);
        setRow(totalPages);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, workspaceInfo.workspaceId]);

  const ratios = [0.8, 1.4, 4.0, 1.5, 2.0, 1.2];

  const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);

  const unitWidth = maxAvailableWidth / totalRatio;

  const columnSizes = ratios.map((ratio) => ratio * unitWidth);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
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
        accessorFn: (row) =>
          row.firstName && row.lastName
            ? `${row.firstName} ${row.lastName}`
            : "",
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
              onClick={(e) => handleDelete(e, row)}
            />
            <Image
              maw={15}
              src={editIcon}
              alt="edit"
              onClick={(e) => handleEdit(e, row)}
            />
            <Image
              maw={15}
              src={mailIcon}
              alt="mail"
              onClick={(e) => handleEmail(e, row)}
            />
          </Flex>
        ),
      },
    ],
    [columnSizes]
  );

  const handleDelete = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: MRT_Row<any>
  ) => {
    // Handle the delete action here
    // prevent default action
    event?.stopPropagation();
    alert(`Deleting employee with ID: ${row.getValue("id")}`);
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: MRT_Row<any>
  ) => {
    // Handle the edit action here
    event?.stopPropagation();
    alert(`Editing employee with ID: ${row.getValue("id")}`);
  };

  const handleEmail = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: MRT_Row<any>
  ) => {
    // Handle the email action here
    event?.stopPropagation();
    alert(`Sending email to employee with ID: ${row.getValue("id")}`);
  };

  const table = useMantineReactTable({
    columns,
    data: data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: true,
    onPaginationChange: setPagination,
    enableSorting: false,
    rowCount: row,
    initialState: { showGlobalFilter: true },
    mantineSearchTextInputProps: {
      placeholder: "Search Contacts",
    },
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        dispatch(setSelectedContactPage({ type: "view" }));
      },
      sx: {
        cursor: "pointer",
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
