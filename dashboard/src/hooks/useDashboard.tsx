import { useSelector } from "react-redux";
import { RootState } from "store";

const useDashboard = () => {
    const url = window.location.href;
    const selectedPage = useSelector((item:RootState) => item.dashboard.selectedPage);
    const channelsInfo = useSelector((item:RootState) => item.dashboard.channelsInfo);
    const channel = useSelector((item:RootState) => item.dashboard.channel);
    const loading = useSelector((item:RootState) => item.dashboard.loading);
    const workspaces = useSelector((item:RootState) => item.dashboard.workspaces);
    const user = useSelector((item:RootState) => item.dashboard.user);
    // It contains all the info of the current workspace
    const workspaceInfo = useSelector((item:RootState) => item.dashboard.workspaceInfo);
    const inbox = useSelector((item:RootState) => item.dashboard.inbox);
    const activeChat = useSelector((item:RootState) => item.dashboard.activeChat);
    const showSidebar = useSelector((item:RootState) => item.dashboard.showSidebar);
    const defaultWorkSpaceSettingTab = useSelector((item:RootState) => item.dashboard.defaultWorkSpaceSettingTab);
    const isFinance = url.includes("finance");
    const isCRM = url.includes("crm");
    /**
     * Tells the active entity
     * chat, finance, crm
     * 
     */
    const activeEntity = isFinance ? "finance" : isCRM ? "crm" : "chat";
    const isChat = activeEntity === "chat";

    return {
        selectedPage,
        channel,
        channelsInfo,
        loading,
        workspaces,
        user,
        workspaceInfo,
        inbox,
        activeChat,
        showSidebar,
        defaultWorkSpaceSettingTab,
        activeEntity,
        isChat,
        isFinance,
        isCRM
    }
}

export default useDashboard