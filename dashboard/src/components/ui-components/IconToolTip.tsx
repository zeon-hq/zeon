import { Tooltip } from "@mantine/core";
import styled from "styled-components";

const ImageIcons = styled.img`
  padding-left: 4px;
`;

interface IIconToolTip {
    tooltipTitle:string;
    svgIcon:any;

}

const IconToolTip = ({svgIcon,tooltipTitle}:IIconToolTip) => {
  return (
    <Tooltip
      position="top-end"
      style={{
        maxWidth: "320px",
      }}
      label={tooltipTitle}
    >
      <ImageIcons src={svgIcon} />
    </Tooltip>
  );
};

export default IconToolTip;
