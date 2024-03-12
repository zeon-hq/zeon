import { LoadingOverlay, Text } from '@mantine/core'
import useDashboard from 'hooks/useDashboard'
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux"
import { setLoading, setWorkspaces } from 'reducer/slice'
import { getUserInvites, getWorkspaces } from 'service/CoreService'
import ShowCreatedWorkspaces from './ShowCreatedWorkspaces'
import { showNotification } from "@mantine/notifications";


const Workspaces = () => {

    const {workspaces,loading} = useDashboard()
    const dispatch = useDispatch()
    const [invites, setInvites] = useState<any[] | undefined>(undefined)


    const getUserWorkspaces = async () => {
        dispatch(setLoading(true))
        try {
            const res = await getWorkspaces()
                dispatch(setWorkspaces(res.workspaces ?? []));
                dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false))
            showNotification({
                title: "Workspace fetching failed",
                message: "Issue while fetching workspace",
                color: "red",
              });
        }
    }

    const getWorkspaceToWhichUserIsInvited = async () => {
        try {
            const res = await getUserInvites()
            setInvites(res.invites)
        } catch (error) {
            console.log(">>>", error)
        }
    }

    useEffect(() => {
        getUserWorkspaces()
        getWorkspaceToWhichUserIsInvited()
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
        <LoadingOverlay visible={loading} />
        {
            (workspaces && invites) ? <ShowCreatedWorkspaces getWorkspaceToWhichUserIsInvited={getWorkspaceToWhichUserIsInvited} invites={invites} workspaces={workspaces} /> : <Text> Fetching workspaces </Text>
        }
    </div>
  )
}

export default Workspaces