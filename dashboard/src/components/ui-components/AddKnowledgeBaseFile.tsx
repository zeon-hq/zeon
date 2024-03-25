import { Box, Modal, Text, useMantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from 'axios';
import {
  DNDContainer,
  HelperText,
  IconContainer
} from "components/details/inbox/inbox.styles";
import { getConfig as Config } from "config/Config";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface IAddKnowledgeBaseFile {
  opened: boolean;
  onClose: () => void;
}

const AddKnowledgeBaseFile = ({ opened, onClose }: IAddKnowledgeBaseFile) => {
  const theme = useMantineTheme();
  const apiDomainUrl = Config("CORE_API_DOMAIN");
  const [progress, setProgress] = useState(0);

  const onDropRejected = useCallback((rejectedFile: any) => {
    rejectedFile.forEach((file: any) => {
      file.errors.forEach((error: any) => {
        showNotification({
          title: "Error",
          message: error.message,
        });
      })
    })

  }, []) // eslint-disable-line

  const uploadFileData = async (files: any[]) => {
    showNotification({
      title: "Error",
      message: "Uploading logo...",
    });
    let formData = new FormData();
    formData.append("file", files[0]);

    // multiple files, when the user clicks the 

    try {
      axios.post(`${apiDomainUrl}/team/asset/upload-logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      })
      .then(response => {
        alert('File uploaded successfully');
      })
      .catch(error => {
        alert('Error uploading file');
      });




      showNotification({
        title: "Success",
        message: "Logo uploaded successfully. Click on save and refresh the page to see the changes",
      });
    } catch (e) {
      showNotification({
        title: "Success",
        message: "Cannot upload image. Something went wrong",
      });

      console.error(e);
    }
  };

  const onDropAccepted = useCallback((acceptedFiles: any) => {
    uploadFileData(acceptedFiles);
  }, []); // eslint-disable-line

  const {
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: true,
    maxFiles: 5,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <Modal
      yOffset="20vh"
      xOffset={0}
      radius={'12px'}
      className="add_knowledge_base_file_modal"
      opened={opened}
      onClose={() => onClose()}
      title={<p>Upload and attach files</p>}
    >
      <Box style={{
        fontFamily: 'Inter'
      }}>

        <Text mt={'0px'} pt={'0px'} color={"grey.1"}>Upload and attach files to your co-pilot</Text>
        <div style={{
          marginTop: '24px'
        }} {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
          <DNDContainer>
            <IconContainer>
              <div style={{ padding: '10px' }}>
                <AiOutlineCloudUpload size={"20px"} />
              </div>
            </IconContainer>
            <HelperText>
              <span style={{
                color: theme.colors.blue[0]
              }}>
                Click to Upload
              </span>
              &nbsp;

              or drag and drop the image here!

            </HelperText>
            <HelperText> pdf </HelperText>
          </DNDContainer>
        </div>

        <Text>{progress}</Text>
      </Box>
    </Modal>
  )
}

export default AddKnowledgeBaseFile