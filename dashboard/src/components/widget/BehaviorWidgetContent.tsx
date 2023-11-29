import { Button, Textarea, TextInput } from "@mantine/core";
import { Text } from "components/ui-components/Dashboard.styles";
import useDashboard from "hooks/useDashboard";
import { AiOutlineSend } from "react-icons/ai";

type Props = {};

const BehaviorWidgetContent = (props: Props) => {
  const { channelsInfo, selectedPage } = useDashboard();
  const behaviorDetails = channelsInfo[selectedPage.name]?.behavior;
  const appearanceDetails = channelsInfo[selectedPage.name]?.appearance;

  return (
    <>
      <div>
        <Text size="medium" weight="bold">
          {behaviorDetails.widgetBehavior.emailTitle}
        </Text>
        <Text size="small" weight="normal">
          {behaviorDetails.widgetBehavior.subTitle}
        </Text>
        <TextInput
          placeholder={
            behaviorDetails.widgetBehavior.placeholderTextForEmailCapture
          }
          required
        />
        <Textarea
          placeholder={
            behaviorDetails.widgetBehavior.placeholderTextForEmailCapture
          }
          label="Message"
          autosize
          minRows={8}
          py="sm"
        />
        <Button
          radius="md"
          style={{
            backgroundColor: `${appearanceDetails?.newConversationButton?.buttonColor}`,
            color: `${appearanceDetails?.newConversationButton?.textColor}`,
          }}
          fullWidth
          leftIcon={
            <AiOutlineSend
              color={appearanceDetails?.newConversationButton?.textColor}
              size={14}
            />
          }
          loaderPosition="right"
          type="submit"
        >
          Send Message
        </Button>
      </div>
    </>
  );
};

export default BehaviorWidgetContent;
