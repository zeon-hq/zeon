import PanelLabel from "components/widget/PanelLabel";
import plusIcon from "assets/plus.svg";
import saveIcon from "assets/save.svg";
import styled from "styled-components";
import { TextInput } from "@mantine/core";
import { labelStyles } from "crm/styles";
import { useEffect, useState } from "react";
import CreateDataFieldModal from "./CreateDataFieldModal";
import { CRMResourceType } from "crm/type";
import { addAdditionalFields, fetchDataModel } from "service/CRMService";

interface AdditionalDataProps {
  resourceId: string | undefined;
  type: "contact" | "company";
  additionalValue: any;
}

const Container = styled.div`
  margin-top: 15px;
  padding: 0% 4%;
`;

const View = styled.div`
  margin-top: 15px;
`;

export const AdditonalData = ({ resourceId, type,additionalValue }: AdditionalDataProps) => {
  const [additonalData, setAdditonalData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
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

  const handleSaveButtonClick = () => {
    if (resourceId) {
      const fieldsToUpdate = Object.keys(textInputValues).map((fieldName) => ({
        fieldName,
        value: textInputValues[fieldName],
      }));

      addAdditionalFields(
        resourceId,
        type === "contact" ? "contacts" : "companies",
        { fields: textInputValues }
      );
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
