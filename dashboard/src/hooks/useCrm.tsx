import { useSelector } from "react-redux";
import { RootState } from "store";

const useCrm = () => {
  const selectedPage = useSelector((item: RootState) => item.crm.selectedPage);
  const selectedContactPage = useSelector(
    (item: RootState) => item.crm.selectedContactPage
  );
  const selectedCompanyPage = useSelector(
    (item: RootState) => item.crm.selectedCompanyPage
  );
  const loading = useSelector((item: RootState) => item.crm.loading);
  const showNoteCreateModal = useSelector(
    (item: RootState) => item.crm.showNoteCreateModal
  );
  const selectedNote = useSelector((item: RootState) => item.crm.selectedNote);
  const selectedResource = useSelector(
    (item: RootState) => item.crm.selectedResource
  );

  return {
    selectedPage,
    selectedContactPage,
    selectedCompanyPage,
    loading,
    showNoteCreateModal,
    selectedNote,
    selectedResource,
  };
};

export default useCrm;
