import { TopBarWrapper, TopBarDivWrapper, InnerDivWrapper } from '../../components/topbar/topbar.styles';
import TopBarWorkSpaceLeftSelect from '../../components/ui-components/workspaces/TopBarWorkSpaceLeftSelect';
import TopBarWorkSpaceRightSelect from '../../components/ui-components/workspaces/TopBarWorkSpaceRightSelect';
import React from 'react'
import { setShowSidebar, setSelectedPage } from '../../reducer/slice';
import Pill from '../../components/topbar/Pill';
import { useParams } from 'react-router';


type Props = {}

const FinanceTopbar = (props: Props) => {
    const {workspaceId} = useParams(

    )
  return (
    <TopBarWrapper>
    <TopBarDivWrapper>
        
        {/* <Pill selected label="Analytics" onClick={() => {
                
            }} /> */}
            <Pill selected label="Expenses" onClick={() => { 
               
            }} />
    </TopBarDivWrapper>
</TopBarWrapper>
  )
}

export default FinanceTopbar