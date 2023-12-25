import { ExpenseDocumentContainer, FlexBox } from "finance/styles";
import React from "react";
import AddInvoice from "assets/addInvoice.svg";
import { Button } from "@mantine/core";

type Props = {};

const ExpenseDocument = (props: Props) => {
  return (
    <>
      <div>
        <FlexBox>
          <img src={AddInvoice} alt="Add Invoice" />
        </FlexBox>
        <Button variant="default">Add Invoice</Button>
      </div>
    </>
  );
};

export default ExpenseDocument;
