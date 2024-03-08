import { Box, Button, Flex, Image, Text } from "@mantine/core";

interface IPanelLabel {
  labelTitle: string;
  icon: any;
  buttonIcon?: any;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  iconOnClick: () => void;
  onButtonClick?: () => void;
  hideRightImage?: boolean;
  isButton?: boolean;
  loading ?: boolean;
}

const PanelLabel = ({
  labelTitle,
  icon,
  buttonIcon,
  buttonLabel,
  buttonDisabled,
  iconOnClick,
  onButtonClick,
  hideRightImage = false,
  isButton = false,
  loading = false
}: IPanelLabel) => {
  return (
    <Flex justify={"space-between"} align={"center"}>
      <Box
        style={{
          border: "1px solid #D0D5DD",
          borderRadius: "6px",
          paddingLeft: "8px",
          paddingRight: "8px",
          marginLeft: "0px",
        }}
      >
        <Text color="#344054" fw={"500"} fz="12px">
          {labelTitle}
        </Text>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        {!hideRightImage && (
          <Image
            style={{ cursor: "pointer" }}
            maw={20}
            onClick={iconOnClick}
            radius="md"
            src={icon}
          />
        )}

        {isButton && (
          <Button
            style={{
              borderRadius: "4px",
              color: "#FFFFFF",
              border: "1px solid #3054B9",
              background: "#3054B9",
              height: "24px",
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
            radius="xs"
            loading={loading}
            size="xs"
            fw={600}
            fs={{
              fontSize: "10px",
            }}
            leftIcon={<Image mx="auto" src={buttonIcon} alt="icon" />}
            color="dark"
            variant="outline"
            disabled={buttonDisabled}
            onClick={onButtonClick}
          >
            {buttonLabel}
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default PanelLabel;
