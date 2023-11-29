import {
    Box,
    Button,
    Dialog,
    Space,
    Text
} from "@mantine/core";

interface IConfirmationDialog {
    opened: boolean;
    onClose: () => void;
    onCTAClick: () => void;
    headerTitle :string;
}
  
const ConfirmationDialog = ({opened, onClose, onCTAClick, headerTitle}:IConfirmationDialog) => {
  return (
    <Dialog
    opened={opened}
    withCloseButton
    onClose={onClose}
    size="lg"
    radius="md"
  >
    <Text size="sm" weight="bold">
      {headerTitle}
    </Text>
    <Space h="md" />
    <Box>
      <Button
        radius="md"
        mr="10px"
        onClick={onClose}
        variant="outline"
      >
        {" "}
        Cancel{" "}
      </Button>
      <Button
        radius="md"
        onClick={() => {
            onCTAClick()
        }}
        color="red"
        variant="outline"
      >
        {" "}
        Remove{" "}
      </Button>
    </Box>
  </Dialog>
  )
}

export default ConfirmationDialog