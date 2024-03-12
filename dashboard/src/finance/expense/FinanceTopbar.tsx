import { TopBarWrapper, TopBarDivWrapper } from '../../components/topbar/topbar.styles';
import Pill from '../../components/topbar/Pill';

type Props = {}

const FinanceTopbar = (props: Props) => {
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