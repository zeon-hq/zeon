import {
    Button,
    Modal,
    Space,
    Text
} from "@mantine/core";
import { Billing } from "components/tabInfo";
import { useNavigate } from "react-router";
import { logOutUtils } from "util/dashboardUtils";

interface ISubscribeModal {
    openModal:boolean;
}

const SubscribeModal = ({openModal}:ISubscribeModal) => {
  const navigate = useNavigate();

  return (
    <Modal
    yOffset="20vh" 
    xOffset={0}
      withCloseButton={false}
      size={"xl"}
      onClose={() => {}}
      title={
        <>
          <Text
            align="center"
            my={20}
            weight="500"
            style={{ fontSize: "24px" }}
          >
            {" "}
            Subscribe now to resume your services{" "}
          </Text>
        </>
      }
      opened={openModal}
    >
      <Billing />
      <Space h="md" />
      <Button
        radius="md"
        color="indigo"
        variant="outline"
        onClick={() => navigate("/workspaces")}
      >
        {" "}
        Go Back to Workspaces{" "}
      </Button>
      <Button
        radius="md"
        ml={"sm"}
        color="red"
        variant="outline"
        onClick={logOutUtils}
      >
        {" "}
        Logout{" "}
      </Button>
    </Modal>
  );
};

export default SubscribeModal;