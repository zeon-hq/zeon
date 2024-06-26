import { Box, createStyles, Flex as MFlex, Space, Text, Tooltip } from "@mantine/core";
import KBFileViewIcon from "assets/kb_file.svg";
import KBPdfIcon from "assets/kb_pdf.svg";
import UserDeleteIcon from "assets/user_remove_icon.svg";
import Heading from "components/details/inbox/component/Heading";
import AddKnowledgeBaseFile from "components/ui-components/AddKnowledgeBaseFile";
import ConfirmationDialog from "components/ui-components/ConfirmationDialog";
import useDashboard from "hooks/useDashboard";
import { useCallback, useEffect, useState } from "react";
import { deleteKnowledgeBaseFile, getKnowledgeBaseList } from "service/CoreService";
import { Plus } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  text: {
    color: '#475467',
    fontWeight: 500,
    fontSize: '12px'
  },
  boxWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  tableWrapper: {
    padding: '16px 0px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '12px'
  }
}));

type IKnowledgeBase = {
  _id: string;
  fileId: string;
  workspaceId: string;
  channelId: string;
  s3FileUrls: string;
  status: string;
  fileName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Knowledge = () => {
  const [openAddDataModal, setOpenAddDataModal] = useState(false);
  const { classes } = useStyles();
  const { workspaceInfo } = useDashboard();
  const [deleteFileId, setDeleteFileId] = useState<string>();
  const [knowledgeFileList, setKnowledgeFileList] = useState<IKnowledgeBase[]>([]);
  const channelId = localStorage.getItem("zeon-dashboard-channelId");
  
  const fetchKnowledgeBaseFiles = useCallback(async () => {
    const fileList = await getKnowledgeBaseList(workspaceInfo.workspaceId, channelId as string);
    console.log('fileList', fileList);
    if (fileList.code === '200') {
      setKnowledgeFileList(fileList.data);
    } else {
      setKnowledgeFileList([]);
    }
  }, [workspaceInfo.workspaceId, channelId]); // Dependencies that the function uses
  
  useEffect(() => {
    fetchKnowledgeBaseFiles();
  }, [fetchKnowledgeBaseFiles]);

  const deleteInjestedFile = async (fileId: string) => {
    const response = await deleteKnowledgeBaseFile(fileId, workspaceInfo.workspaceId, channelId as string);
    if (response.code === '200'){
      await fetchKnowledgeBaseFiles();
    }
  }


  return (
    <div>
      <Heading
        heading="Memory Management"
        subheading="Give your co-pilot contextual information about anything"
        onSave={() => {
          setOpenAddDataModal(true);
        }}
        buttonText="Add file"
        icon={<Plus />}
      />
      <Space h="10px" />

      <MFlex
        sx={{
          border: "1px solid #EAECF0",
          backgroundColor: "#F9FAFB",
          width: '100%'
        }}
        p="8px 24px"
        align="center"
      >
        <Box className={classes.boxWrapper} w={'43%'}>
          <Text className={classes.text}>Dataset Name</Text>
        </Box>

        <Box className={classes.boxWrapper} w={'16%'}>
          <Text className={classes.text}>Last Updated</Text>
        </Box>

        <Box className={classes.boxWrapper} w={'17%'}>
          <Text className={classes.text}>Status</Text>
        </Box>

        {/* <Box className={classes.boxWrapper} w={'15%'}>
          <Text className={classes.text}></Text>
        </Box> */}

        <Box className={classes.boxWrapper} w={'24%'}>
          <Text className={classes.text}></Text>
        </Box>
      </MFlex>

      {
        knowledgeFileList
        .map((item, index) => {
          return (
            <>
              <MFlex key={index}>
                <Box className={classes.tableWrapper} pl='24px' w={'43%'}>
                <img alt="test"src={KBPdfIcon} />
                  <Text className={classes.text}>{item.fileName}</Text>
                </Box>

                <Box className={classes.tableWrapper} w={'16%'}>
                  <Text className={classes.text}>{item.createdAt}</Text>
                </Box>

                <Box className={classes.tableWrapper} w={'17%'}>
                  <Text className={classes.text}>{item.status}</Text>
                </Box>

                {/* <Box className={classes.tableWrapper} w={'15%'}>
                  <Text className={classes.text}>dfsdf</Text>
                </Box> */}

                <Box display={'flex'} className={classes.tableWrapper} w={'24%'} style={{
                  justifyContent: 'center'
                }}>
                   <Tooltip
                          multiline
                          position="bottom-end"
                          style={{
                            maxWidth: "320px",
                          }}
                          label={'view file'}>
                            <a href={item.s3FileUrls} rel="noreferrer" target="_blank">
                  <img style={{padding:'10px'}} alt="edit icon"src={KBFileViewIcon} />
                  </a>

                        </Tooltip>
                  <img 
                  className="pointer"
                  onClick={async()=>{
                    setDeleteFileId(item.fileId)
                  }}
                  style={{padding:'10px'}} alt="delete icon"src={UserDeleteIcon} />
                  
                </Box>
              </MFlex>
            </>
          )
        })
      }

      <ConfirmationDialog
        headerTitle="Are you sure you want to delete the injested file from your knowledge base ?"
        opened={!!deleteFileId}
        onClose={() => {
          setDeleteFileId('');
        }}
        onCTAClick={async () => {
          setDeleteFileId('');
          await deleteInjestedFile(deleteFileId as string);
        }}
      />

      {
        openAddDataModal &&
        <div style={{
          fontFamily: 'Inter !important'
        }}>
          <AddKnowledgeBaseFile
            opened={openAddDataModal}
            onClose={async () => {
              setOpenAddDataModal(false)
              await fetchKnowledgeBaseFiles();
            }}
          />
        </div>
      }

    </div>
  )
}

export default Knowledge