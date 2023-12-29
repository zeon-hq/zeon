import { useSelector } from "react-redux";
import { RootState } from "store";

const useCrm = () => {

    const selectedPage = useSelector((item:RootState) => item.crm.selectedPage)
    const selectedContactPage = useSelector((item:RootState) => item.crm.selectedContactPage)
    const selectedCompanyPage = useSelector((item:RootState) => item.crm.selectedCompanyPage)
    const loading = useSelector((item:RootState) => item.crm.loading)

    return {
        selectedPage,
        selectedContactPage,
        selectedCompanyPage,
        loading,
    }
}

export default useCrm