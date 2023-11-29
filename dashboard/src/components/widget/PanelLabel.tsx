import { Box, Flex, Image, Text } from "@mantine/core";


interface IPanelLabel {
    labelTitle:string;
    icon:any;
    iconOnClick: () => void;
    hideRightImage?:boolean;
}

const PanelLabel = ({labelTitle, icon, iconOnClick, hideRightImage=false}:IPanelLabel) => {
  return (
    <Flex justify={"space-between"} align={'center'}>
    <Box
      style={{
        border: "1px solid #D0D5DD",
        borderRadius: "6px",
        paddingLeft: "8px",
        paddingRight: "8px",
        marginLeft: "0px",
        marginRight: "12px",
      }}
    >
      <Text color="#344054" fw={"500"} fz="12px">
        {labelTitle}
      </Text>
    </Box>

{
!hideRightImage &&
    <Image
    style={{ cursor: "pointer" }}
    maw={20}
    onClick={iconOnClick}
    radius="md"
    src={icon}
    />
  }

  </Flex>
  )
}

export default PanelLabel