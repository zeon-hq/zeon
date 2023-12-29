import { ExpenseDocumentContainer, FlexBox } from "finance/styles"
import AddInvoice from "assets/addInvoice.svg"
import { Button } from "@mantine/core"
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer"

import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import useFinance from "finance/useFinance"
import { isEmpty } from "lodash"
import axios from "axios"
import notification from "components/utils/notification"
import { showNotification } from "@mantine/notifications"
import { useDispatch } from "react-redux"
import { setSelectedExpense, updatedSelectedExpense } from "reducer/financeSlice"
import { set } from "dot-prop"

function MyDropzone({ callback }: { callback: (data: any) => void }) {
  const uploadFile = async (files: any[]) => {
    files.forEach(async (file) => {
      let formData = new FormData()
      formData.append("image", file)
      try {
        const response = await axios.post(
          "http://localhost:4001/expense/upload",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent) {
                let curProgress =
                  (progressEvent.loaded / (progressEvent?.total || 1)) * 100
              }
            },
          }
        )

        const data = response.data
        callback(data.s3Url)
      } catch (e) {
        console.error(e)
        showNotification({
          title: "Error",
          message: "Please upload a valid file",
          color: "red",
        })
      }
    })
  }

  const onDropAccepted = useCallback((acceptedFiles: any) => {
    uploadFile(acceptedFiles)
  }, [])

  const onDropRejected = useCallback((rejectedFile: any) => {
    rejectedFile.forEach((file: any) => {
      file.errors.forEach((error: any) => {
        showNotification({
          title: error.message,
          message: "Please upload a valid file",
          color: "red",
        })
      })
    })
  }, [])

  const getAcceptedFormat = (type: string): any => {
    // accept only pdf, png, jpeg, jpg
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
  }, [])
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
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  )
}

type Props = {}

const ExpenseDocument = (props: Props) => {
  const { selectedExpense } = useFinance()
  const dispatch = useDispatch()

  const callBack = (data: { s3Url: string; key: string }) => {
    const obj = {
      url: data.s3Url,
      key: data.key,
      description: data.key
    }
    dispatch(updatedSelectedExpense({ key:"attachedDocuments", value: [obj] }))
  }
  let docs = selectedExpense?.attachedDocuments?.map((doc) => {
    return {
      uri: doc.url,
    }
  })
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
          <DocViewer
            config={{ header: { disableHeader: true } }}
            documents={docs || []}
            pluginRenderers={DocViewerRenderers}
          />
        )}
      </div>
    </>
  )
}

export default ExpenseDocument
