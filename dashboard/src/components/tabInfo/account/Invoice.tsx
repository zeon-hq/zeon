import Checkout from "components/ui-components/Checkout";
import InvoiceDiv from "components/ui-components/InvoiceDiv";
import React from "react";

type Props = {};

const Invoice = (props: Props) => {
  return (
    <>
      <InvoiceDiv date="27 Aug 2020" paid={true} />
      <InvoiceDiv date="27 Aug 2020" paid={false} />
      <InvoiceDiv date="27 Aug 2020" paid={false} />
      
      {/* <Checkout/> */}
    </>
  );
};

export default Invoice;
