import { Box, Chip, Grid, Space, Text } from "@mantine/core";
import UserDeleteIcon from "assets/user_remove_icon.svg";
type Props = {
  email: string;
  rank: string | undefined;
  status: string | undefined;
  modules: string | undefined;
  onClick:() => void;
  hideDeleteBtn:boolean;
};

const AdminDiv = ({
  email,
  rank,
  status,
  modules,
  onClick,
  hideDeleteBtn
}: Props) => {

  return (
    <Box sx={{ borderBottom: "1px solid #EAECF0" }}>
      <Space h={8}></Space>
      <Grid p="0px 24px">
        <Grid.Col span={4}>
          <Text size="sm" color="gray">
            {email}{" "}
          </Text>
        </Grid.Col>
        <Grid.Col span={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Text
            style={{
              borderRadius: "4px",
              border: "1px solid black",
              padding: "2px 8px",
              height: "25px",
              fontFamily: "Inter",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 500,
            }}
          >
            {status}
          </Text>
        </Grid.Col>{" "}
        <Grid.Col span={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Chip variant="light" color="blue" radius="sm">
            {modules}
          </Chip>
        </Grid.Col>
        <Grid.Col span={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Chip variant="light" radius="sm">
            {rank}
          </Chip>
        </Grid.Col>{" "}
        <Grid.Col span={2} sx={{ display: "flex", justifyContent: "center" }}>
        {!hideDeleteBtn && 
          <img
          src={UserDeleteIcon}
          width={"20px"}
          alt="delete"
          onClick={onClick}
          style={{ margin: "10px", cursor: "pointer" }}
          />
        }
          {/* <img
            src={UserEditIcon}
            width={"20px"}
            style={{ margin: "10px", cursor: "pointer" }}
          /> */}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default AdminDiv;
