import { Text, TextProps } from "@mantine/core";

type Props = {
  label: string;
};

const ZLabel = ({ label }: Props & TextProps) => {
  return <Text sx={{
    fontSize: "12px",
    fontWeight: 600,
    color: "#344054",
  }}>{label as Props["label"]}</Text>;
};

export default ZLabel;
