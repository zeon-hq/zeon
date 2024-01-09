import styled from "styled-components";

export const FinanceContainer = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 50%;
`;

export const ExpenseListingContainer = styled.div`
  height: calc(100vh - 60px);
  overflow-y: hidden;
  border-right: 1px solid #e0e0e0;
`;

export const ExpenseFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export const SingleExpenseContainer = styled.div`
  height: calc(100vh - 186px);
  overflow-y: auto;
`;

export const ExpenseListFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e0e0e0;
  background: #eaecf0;
  
`;

export const ExpenseListFooterText = styled.div`
  padding:  8px 24px;
  color: #475467;
  font-weight: 600;
  font-size: 12px;
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

export const ActionText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #3054b9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;
