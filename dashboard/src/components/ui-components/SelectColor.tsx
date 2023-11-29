import { ColorPicker, Flex, Grid, Space, Text } from "@mantine/core";
import paintColor from "assets/paintColor.svg";
import { Label } from "components/ui-components";
import { useState } from "react";
import styled from "styled-components";
interface ISelectColor {
  value: string;
  label: string;
  description?: string;
  handleChange: (value: string) => void;
}

const StyledButton = styled.button`
  height: 36px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 152px;
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #d0d5dd;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledInput = styled.input`
  height: 36px;
  width: 454px;
  padding: 8px 12px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: 0px solid white;
  border-top: 1px solid #d0d5dd;
  border-bottom: 1px solid #d0d5dd;
  border-left: 1px solid #d0d5dd;
`;

const StyledDescription = styled.p`
  color: #475467;
  /* Text sm/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-top: 12px;
`;

const TextInputLabel = styled(Text)`
color: #344054;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: 20px; 
margin-bottom:6px;
`

const SelectColor = ({
  value,
  handleChange,
  label,
  description,
}: ISelectColor) => {
  const [showTopBannerColorPicker, setShowTopBannerColorPicker] =
    useState(false);

  return (
    <>
      <div
        style={{ paddingLeft: "9px", display: "flex", flexDirection: "column" }}
      >
        <TextInputLabel>{label}</TextInputLabel>
        <Space mt={"15px"} />
        <Grid>
          <Flex>
            <StyledInput
              value={value}
              placeholder={"Enter color to be picked"}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
            <StyledButton
              onClick={() => setShowTopBannerColorPicker((prev) => !prev)}
            >
              <img src={paintColor} style={{ paddingRight: "5px" }} />
              Select Color
            </StyledButton>
          </Flex>
          <Grid.Col span={3}>
            {showTopBannerColorPicker && (
              <ColorPicker
                format="hex"
                value={value}
                onChange={(color: string) => {
                  handleChange(color);
                }}
              />
            )}
          </Grid.Col>
        </Grid>
        {description &&
        <StyledDescription>{description}</StyledDescription>}
      </div>
    </>
  );
};

export default SelectColor;
