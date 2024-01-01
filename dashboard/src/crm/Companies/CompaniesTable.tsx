import { Box, Button, Flex, Image, MantineProvider } from "@mantine/core";
import companyIcon from "assets/companies.svg";
import editIcon from "assets/edit.svg";
import trashIcon from "assets/trash.svg";
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
import { setSelectedCompanyPage } from "reducer/crmSlice";
import { deleteCompany, fetchCompanies } from "service/CRMService";
import { companySizeFormatter, companyWorthFormatter } from "crm/utils";
import { da } from "date-fns/locale";

const CompaniesTable = () => {
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

  const ratios = [0.8, 3.0, 1.2, 1.2, 1.2, 1.2, 1.0];

  const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);

  const unitWidth = maxAvailableWidth / totalRatio;

  const columnSizes = ratios.map((ratio) => ratio * unitWidth);

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
        const response = await fetchCompanies(
          workspaceInfo.workspaceId,
          pagination.pageSize.toString(),
          pagination.pageIndex.toString()
        );
        setData(response.data.companies);

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
  }, [
    data.length,
    pagination.pageIndex,
    pagination.pageSize,
    workspaceInfo.workspaceId,
  ]);

  const dateFormatter = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "companyId",
        header: "ID",
        size: columnSizes[0],
      },
      {
        accessorKey: "name",
        header: "Company",
        size: columnSizes[1],
      },
      {
        accessorKey: "companySize",
        accessorFn: (row) =>
          row.companySize ? companySizeFormatter(row.companySize) : "",
        header: "Employee Count",
        size: columnSizes[2],
      },
      {
        accessorKey: "companyWorth",
        accessorFn: (row) =>
          row.companyWorth ? companyWorthFormatter(row.companyWorth) : "",
        header: "Annual Revenue",
        size: columnSizes[3],
      },
      {
        accessorKey: "location",
        header: "Location",
        size: columnSizes[4],
      },
      {
        accessorKey: "updatedAt",
        header: "Last Interaction",
        accessorFn: (row) => dateFormatter(row.updatedAt),
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
              onClick={(e) => handleDelete(e, row)}
            />
            <Image
              maw={15}
              src={editIcon}
              alt="edit"
              onClick={(e) => handleEdit(e, row)}
            />
          </Flex>
        ),
      },
    ],
    [pagination.pageIndex, pagination.pageSize, workspaceInfo.workspaceId]
  );

  const handleDelete = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: MRT_Row<any>
  ) => {
    e.stopPropagation();
    deleteCompany(row.getValue("companyId"));
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: MRT_Row<any>
  ) => {
    // Handle the edit action here
    e.stopPropagation();
    dispatch(
      setSelectedCompanyPage({ type: "edit", companyData: data[row.index] })
    );
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
      placeholder: "Search Companies",
    },
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        dispatch(
          setSelectedCompanyPage({ type: "view", companyData: data[row.index] })
        );
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
