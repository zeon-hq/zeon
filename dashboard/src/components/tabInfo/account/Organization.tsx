import {
  Button,
  Divider,
  Flex,
  Select,
  Space,
  Text,
} from "@mantine/core";
import ProfileSave from "assets/profile_save.png";
import Heading from "components/details/inbox/component/Heading";
import {
  LeftWrapper,
  OuterWrapper,
  RightWrapper,
  SettingInbox,
} from "components/details/inbox/inbox.styles";
import { initDashboard } from "reducer/slice";
import moment from "moment-timezone";
import ProfileUpload from "components/ui-components/ProfileUpload";
import useDashboard from "hooks/useDashboard";
import { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { updateWorkSpaceInformation } from "service/CoreService";
import { IWorkspaceInfoUpdatePayload } from "components/types";
import { useDispatch } from "react-redux";

const showTimeZoneField = true;

const Organization = () => {
  const { workspaceInfo } = useDashboard();
  const dispatch = useDispatch();
  const [workspaceName, setWorkSpaceName] = useState<string>(
    workspaceInfo.workspaceName
  );
  const [timezone, setTimeZone] = useState<string | undefined>(
    workspaceInfo?.workspaceConfig?.timezone
  );
  const [organizationPic, setOrganizationPic] = useState<string | any>(
    workspaceInfo?.workspaceConfig?.logo
  );
  const saveOrganizationInfo = async () => {
    const workSpaceId = workspaceInfo.workspaceId;

    const workSpacePayload: IWorkspaceInfoUpdatePayload = {
      workspaceName: workspaceName,
      timezone: timezone,
      logo: organizationPic,
    };
    await updateWorkSpaceInformation(workSpacePayload, workSpaceId);
    //@ts-ignore
    dispatch(initDashboard(workspaceInfo.workspaceId));
  };

  return (
    <>
      <div></div>
      <Space h={24} />
      <Heading
        heading="Organization"
        subheading="Update your organization details here. too"
      />

      <OuterWrapper>
        <LeftWrapper>
          <Text>Workspace Name</Text>
        </LeftWrapper>

        <RightWrapper>
          <SettingInbox
            value={workspaceName}
            onChange={(e) => {
              setWorkSpaceName(e.target.value);
            }}
            style={{ width: "100%" }}
            radius={"8px"}
          />
        </RightWrapper>
      </OuterWrapper>

      <Divider mt={"20px"} mb={"20px"} w={"80%"} color="#EAECF0" />

      <Flex w={"80%"}>
        <ProfileUpload
          name="Workspace Logo"
          description="This will be displayed on your workspace profile."
          logoImage={organizationPic}
          setLogoImage={setOrganizationPic}
        />
      </Flex>

      <Divider mt={"20px"} mb={"20px"} w={"80%"} color="#EAECF0" />

      {showTimeZoneField && (
        <OuterWrapper>
          <LeftWrapper>
            <Text>Timezone</Text>
          </LeftWrapper>

          <RightWrapper>
            <Select
              defaultValue={timezone}
              rightSection={<MdKeyboardArrowDown />}
              icon={<AiOutlineClockCircle size="1rem" />}
              clearable={false}
              allowDeselect={false}
              searchable
              sx={{
                width: "100%",
              }}
              placeholder="Select"
              data={moment.tz.names().map((name) => ({
                value: name,
                label: name,
              }))}
              onChange={(value: any) => {
                setTimeZone(value);
              }}
            />
          </RightWrapper>
        </OuterWrapper>
      )}

      {/*  */}
      <Flex w={"80%"} justify={"flex-end"} mt={"20px"}>
        <Button
          radius="md"
          className="primary"
          leftIcon={<img alt="profile" src={ProfileSave} />}
          color="indigo"
          onClick={async () => {
            await saveOrganizationInfo();
          }}
        >
          {" "}
          Save{" "}
        </Button>
       
      </Flex>
      

    </>
  );
};

export default Organization;
