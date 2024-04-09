import { Flex, Switch } from "@mantine/core";
import { TextDesc, TextHeading } from "components/details/inbox/inbox.styles";

interface ISwitchWithLabel {
  onClick: (e: any) => void;
  value: boolean;
  heading?: string;
  description?: string;
  checkBoxFirst?: boolean;
}

const SwitchWithLabel = ({
  onClick,
  value,
  heading,
  description,
  checkBoxFirst = false,
}: ISwitchWithLabel) => {
  return (
    <Flex w={"100%"} justify={"space-between"} align={"center"}>
      {checkBoxFirst ? (
        <>
          <Switch
            checked={value || false}
            onChange={(e) => {
              onClick(e);
            }}
            color="indigo"
          />
          <div className="">
            {heading && (
              <TextHeading style={{ margin: "0px" }}>{heading}</TextHeading>
            )}

            {description && <TextDesc>{description}</TextDesc>}
          </div>
        </>
      ) : (
        <>
          <div className="">
            {heading && (
              <TextHeading style={{ margin: "0px" }}>{heading}</TextHeading>
            )}

            {description && <TextDesc>{description}</TextDesc>}
          </div>
          <Switch
            checked={value || false}
            onChange={(e) => {
              onClick(e);
            }}
            color="indigo"
          />
        </>
      )}
    </Flex>
  );
};

export default SwitchWithLabel;
