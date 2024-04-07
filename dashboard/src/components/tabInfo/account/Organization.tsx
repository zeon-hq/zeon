import {
  Button,
  Divider,
  Flex,
  Modal,
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
import axios from "axios";
import Billing from "./Billing";
import SubscriptionCard from "./SubscriptionCard";
import BillingModal from "./BillingModal";
import { showNotification } from "@mantine/notifications";

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
  const [showBillingModal, setShowBillingModal] = useState(false);

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

  const createStripeCheckout = async () => {
    try {
      const res = await axios.post(
        "https://core.zeonhq.com/create-checkout-session",
        {
          priceId: "price_1P2GGbB51Fz4VVlmqkG42SVZ",
          workspaceId: workspaceInfo.workspaceId,
          customerId: workspaceInfo.stripeCustomerId,
        }
      );
      window.location.href = res.data.url;
    } catch (error:any) {
      console.log(error);
      showNotification({
        title: "Error",
        message: error?.response?.data?.error?.message ?? "Something went wrong",
        color: "red",
      });
    }
  };

  const createManageBilling = async () => {
    try {
      const res = await axios.post(
        "https://core.zeonhq.com/create-customer-portal-session",
        {
          customerId: workspaceInfo.stripeCustomerId,
        }
      );
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }
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
        <Button
          radius="md"
          className="primary"
          onClick={() => setShowBillingModal(true)}
        >
          Billing
        </Button>
      </Flex>
      <div>
        {/* @ts-ignore */}
        {/* <stripe-pricing-table
          pricing-table-id="prctbl_1P2GLpB51Fz4VVlmuZzNvSx8"
          publishable-key="pk_live_51M0LxIB51Fz4VVlmA7Hhplee3uZlYPhGUC86PsgSKbwFxvZ7hxtdvG1SS3XMApbHGCFFCiRs00yzYRx0Sy14quHN00FeVAAS9F"
        > */}
        {/* @ts-ignore */}
        {/* </stripe-pricing-table> */}
        <Button
          radius="md"
          className="primary"
          leftIcon={<img alt="profile" src={ProfileSave} />}
          color="indigo"
          onClick={createStripeCheckout}
        >
          Checkout 
        </Button>
        <Button
          radius="md"
          className="primary"
          leftIcon={<img alt="profile" src={ProfileSave} />}
          color="indigo"
          onClick={createManageBilling}
        >
          Manage 
        </Button>
        {/* <Billing  /> */}
        {/* @ts-ignore */}

        {/* <stripe-pricing-table
          pricing-table-id="prctbl_1P2GLpB51Fz4VVlmuZzNvSx8"
          publishable-key="pk_live_51M0LxIB51Fz4VVlmA7Hhplee3uZlYPhGUC86PsgSKbwFxvZ7hxtdvG1SS3XMApbHGCFFCiRs00yzYRx0Sy14quHN00FeVAAS9F"
        ></stripe-pricing-table> */}
      </div>

      {/* <Modal
        title="Subscription"
        size="xl"

        opened={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <BillingModal />
      </Modal> */}
    </>
  );
};

export default Organization;
