
import plusIcon from "assets/plus.svg"
import saveIcon from "assets/save.svg"
import { labelStyles } from "crm/styles"
import CreateDataFieldModal from "./CreateDataFieldModal"
import styled from "styled-components"
import PanelLabel from "components/widget/PanelLabel"
import { useEffect, useState } from "react"
import { TextInput } from "@mantine/core"
import { CRMResourceType } from "crm/type"
import { addAdditionalFields, fetchDataModel } from "service/CRMService"
import { showNotification } from "@mantine/notifications"

interface AdditionalDataProps {
  resourceId: string | undefined
  type: "contact" | "company"
  additionalValue: any
}

const Container = styled.div`
  margin-top: 15px;
  padding: 0% 4%;
  height: calc(100vh - 39px);
  overflow: auto;
`

const View = styled.div`
  margin-top: 15px;
`

export const AdditonalData = ({ resourceId, type,additionalValue }: AdditionalDataProps) => {
  const [additonalData, setAdditonalData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textInputValues, setTextInputValues] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (!resourceId) return;
    fetchDataModel(
      resourceId,
      type === "contact" ? CRMResourceType.CONTACT : CRMResourceType.COMPANY
    ).then((res) => {
      setAdditonalData(res?.data?.fields);
    });
  }, [resourceId, type]);

  const handleTextInputChange = (fieldName: string, value: string) => {
    setTextInputValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleSaveButtonClick = async () => {
    if (resourceId) {
      setLoading(true);
      const res = await addAdditionalFields(
        resourceId,
        type === "contact" ? "contacts" : "companies",
        { fields: textInputValues }
      );
      showNotification({
        title: "Success",
        message: "Additional data updated successfully",
        color: "blue",
      });
      setLoading(false);
    } else {
      showNotification({
        title: "Error",
        message: "Failed to update additional data. Resource id not found",
        color: "red",
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <PanelLabel
        labelTitle="Additional Data"
        icon={plusIcon}
        buttonIcon={saveIcon}
        iconOnClick={() => setShowModal(true)}
        isButton={true}
        buttonDisabled={Object.keys(textInputValues).length === 0}
        buttonLabel="Save"
        onButtonClick={handleSaveButtonClick}
        loading={loading}
      />

      <View>
        {additonalData?.map((data) => (
          <TextInput
            key={data.name}
            label={data.name}
            placeholder={data.label}
            defaultValue={additionalValue?.[data.name] || ""}
            radius="md"
            labelProps={{ style: labelStyles }}
            onChange={(event) =>
              handleTextInputChange(data.name, event.currentTarget.value)
            }
          />
        ))}
      </View>

      {showModal && resourceId && (
        <CreateDataFieldModal
          resourceId={resourceId}
          resourceType={
            type === "contact"
              ? CRMResourceType.CONTACT
              : CRMResourceType.COMPANY
          }
          setShowModal={setShowModal}
          setAdditonalData={setAdditonalData}
          alreadyAddedFields={additonalData}
        />
      )}
    </Container>
  );
};

// ... other imports remain the same

// export const AdditionalData = ({
//   resourceId,
//   type,
//   additionalValue,
// }: AdditionalDataProps) => {
//   // ... other states and effects remain the same
//   const [additonalData, setAdditonalData] = useState<any[]>([])
//   const [showModal, setShowModal] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [textInputValues, setTextInputValues] = useState<{
//     [key: string]: string
//   }>({})
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { isDirty },
//   } = useForm({
//     defaultValues: additionalValue || {},
//   })

//   const handleSaveButtonClick = handleSubmit(async (data) => {
//     // ... your save logic here using 'data' instead of 'textInputValues'
//     if (resourceId) {
//             setLoading(true);
//             const res = await addAdditionalFields(
//               resourceId,
//               type === "contact" ? "contacts" : "companies",
//               { fields: textInputValues }
//             );
//             showNotification({
//               title: "Success",
//               message: "Additional data updated successfully",
//               color: "blue",
//             });
//             setLoading(false);
//           } else {
//             showNotification({
//               title: "Error",
//               message: "Failed to update additional data. Resource id not found",
//               color: "red",
//             });
//             setLoading(false);
//           }
//   })

//   const formValues = watch() // This is to watch all form values for changes

//   useEffect(() => {
//     if (!resourceId) return
//     fetchDataModel(
//       resourceId,
//       type === "contact" ? CRMResourceType.CONTACT : CRMResourceType.COMPANY
//     ).then((res) => {
//       setAdditonalData(res?.data?.fields)
//     })
//   }, [resourceId, type])

//   return (
//     <Container>
//       {isDirty && (
//         <PanelLabel
//           labelTitle="Additional Data"
//           icon={plusIcon}
//           buttonIcon={saveIcon}
//           iconOnClick={() => setShowModal(true)}
//           isButton={true}
//           buttonDisabled={Object.keys(textInputValues).length === 0}
//           buttonLabel="Save"
//           onButtonClick={handleSaveButtonClick}
//           loading={loading}
//         />
//       )}

//       <View>
//         {additonalData?.map((data) => (
//           <Controller
//             control={control}
//             name={data.name}
//             render={({ field }) => (
//               <TextInput
//                 {...field} // This spreads the `onChange`, `onBlur`, `value`, etc.
//                 label={data.name}
//                 placeholder={data.label}
//                 radius="md"
//                 labelProps={{ style: labelStyles }}
//               />
//             )}
//           />
//         ))}
//       </View>

//       {/* ... Modal and other parts of the component remain the same */}
//     </Container>
//   )
// }
