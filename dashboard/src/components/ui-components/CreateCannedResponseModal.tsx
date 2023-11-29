import { Badge, Box, Flex, Input, Text, Textarea } from "@mantine/core";
import { Button, Modal, Space } from "@mantine/core";
import { useClipboard, useInputState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  createCannedResponse,
  updateCannedResponse,
} from "service/DashboardService";

type Props = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  id?: string;
  channelId: string;
};

const CreateCannedResponseModal = ({
  opened,
  onClose,
  title = "",
  message = "",
  id = "",
  channelId,
}: Props) => {
  const [newTitle, setTitle] = useInputState(title);
  const [newMessage, setMessage] = useInputState(message);
  const clipboard = useClipboard({ timeout: 500 });

  const onSave = async () => {
    try {
      if (!id) {
        await createCannedResponse(channelId, newTitle, newMessage);

        showNotification({
          title: "Success",
          message: "Canned Response Created",
          color: "green",
        });
      } else {
        // update
        await updateCannedResponse(id, newTitle, newMessage);
        showNotification({
          title: "Success",
          message: "Canned Response Updated",
          color: "green",
        });
      }

      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error Creating Canned Response",
        color: "red",
      });
    }
  };

  const handleCopy = (text: string) => {
    clipboard.copy(text);
    showNotification({
      title: "Copied",
      message: "Copied to clipboard",
      color: "green",
    });
  };

  return (
    <>
      <Modal
         yOffset="20vh" 
         xOffset={0}
        opened={opened}
        onClose={() => onClose()}
        title="Add Canned Response"
      >
        <Box>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>
            {" "}
            Response Name{" "}
          </Text>
          <Input
            defaultValue={title}
            placeholder="Enter Response Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <Space h="10px" />
          <Text style={{ fontSize: "14px", fontWeight: "600" }}> Content </Text>
          <Textarea
            autosize
            defaultValue={message}
            minRows={10}
            placeholder="Enter Response Message"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </Box>
        <Space h="10px" />
        <Box>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>
            {" "}
            Available Parameters{" "}
          </Text>
          <Space h="10px" />
          <Badge
            onClick={() => handleCopy("{useremail}")}
            color="blue"
            variant="filled"
          >
            {" "}
            User Email
          </Badge>
        </Box>

        <Box>
          <Space h="10px" />
          <Flex gap="10px" justify="end">
            <Button
              radius="md"
              onClick={() => onClose()}
              variant="outline"
              color="dark"
            >
              {" "}
              Cancel{" "}
            </Button>
            <Button radius="md" onClick={() => onSave()} className="primary">
              {" "}
              Save{" "}
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};

export default CreateCannedResponseModal;
