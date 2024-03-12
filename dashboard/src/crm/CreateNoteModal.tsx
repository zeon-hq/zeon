import { Button, Modal, Select, Space, TextInput } from "@mantine/core"
import React from "react"
import { useDispatch } from "react-redux"
import { initCompanyData, initContactData, setShowNoteCreateModal } from "reducer/crmSlice"
import { labelStyles } from "./styles"
import { Controller, useForm } from "react-hook-form"
import { createNote } from "./CRMService"
import { CRMResourceType } from "./type"
import { showNotification } from "@mantine/notifications"
import ErrorMessage from "components/ui-components/common/ErrorMessage"


type Props = {
  showNoteCreateModal: boolean
  resourceType: CRMResourceType
  resourceId: string
}

const CreateNoteModal = ({
  resourceId,
  resourceType
}: Props) => {
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      content: "",
      noteType: "PRIVATE",
    },
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      await createNote({
        content: data.content,
        noteType: data.noteType,
        source: "DASHBOARD",
        resourceType: resourceType,
        resourceId: resourceId,
      })
      showNotification({
        title: "Success",
        message: "Note created successfully",
        color: "blue",
      })
      dispatch(setShowNoteCreateModal(false))
      if(resourceType === CRMResourceType.CONTACT) {
        //@ts-ignore
         dispatch(initContactData({contactId:resourceId}))
      } else {
        //@ts-ignore
        dispatch(initCompanyData({companyId:resourceId}))
      }
      setLoading(false)
      
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Error",
        message: "Note creation failed",
        color: "red",
      })
      dispatch(setShowNoteCreateModal(false))
      setLoading(false)
    }
  }

  

  return (
    <Modal
      opened={true}
      onClose={() => {
        dispatch(setShowNoteCreateModal(false))
      }}
      title="Create Note"
      size="md"
    >
      <TextInput
        label="Note"
        placeholder="Add Note..."
        radius="md"
        labelProps={{ style: labelStyles }}
        {...register("content", { required: "Note is required" })}
      />
      {errors?.content?.message && <ErrorMessage message={(errors.content?.message as string)} />}
      <Space h="md" />
      <Controller
        name="noteType"
        control={control}
        defaultValue="PRIVATE"
        render={({ field }) => (
          <Select
            data={[
              { value: "PUBLIC", label: "Public" },
              { value: "PRIVATE", label: "Private" },
            ]}
            label="Note Type"
            placeholder="Select Note Type"
            radius="md"
            labelProps={{ style: labelStyles }}
            {...field}
          />
        )}
      />
      <Space h="md" />
      <Button loading={loading} className="primary" fullWidth onClick={handleSubmit(onSubmit)}>
        Create
      </Button>
    </Modal>
  )
}

export default CreateNoteModal
