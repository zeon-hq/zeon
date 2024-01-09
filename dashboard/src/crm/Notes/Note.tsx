import { Space } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { getReadableDateWithTime } from "components/utils/utilFunctions"
import { deleteNote } from "crm/CRMService"
import { CRMResourceType, INote } from "crm/type"
import React from "react"
import { AiFillDelete } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { initContactData } from "reducer/crmSlice"
import styled from "styled-components"

const NoteWrapper = styled.div`
  border-radius: var(--radius-xs, 4px);
  border: 1px solid var(--Gray-200, #eaecf0);
  padding: 16px;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
`

const NotePill = styled.div`
  display: inline-block;
  border: 1.5px solid #3c69e7;
  padding: 1px 8px;
  color: #3c69e7;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
`

const ColorText = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`

type Props = {
  notes: INote[],
  resourceId: string,
  resourceType: CRMResourceType,
}

const Note = ({ notes,resourceId,resourceType }: Props) => {
  const dispatch = useDispatch()
  const handleDelete = async (noteId:any) => {
    try {
      const res = await deleteNote(
        {
          noteId: noteId,
          resourceType: resourceType,
          resourceId: resourceId
        }
      )
      showNotification({
        title: "Success",
        message: "Note deleted successfully",
        color: "blue",
      })
      //@ts-ignore
      dispatch(initContactData({contactId: resourceId})        
      )
    } catch (error: any) {
      console.log(error)
      showNotification({
        title: "Error",
        message: "Note deletion failed",
        color: "red",
      })
    }
  }

  return (
    <div>
      {notes.length === 0 ? (
        <div>No notes found</div>
      ) : (
        notes.map((note) => (
          <NoteWrapper>
            <div>
              <NotePill> {note.noteType} Note </NotePill>{" "}
              <ColorText color="#3C69E7"> {note.createdBy.name} </ColorText>{" "}
              <ColorText color="#667085"> Created a </ColorText> Note{" "}
              <ColorText color="#667085">
                {" "}
                at {getReadableDateWithTime(note.createdAt)}{" "}
              </ColorText>
            </div>
            <Space h="md" />
            <div>
              <ColorText color="#101828">{note.content}</ColorText>{" "}
              <AiFillDelete onClick={() => handleDelete(note.noteId)} />
            </div>
          </NoteWrapper>
        ))
      )}
    </div>
  )
}

export default Note
