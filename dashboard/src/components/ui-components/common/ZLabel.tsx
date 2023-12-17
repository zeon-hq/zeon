import { Text, TextProps } from "@mantine/core";

type Props = {
  label: string;
};

const styles = {
  root: {
    fontSize: "12px",
    fontWeight: "500",
  },
};

const ZLabel = ({ label }: Props & TextProps) => {
  return <Text sx={{
    fontSize: "14px",
    fontWeight: 500,
    color: "#344054",
  }}>{label as Props["label"]}</Text>;
};

export default ZLabel;
