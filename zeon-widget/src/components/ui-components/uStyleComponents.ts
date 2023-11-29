import styled from "styled-components";

interface TextProps {
  size: "large" | "medium" | "small";
  weight: "bold" | "normal";
  color ?: string;
  linkColor ?: string;
}


export const Text = styled.p<TextProps>`
  color: ${(props) => props.color || "black"};
  font-size: ${(props) =>
    props.size === "large"
      ? "20px"
      : props.size === "medium"
      ? "14px"
      : "12px"};
  font-weight: ${(props) =>
    props.weight === "bold"
      ? "600"
      : props.weight === "normal"
      ? "400"
      : "400"};
    line-height: 155%;
    margin:8px 0px 8px 0px ;
    word-break:break-word ;

    a {
      color: ${(props) => props.linkColor || "blue"};
    }

`;


export const BrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  /* justify-content:center; */
  gap: 4px;
  margin-top: 16px;

  // on hover turn cursor to pointer
  &:hover {
    cursor: pointer;
  }
`;