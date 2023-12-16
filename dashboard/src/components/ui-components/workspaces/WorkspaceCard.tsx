import { Button, Flex, Image, Text } from "@mantine/core"
import workSpaceEnterBlue from "assets/workSpaceEnterBlue.svg"
import workSpaceEnterGray from "assets/workSpaceEnterGray.svg"
import { useState } from "react"
import { useNavigate } from "react-router"
import styled from "styled-components"

type Props = { name: string; workspaceId: string; info?: string; isInvite?: boolean, onAccept ?: () => void, onReject?: () => void }

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border: 2px solid #eaecf0;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  cursor: pointer;
  margin-bottom: 18px;
  /* Change border color to red and text color to red on hover */
  &:hover {
    border: 2px solid #3c69e7;
    color: #3c69e7; /* Change text color */

    /* Select all text components inside Wrapper and change their color */
    & * {
      color: #3c69e7; /* Change text color */
    }
  }
`

const WorkSpaceName = styled(Text)`
  color: #344054;
  font-weight: 500;
  font-size: 16px;
`

const WorkSpaceId = styled(Text)`
  color: #475467;
  font-size: 16px;
  font-weight: 400;
`

const EnterButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`

const WorkspaceCard = ({ name, info, isInvite = false, onAccept, onReject, workspaceId }: Props) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)


  return (
    <Wrapper
    onClick={()=>{
      navigate(`/${workspaceId}/chat`)
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)} 
    >
      <div>
        <WorkSpaceName>{name}</WorkSpaceName>
        <WorkSpaceId>{info}</WorkSpaceId>
      </div>

      {isInvite ? (
        <>
          <Flex gap="sm">
            {/* Show two button with Accept and Reject */}
            <Button
              radius="md"
              fullWidth
              style={{
                background: "#3C69E7",
                // color: "white",
                // on hover, color should be white

              }}
              variant="filled"
              onClick={onAccept}
              // color={"red"}
            >
              {" "}
              Accept{" "}
            </Button>
            <Button
              radius="md"
              fullWidth
              variant="default"
              
              onClick={onReject}
            >
              {" "}
              Reject{" "}
            </Button>
          </Flex>
        </>
      ) : (
        <EnterButton
          onClick={() => {
            
          }}
        >
          <Image
            style={{ color: "red" }}
            maw={20}
            mx="auto"
            radius="md"
            src={hovered ? workSpaceEnterBlue : workSpaceEnterGray}
            alt="Logout Icon"
          />
        </EnterButton>
      )}
    </Wrapper>
  )
}

export default WorkspaceCard
