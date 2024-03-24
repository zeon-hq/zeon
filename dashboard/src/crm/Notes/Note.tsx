import { Space } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { getReadableDateWithTime } from "components/utils/utilFunctions"
import { deleteNote } from "crm/CRMService"
import { CRMResourceType, INote } from "crm/type"
import { useDispatch } from "react-redux"
import { initContactData } from "reducer/crmSlice"
import styled from "styled-components"
import { RiDeleteBin5Line } from "react-icons/ri";
import NotFound from "components/ui-components/NotFound"

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

const NoteContent = styled.div`
display: grid;
grid-template-columns: 95% 5%;
align-items: center;
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
      await deleteNote(
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
        <NotFound message="No notes found" />
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
            <NoteContent>
              <ColorText color="#101828">{note.content}</ColorText>{" "}
              <RiDeleteBin5Line onClick={() => handleDelete(note.noteId)} />
            </NoteContent>
          </NoteWrapper>
        ))
      )}
    </div>
  )
}

export default Note
