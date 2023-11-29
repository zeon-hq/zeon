import { Button, Flex } from "@mantine/core";
import ReadDocsButton from "components/ui-components/Button/ReadDocsButton";

interface ICreateChannelFooter {
    onNextClick:() => void;
    onCancelClick:() =>void;
    ctaButtonTitle: string;
    loading:boolean;
}

const CreateChannelFooter = ({onNextClick, onCancelClick, loading, ctaButtonTitle}:ICreateChannelFooter) => {
  return (
    <Flex justify={"space-between"}>
    <ReadDocsButton />
    <Flex>
      <Button radius={"8px"} variant="default" onClick={()=>{
onCancelClick();
      }}>
        Cancel
      </Button>
      <Button 
      loading={loading}
      onClick={()=>{
        onNextClick();
      }} radius={"8px"} ml={"12px"} bg={"#3C69E7"}>
        {ctaButtonTitle}
      </Button>
    </Flex>
  </Flex>
  )
}

export default CreateChannelFooter