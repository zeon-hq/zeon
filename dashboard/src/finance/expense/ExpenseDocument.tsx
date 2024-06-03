// import { FlexBox } from "finance/styles";
// import AddInvoice from "assets/Illustration.svg";
// import { Button } from "@mantine/core";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import exp from "constants";

// import React, { ReactNode, useCallback, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import useFinance from "finance/useFinance";
// import { isEmpty } from "lodash";
// import axios from "axios";
// import { showNotification } from "@mantine/notifications";
// import { useDispatch } from "react-redux";
// import { setCreateMode, updatedSelectedExpense } from "reducer/financeSlice";
// import { getConfig as Config } from "config/Config";
// import styled from "styled-components";
// import Loader from "components/ui-components/Loader";

// const MyDocViewer = styled(DocViewer)`
//   height: 90%;
//   & #pdf-controls {
//     box-shadow: none;
//   }

//   & #pdf-download {
//     box-shadow: none;
//   }

//   & #pdf-zoom-out {
//     box-shadow: none;
//   }
//   & #pdf-zoom-in {
//     box-shadow: none;
//   }
//   & #pdf-zoom-reset {
//     box-shadow: none;
//   }

//   & #pdf-pagination-prev {
//     box-shadow: none;
//   }

//   & #pdf-pagination-next {
//     box-shadow: none;
//   }
// `;

// const Text = styled.p`
//   font-size: 14px;
//   font-weight: 400;
//   text-align: center;
//   margin-top: 12px;
// `;

// const FINACE_API = Config("FINANCE_API_DOMAIN");

// function MyDropzone({
//   callback,
//   component,
// }: {
//   callback: (data: any) => void;
//   component?: ReactNode;
// }) {
//   const [loading, setLoading] = React.useState(false);
//   const { selectedExpense, expenseCreateMode } = useFinance();
//   const dispatch = useDispatch();
//   const uploadFile = async (files: any[], selectedExpense: any) => {
//     setLoading(true);
//     files.forEach(async (file) => {
//       let formData = new FormData();
//       formData.append("image", file);
//       try {
//         const response = await axios.post(
//           `${FINACE_API}/expense/upload`,
//           formData,
//           {
//             onUploadProgress: (progressEvent) => {
//               if (progressEvent) {
//               }
//             },
//           }
//         );

//         const data = response.data;
//         setLoading(false);
//         // callback({...data.s3Url});
//         const obj = {
//           url: data.s3Url.s3Url,
//           key: data.s3Url.key,
//           description: data.s3Url.key,
//         };
//         if (!selectedExpense || isEmpty(selectedExpense)) {
//           dispatch(
//             setCreateMode({
//               attachedDocuments: [obj],
//             })
//           );
//         } else {
//           dispatch(
//             updatedSelectedExpense({ key: "attachedDocuments", value: [obj] })
//           );
//         }
//       } catch (e) {
//         console.error(e);
//         showNotification({
//           title: "Error",
//           message: "Please upload a valid file",
//           color: "red",
//         });
//         setLoading(false);
//       }
//     });
//   };

//   const onDropAccepted = useCallback(
//     (acceptedFiles: any) => {
//       uploadFile(acceptedFiles, selectedExpense);
//     },
//     [selectedExpense, expenseCreateMode] // eslint-disable-line
//   );

//   const onDropRejected = useCallback((rejectedFile: any) => {
//     rejectedFile.forEach((file: any) => {
//       file.errors.forEach((error: any) => {
//         showNotification({
//           title: error.message,
//           message: "Please upload a valid file",
//           color: "red",
//         });
//       });
//     });
//   }, []); // eslint-disable-line

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDropAccepted,
//     onDropRejected,
//     multiple: false,
//     accept: {
//       "image/*": [".png", ".jpeg", ".jpg"],
//       // pdf
//       "application/pdf": [".pdf"],
//     },
//     // max size is 5mb
//     maxSize: 5242880,
//   });

//   useEffect(() => {
//     console.log("selectedExpense", selectedExpense);
//   }, [selectedExpense, expenseCreateMode]);

//   return loading ? (
//     <Loader />
//   ) : (
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />
//       {isDragActive ? (
//         <Text>Drop the files here ...</Text>
//       ) : component ? (
//         component
//       ) : (
//         <Text>Click Here to select files</Text>
//       )}
//     </div>
//   );
// }

// type Props = {};

// const ExpenseDocument = (props: Props) => {
//   const { selectedExpense, expenseCreateMode } = useFinance();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = React.useState(false); // eslint-disable-line

//   const callBack = (data: { s3Url: string; key: string }) => {
//     const obj = {
//       url: data.s3Url,
//       key: data.key,
//       description: data.key,
//     };
//     if (!selectedExpense || isEmpty(selectedExpense) || expenseCreateMode) {
//       dispatch(
//         setCreateMode({
//           attachedDocuments: [obj],
//         })
//       );
//     } else {
//       dispatch(
//         updatedSelectedExpense({ key: "attachedDocuments", value: [obj] })
//       );
//     }
//   };

//   const currAttachedDocuments: any = isEmpty(selectedExpense)
//     ? expenseCreateMode?.attachedDocuments
//     : selectedExpense?.attachedDocuments;

//   let docs = currAttachedDocuments?.map((doc: any) => {
//     return {
//       uri: doc.url,
//     };
//   });

//   useEffect(() => {
//     console.log("selectedExpense", selectedExpense);
//   }, [selectedExpense, expenseCreateMode]); // eslint-disable-line

//   return (
//     <>
//       <div>
//         {loading ? (
//           <Loader />
//         ) : isEmpty(docs) ? (
//           <>
//             <FlexBox style={{ marginTop: "50%" }}>
//               <img
//                 style={{
//                   margin: "auto",
//                 }}
//                 src={AddInvoice}
//                 alt="Add Invoice"
//               />
//             </FlexBox>
//             <MyDropzone callback={callBack} />
//           </>
//         ) : (
//           <>
//             <MyDocViewer
//               config={{
//                 header: { disableHeader: true },
//                 //@ts-ignore
//                 pdfZoom: {
//                   defaultZoom: 0.8,
//                 },
//               }}
//               documents={docs || []}
//               pluginRenderers={DocViewerRenderers}
//               style={{ height: "90%" }}
//             />
//             <MyDropzone
//               callback={callBack}
//               component={
//                 <Button variant="subtle" fullWidth>
//                   {" "}
//                   Upload another document
//                 </Button>
//               }
//             />
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default ExpenseDocument;

const ExpenseDocument = () => {
  return <div>ExpenseDocument</div>;
}

export default ExpenseDocument;

// Path: dashboard/src/finance/expense/ExpenseListing.tsx
