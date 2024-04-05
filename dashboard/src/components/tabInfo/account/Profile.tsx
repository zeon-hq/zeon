import { Button, Divider, Flex, Space, Text } from "@mantine/core";
import ProfileSave from "assets/profile_save.png";
import Heading from "components/details/inbox/component/Heading";
import {
  LeftWrapper,
  OuterWrapper,
  RightWrapper,
  SettingInbox,
} from "components/details/inbox/inbox.styles";
import { ICoreServiceUserProfileUpdatePayload } from "components/types";
import ProfileUpload from "components/ui-components/ProfileUpload";
import useDashboard from "hooks/useDashboard";
import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { updateUserWorkSpaceInformation } from "service/CoreService";
import { useDispatch } from "react-redux";
import { initDashboard } from "reducer/slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, workspaceInfo } = useDashboard();
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [profilePic, setProfilePic] = useState<string | any>(user.profilePic);

  const updateUserInformation = async () => {
    const apiPayloadData: ICoreServiceUserProfileUpdatePayload = {
      name,
      email,
      profilePic,
    };
    const workSpaceId = workspaceInfo.workspaceId;
    const userId = user.userId;
    await updateUserWorkSpaceInformation(apiPayloadData, workSpaceId, userId);
  };
  return (
    <>
      <Space h={24} />
      <Heading
        heading="Personal info"
        subheading="Update your photo and personal details here."
      />

      <OuterWrapper>
        <LeftWrapper>
          <Text>Name</Text>
        </LeftWrapper>

        <RightWrapper>
          <SettingInbox
            value={name}
            radius={"8px"}
            onChange={(e) => {
              setName(e.target.value);
            }}
            style={{ width: "100%" }}
          />
        </RightWrapper>
      </OuterWrapper>

      <Divider mt={"20px"} mb={"20px"} w={"80%"} color="#EAECF0" />

      <OuterWrapper>
        <LeftWrapper>
          <Text>Email address</Text>
        </LeftWrapper>

        <RightWrapper>
          <SettingInbox
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            icon={<FiMail size="1rem" />}
            style={{ width: "100%" }}
            radius={"8px"}
          />
        </RightWrapper>
      </OuterWrapper>

      <Divider mt={"20px"} mb={"20px"} w={"80%"} color="#EAECF0" />

      <Flex w={"80%"}>
        <ProfileUpload
          name="Your photo"
          description="This will be displayed on your profile."
          logoImage={profilePic}
          setLogoImage={setProfilePic}
        />
      </Flex>

      <Flex w={"80%"} justify={"flex-end"} mt={"20px"}>
        <Button
          radius="md"
          className="primary"
          leftIcon={<img alt="profile save" src={ProfileSave} />}
          color="indigo"
          onClick={async () => {
            await updateUserInformation();
            //@ts-ignore
            dispatch(initDashboard(workspaceInfo.workspaceId));
          }}
        >
          {" "}
          Save{" "}
        </Button>
      </Flex>
    </>
  );
};

export default Profile;
