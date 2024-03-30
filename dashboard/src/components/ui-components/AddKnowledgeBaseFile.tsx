import {
  Box,
  Button,
  Modal,
  Progress,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import userDeleteIcon from "assets/user_delete_icon.svg";
import axios from "axios";
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
  const coreAPIDomainUrl = Config("CORE_API_DOMAIN");
  const [files, setFiles] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const onDropRejected = useCallback((rejectedFile: any) => {
    rejectedFile.forEach((file: any) => {
      file.errors.forEach((error: any) => {
        showNotification({
          title: "Error",
          message: error.message,
        });
      });
    });
  }, []); // eslint-disable-line

  const uploadFileData = async (files: any[]) => {
    setFiles(files);
    showNotification({
      title: "Error",
      message: "Uploading logo...",
    });
    let formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    // multiple files, when the user clicks the
    try {
      axios
        .put(`${coreAPIDomainUrl}/ai/asset/upload-files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("at")}`,
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        })
        .then((response: any) => {
          alert("File uploaded successfully");

          const uploadedUrl = files.map((data: any) => {
            const fileName = data.name;
            const s3Url = response.data.uploadedUrls.find(
              (url: any) => url.fileName === fileName
            );
            return {
              name: fileName,
              s3Url: s3Url.url,
              size: data.size,
              type: data.type,
            };
          });

          setFiles(uploadedUrl || []);
        })
        .catch((error) => {
          alert("Error uploading file");
        });

      showNotification({
        title: "Success",
        message:
          "Logo uploaded successfully. Click on save and refresh the page to see the changes",
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

  const { getRootProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: true,
    maxFiles: 5,
    accept: {
      "application/pdf": [".pdf"]
    }
  });

  return (
    <Modal
      yOffset="20vh"
      xOffset={0}
      radius={"12px"}
      className="add_knowledge_base_file_modal"
      opened={opened}
      onClose={() => onClose()}
      title={<p>Upload and attach files</p>}
    >
      <Box
        style={{
          fontFamily: "Inter !important",
        }}
      >
        <Text mt={"0px"} pt={"0px"} color={"grey.1"}>
          Upload and attach files to your co-pilot
        </Text>
        <div
          style={{
            marginTop: "24px",
          }}
          {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        >
          <DNDContainer>
            <IconContainer>
              <div style={{ padding: "10px" }}>
                <AiOutlineCloudUpload size={"20px"} />
              </div>
            </IconContainer>
            <HelperText>
              <span
                style={{
                  color: theme.colors.blue[0]
                }}>
                Click to Upload
              </span>
              &nbsp; or drag and drop the image here!
            </HelperText>
            <HelperText> pdf </HelperText>
          </DNDContainer>
        </div>

        {files.map((file, index) => (
          <DNDContainer
            key={index}
            style={{
              fontSize: "14px",
              marginTop: "12px",
              // fontFamily: 'Inter',
            }}
          >
            <Box
              display={"flex"}
              w={"100%"}
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text color={theme.colors.grey[1]}>{file.name}</Text>

              <img 
              onClick={() => {
                setFiles(files.filter((f) => f.name !== file.name));
              }}
              className="pointer" alt="inchat" src={userDeleteIcon} />
            </Box>
            <Text color={theme.colors.grey[2]}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Text>

            <Box
              display={"flex"}
              w={"100%"}
              style={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Progress
                w={"80%"}
                color={theme.colors.blue[1]}
                radius="md"
                value={progress}
              />

              <Text>{progress}%</Text>
            </Box>
          </DNDContainer>
        ))}

        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
          <Button variant="default" radius="md" onClick={() => {}}>
            {"Cancel"}
          </Button>
          <Button radius="md" className="primary" onClick={() => {
            alert(1)
          }}>
            {"Attach Files"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddKnowledgeBaseFile;