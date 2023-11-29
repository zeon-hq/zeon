import { Button } from "@mantine/core";
import DocsIcon from "assets/docs_icon.svg";

interface IShowDocs {
  hideDocIcon?:boolean;
}
const ReadDocsButton = ({hideDocIcon}:IShowDocs) => {
  return (
    <Button
    radius="md"
    leftIcon={!hideDocIcon ? <img src={DocsIcon} /> : <></>}
    style={{
      color: "black",
      backgroundColor: "white",
      borderColor: "white",
    }}
    onClick={()=>{
        
    }}
  >
    Read Docs
  </Button>
  )
}

export default ReadDocsButton