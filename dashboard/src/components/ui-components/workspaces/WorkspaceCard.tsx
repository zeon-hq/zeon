import { Button, Flex, Image, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import workSpaceEnterBlue from "assets/workSpaceEnterBlue.svg";
import workSpaceEnterGray from "assets/workSpaceEnterGray.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IWorkspace } from "reducer/slice";
import styled from "styled-components";
import { getConfig as Config } from "config/Config";
import axios from "axios";

type Props = {
  name: string;
  workspaceId: string;
  info?: string;
  isInvite?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  activePlan?: string;
  workspace: IWorkspace;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border: 2px solid #eaecf0;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  cursor: pointer;
  margin-bottom: 18px;
  /* Change border color to red and text color to red on hover */
  &:hover {
    border: 2px solid #3c69e7;
    color: #3c69e7; /* Change text color */

    /* Select all text components inside Wrapper and change their color */
    & * {
      color: #3c69e7; /* Change text color */
    }
  }
`;

const WorkSpaceName = styled(Text)`
  color: #344054;
  font-weight: 500;
  font-size: 16px;
`;

const WorkSpaceId = styled(Text)`
  color: #475467;
  font-size: 16px;
  font-weight: 400;
`;

const EnterButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const WorkspaceCard = ({
  name,
  info,
  isInvite = false,
  onAccept,
  onReject,
  workspaceId,
  activePlan,
  workspace,
}: Props) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const coreApi = Config("CORE_API_DOMAIN");
  const fetchCustomerSession = async () => {
    try {
      const res = await axios.post(`${coreApi}/create-customer-seesion`, {
        //@ts-ignore
        customerId: workspace.stripeCustomerId,
      });
      setClientSecret(res.data.client_secret);
    } catch (error: any) {
      console.log(error);
      showNotification({
        title: "Error",
        message:
          error?.response?.data?.error?.message ?? "Something went wrong",
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchCustomerSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Wrapper
        onClick={() => {
          if (activePlan) {
            navigate(`/${workspaceId}/chat`);
          } else {
            open();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div>
          <WorkSpaceName>{name}</WorkSpaceName>
          <WorkSpaceId>{info}</WorkSpaceId>
        </div>

        {isInvite ? (
          <>
            <Flex gap="sm">
              {/* Show two button with Accept and Reject */}
              <Button
                radius="md"
                fullWidth
                style={{
                  background: "#3C69E7",
                  // color: "white",
                  // on hover, color should be white
                }}
                variant="filled"
                onClick={onAccept}
                // color={"red"}
              >
                {" "}
                Accept{" "}
              </Button>
              <Button
                radius="md"
                fullWidth
                variant="default"
                onClick={onReject}
              >
                {" "}
                Reject{" "}
              </Button>
            </Flex>
          </>
        ) : activePlan ? (
          <EnterButton onClick={() => {}}>
            <Image
              style={{ color: "red" }}
              maw={20}
              mx="auto"
              radius="md"
              src={hovered ? workSpaceEnterBlue : workSpaceEnterGray}
              alt="Logout Icon"
            />
          </EnterButton>
        ) : (
          <Text color="red">Upgrade to Pro</Text>
        )}
      </Wrapper>
      <Modal
        opened={opened}
        onClose={close}
        title="Select a plan"
        size="70%"
        padding="lg"
      >
        {clientSecret ? (
          // @ts-ignore
          <stripe-pricing-table
            customer-session-client-secret={clientSecret}
            client-reference-id={workspace.workspaceId}
            pricing-table-id={
              process.env.REACT_APP_PRICING_TABLE_WITH_FREE_PLAN
            }
            publishable-key={process.env.REACT_APP_STRIPE_KEY}
          >
            {/* @ts-ignore */}
          </stripe-pricing-table>
        ) : (
          <Text>Loading</Text>
        )}
      </Modal>
    </>
  );
};

export default WorkspaceCard;
