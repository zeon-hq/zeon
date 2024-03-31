import { Box, Flex as MFlex, Space, Text } from "@mantine/core";
import Heading from "components/details/inbox/component/Heading";
import AddKnowledgeBaseFile from "components/ui-components/AddKnowledgeBaseFile";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import { createStyles } from '@mantine/core';
import KBPdfIcon from "assets/kb_pdf.svg";
import UserDeleteIcon from "assets/user_remove_icon.svg";
import EditIcon from "assets/kb_edit.svg";

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

const Knowledge = () => {
  const [openAddDataModal, setOpenAddDataModal] = useState(false);
  const { classes } = useStyles();
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

        <Box className={classes.boxWrapper} w={'15%'}>
          <Text className={classes.text}></Text>
        </Box>

        <Box className={classes.boxWrapper} w={'9%'}>
          <Text className={classes.text}></Text>
        </Box>
      </MFlex>

      {
        [{fileName:"sample.pdf", status:'Completed', createdAt:'27/05/2023 01:25 PM' }]
        
        .map((item, index) => {
          return (
            <>
              <MFlex>
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

                <Box className={classes.tableWrapper} w={'15%'}>
                  <Text className={classes.text}>dfsdf</Text>
                </Box>

                <Box className={classes.tableWrapper} w={'9%'}>
                  <img style={{padding:'10px'}} alt="delete icon"src={UserDeleteIcon} />
                  <img style={{padding:'10px'}} alt="edit icon"src={EditIcon} />
                </Box>
              </MFlex>
            </>
          )
        })
      }

      {
        openAddDataModal &&
        <div style={{
          fontFamily: 'Inter !important'
        }}>
          <AddKnowledgeBaseFile
            opened={openAddDataModal}
            onClose={() => setOpenAddDataModal(false)}
          />
        </div>
      }

    </div>
  )
}

export default Knowledge