import styled from "styled-components"

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  overflow-y: none;
`;

export const InfoContainer = styled.div`
  height: 90vh;
  overflow-y: auto;
`;

export const WidgetContainer = styled.div`
  padding: 20px;
  z-index:0;
`

export const MainDiv = styled.div`
  width: 100%;
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  right: 20px;
  position: sticky;
  top:0px;
`

