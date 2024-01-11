import { ExpenseDocumentContainer, FlexBox } from "finance/styles";
import AddInvoice from "assets/addInvoice.svg";
import { Button } from "@mantine/core";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import React, { ReactNode, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useFinance from "finance/useFinance";
import { isEmpty } from "lodash";
import axios from "axios";
import notification from "components/utils/notification";
import { showNotification } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import {
  setCreateMode,
  setSelectedExpense,
  updatedSelectedExpense,
} from "reducer/financeSlice";
import { set } from "dot-prop";
import { getConfig as Config } from "config/Config";

const FINACE_API = Config("FINANCE_API_DOMAIN")

function MyDropzone({
  callback,
  component,
}: {
  callback: (data: any) => void;
  component?: ReactNode;
}) {
  const uploadFile = async (files: any[]) => {
    files.forEach(async (file) => {
      let formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          `${FINACE_API}/expense/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent) {
                let curProgress =
                  (progressEvent.loaded / (progressEvent?.total || 1)) * 100;
              }
            },
          }
        );

        const data = response.data;
        callback(data.s3Url);
      } catch (e) {
        console.error(e);
        showNotification({
          title: "Error",
          message: "Please upload a valid file",
          color: "red",
        });
      }
    });
  };

  const onDropAccepted = useCallback((acceptedFiles: any) => {
    uploadFile(acceptedFiles);
  }, []);

  const onDropRejected = useCallback((rejectedFile: any) => {
    rejectedFile.forEach((file: any) => {
      file.errors.forEach((error: any) => {
        showNotification({
          title: error.message,
          message: "Please upload a valid file",
          color: "red",
        });
      });
    });
  }, []);

  const getAcceptedFormat = (type: string): any => {
    // accept only pdf, png, jpeg, jpg
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      // pdf
      "application/pdf": [".pdf"],
    },
    // max size is 5mb
    maxSize: 5242880,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : component ? (
        component
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

type Props = {};

const ExpenseDocument = (props: Props) => {
  const { selectedExpense, expenseCreateMode } = useFinance();
  const dispatch = useDispatch();

  const callBack = (data: { s3Url: string; key: string }) => {
    const obj = {
      url: data.s3Url,
      key: data.key,
      description: data.key,
    };
    if (selectedExpense && isEmpty(selectedExpense)) {
      dispatch(
        setCreateMode({
          attachedDocuments: [obj],
        })
      );
    } else {
      dispatch(
        updatedSelectedExpense({ key: "attachedDocuments", value: [obj] })
      );
    }
  };

  const currAttachedDocuments:any = isEmpty(selectedExpense) ? expenseCreateMode?.attachedDocuments : selectedExpense?.attachedDocuments;

  let docs = currAttachedDocuments?.map((doc:any) => {
    return {
      uri: doc.url,
    };
  });

  return (
    <>
      <div>
        {isEmpty(docs) ? (
          <>
            <FlexBox>
              <img src={AddInvoice} alt="Add Invoice" />
            </FlexBox>
            <MyDropzone callback={callBack} />
          </>
        ) : (
          <>
            <DocViewer
              config={{ header: { disableHeader: true } }}
              documents={docs || []}
              pluginRenderers={DocViewerRenderers}
            />
            <MyDropzone
              callback={callBack}
              component={<Button fullWidth> Upload another document</Button>}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ExpenseDocument;
