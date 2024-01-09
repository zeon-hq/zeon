import { Button, Modal, TextInput } from "@mantine/core";
import React from "react";
import { useDispatch } from "react-redux";
import { setShowNoteCreateModal } from "reducer/crmSlice";
import { labelStyles } from "./styles";
import { useForm } from "react-hook-form";
import { createNote } from "./CRMService";
import useCrm from "hooks/useCrm";
import { CRMResourceType, NoteType } from "./type";
import { showNotification } from "@mantine/notifications";

type Props = {
  showNoteCreateModal: boolean;
};

const CreateNoteModal = ({ showNoteCreateModal }: Props) => {
  const dispatch = useDispatch();
  const {
    
  } = useCrm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: "",
      noteType: "PRIVATE",
    },
  });

  const onSubmit = async (data: any) => {
    try {
        const res = await createNote({
            content: data.content,
            noteType: NoteType.PUBLIC,
            source: "DASHBOARD",
            resourceType: CRMResourceType.CONTACT,
            resourceId: ''
        });
        console.log(res);
        showNotification({
            title: "Success",
            message: "Note created successfully",
            color: "blue",
        });
        dispatch(setShowNoteCreateModal(false));
    } catch (error) {
        console.log(error);
        showNotification({
            title: "Error",
            message: "Note creation failed",
            color: "red",
        });
        dispatch(setShowNoteCreateModal(false));
    }
  }

  return (
    <Modal
      opened={true}
      onClose={() => {
        dispatch(setShowNoteCreateModal(false));
      }}
      title="Create Note"
      size="md"
    >
      <TextInput
        label="Note"
        placeholder="Add Note..."
        radius="md"
        labelProps={{ style: labelStyles }}
        {...register("content", { required: true })}
      />
      <Button
        className="primary"
        fullWidth
        onClick={handleSubmit((data) => {
          console.log(data);
        })}
      >
        Create
      </Button>
    </Modal>
  );
};

export default CreateNoteModal;
