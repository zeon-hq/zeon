import { Flex, Switch } from "@mantine/core";
import { TextDesc, TextHeading } from "components/details/inbox/inbox.styles";

interface ISwitchWithLabel {
  onClick: (e: any) => void;
  value: boolean;
  heading?: string;
  description?: string;
}

const SwitchWithLabel = ({
  onClick,
  value,
  heading,
  description,
}: ISwitchWithLabel) => {
  return (
    <Flex w={"100%"} justify={"space-between"} align={"center"}>
      <div className="">
      {heading &&
        <TextHeading>{heading}</TextHeading>}

        {description && <TextDesc>{description}</TextDesc>}
      </div>
      <Switch
        checked={value || false}
        onChange={(e) => {
          onClick(e);
        }}
      />
    </Flex>
  );
};

export default SwitchWithLabel;
