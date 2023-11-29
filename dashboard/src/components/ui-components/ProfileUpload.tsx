import { Flex } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  Block,
  DNDContainer,
  HelperText,
  IconContainer,
  SettingLabel,
  SettingSubLabel
} from "components/details/inbox/inbox.styles";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadFile } from "service/DashboardService";

type IProfileUpload = {
  logoImage: string;
  setLogoImage: (logoImage: string) => void;
  name:string;
  description:string;
};

const ProfileUpload = ({ logoImage, setLogoImage, name, description  }: IProfileUpload) => {


  const onDropRejected = useCallback((rejectedFile:any) => {
    rejectedFile.forEach((file:any) => {
      file.errors.forEach((error:any) => {
        showNotification({
          title: "Error",
          message: error.message,
        });
      })
    })
    
  },[]) 

  const uploadFileData = async (files: any[]) => {
    showNotification({
      title: "Error",
      message: "Uploading logo...",
    });
        let formData = new FormData();
        formData.append("file", files[0]);

        try {
          const res = await uploadFile(formData);
          setLogoImage(res?.uploadedUrl)
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


 const onDropAccepted = useCallback((acceptedFiles:any) => {
  uploadFileData(acceptedFiles);
      }, []);

      const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        isDragActive,
      } = useDropzone({
        onDropAccepted,
        onDropRejected,
        multiple: false,
        maxFiles: 1,
        accept:{ "image/*": [".png", ".gif", ".jpeg", ".jpg"]}
      });

  return (
    <>
      <Block>
        <Flex
          direction={"column"}
          style={{
            flex: 4,
          }}
        >
          <SettingLabel>{name}</SettingLabel>
          <SettingSubLabel>
            {description}
          </SettingSubLabel>
        </Flex>

        <Flex
          justify={"space-between"}
          style={{
            flex: 6,
          }}
        >
          {logoImage ? (
            <div style={{ width: "64px", height: "64px" }}>
              <img
                alt="Company logo"
                src={logoImage}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          ) : (
            <div
              style={{
                height: "64px",
                width: "64px",
                border:'4px',
                backgroundColor: "#EAECF0",
              }}
            ></div>
          )}
          <div {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
            <DNDContainer>
              <IconContainer>
                <div style={{padding:'10px'}}>
                  <AiOutlineCloudUpload size={"20px"} style={{ }}  />
                </div>
              </IconContainer>
              <HelperText>
                {" "}
                Click to Upload or drag and drop the image here!{" "}
              </HelperText>
              <HelperText> SVG, PNG, JPG or GIF (max. 800x400px) </HelperText>
            </DNDContainer>
          </div>
        </Flex>
      </Block>
    </>
  );
};

export default ProfileUpload;
