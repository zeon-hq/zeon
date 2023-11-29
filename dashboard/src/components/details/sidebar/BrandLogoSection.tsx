import { Space } from "@mantine/core";
import ULogo from "assets/logowhite.svg";

type Props = {
  homePage?: boolean;
}

const BrandLogoSection = ({homePage}: Props) => {
  return (
    <>
        <div style={homePage ? {display:"flex",marginLeft:"8px", justifyContent:"center", marginTop:"70px"} : {}}>
            <img height={"40px"} src={ULogo}/>
        </div>
        <Space h={15} />
        
    </>
    
  )
}

export default BrandLogoSection