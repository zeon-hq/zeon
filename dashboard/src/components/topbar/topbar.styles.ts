import styled from "styled-components";

export const TopBarWrapper = styled.div`
width: 100%;
display: flex;
background-color: white;
justify-content: space-between;
justify-items: space-between; /* Note: justify-items is not a valid CSS property */
z-index: 1000;
border-bottom: 1px solid #eaecf0;
padding: 8px 16px;
`;

export const TopBarDivWrapper = styled.div`
display: flex;
align-content: center;
align-items: center;
gap: 14px;
`;

export const InnerDivWrapper = styled.div`
display: flex;
align-content: center;
align-items: center;
gap: 14px;
`;