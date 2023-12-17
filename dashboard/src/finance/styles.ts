import styled from "styled-components";

export const FinanceContainer = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 50%;
`;

export const ExpenseListingContainer = styled.div`
  height: calc(100vh - 100px);
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
`;

export const ExpenseDetailsContainer = styled.div`
  padding: 16px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
`;

export const ExpenseDocumentContainer = styled.div`
  height: calc(100vh - 100px);
  overflow-y: auto;
`;

export const ExpenseItem = styled.div<{ selected?: boolean }>`
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #eaecf0;
  background: ${(props) => (props?.selected ? "#f5f8ff" : "white")};

  &:hover {
    cursor: pointer;
    background: #f5f8ff;
  }
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Status = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  background-color: ${(props) => {
    switch (props.status) {
      case "paid":
        return "#039855";
      case "pending":
        return "#fdb022";
      case "unpaid":
        return "#ef6820";
      default:
        return "#00c853";
    }
  }};
  border-radius: 50%;
`;
