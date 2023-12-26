import { ExpenseDocumentContainer, FlexBox } from "finance/styles";
import AddInvoice from "assets/addInvoice.svg";
import { Button } from "@mantine/core";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";


import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import useFinance from "finance/useFinance";
import { isEmpty } from "lodash";

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles:any) => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

type Props = {};

const ExpenseDocument = (props: Props) => {
  const {
    selectedExpense
  } = useFinance();
  let docs = selectedExpense?.attachedDocuments?.map((doc) => {
    return {
      uri: doc.url
    };
  });
  return (
    <>
      <div>
        {/* <FlexBox>
          <img src={AddInvoice} alt="Add Invoice" />
        </FlexBox>
       <MyDropzone /> */}
       <DocViewer config={{ header: { disableHeader: true } }} documents={docs || []} pluginRenderers={DocViewerRenderers} />;
      </div>
    </>
  );
};

export default ExpenseDocument;
