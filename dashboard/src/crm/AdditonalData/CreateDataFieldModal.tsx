import { Button, Modal, Text, TextInput } from "@mantine/core";
import React from "react";
import { labelStyles } from "../styles";
import { useForm } from "react-hook-form";
import { CRMResourceType } from "../type";
import { showNotification } from "@mantine/notifications";
import { createAdditionalFields } from "service/CRMService";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAdditonalData: React.Dispatch<React.SetStateAction<any[]>>;
  resourceType: CRMResourceType;
  resourceId: string;
  alreadyAddedFields: string[];
};

const CreateDataFieldModal = ({
  setShowModal,
  setAdditonalData,
  resourceId,
  resourceType,
  alreadyAddedFields
}: Props) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      label: "",
      type: "TEXT",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(alreadyAddedFields)
    try {
      const res = await createAdditionalFields(resourceId, resourceType, [
        ...alreadyAddedFields,
        data,
      ]);
      setAdditonalData(res?.data?.fields);
      showNotification({
        title: "Success",
        message: "Additional field created successfully",
        color: "blue",
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Note creation failed",
        color: "red",
      });
      setShowModal(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={() => {
        setShowModal(false);
      }}
      title="Create Attribute"
      size="md"
    >
      <Text mb={20} >Add additional data to this entity</Text>
      <TextInput
        label="Display Name"
        placeholder="Enter a descriptive name for this attribute"
        radius="md"
        labelProps={{ style: labelStyles }}
        {...register("name", { required: true })}
      />

      <TextInput
        label="Enter internal identifier"
        placeholder="Enter a descriptive name for this attribute"
        radius="md"
        mt={15}
        labelProps={{ style: labelStyles }}
        description="Used in API etc. This cannot be changed later"
        {...register("label", { required: true })}
      />

      <Button
        style={{
          borderRadius: "4px",
          color: "#FFFFFF",
          border: "1px solid #3C69E7",
          background: "#3C69E7",
          marginTop: "20px",
        }}
        fullWidth
        radius="xs"
        size="xs"
        fw={600}
        fs={{
          fontSize: "10px",
        }}
        color="dark"
        variant="outline"
        onClick={handleSubmit(onSubmit)}
      >
        Create
      </Button>
    </Modal>
  );
};

export default CreateDataFieldModal;
