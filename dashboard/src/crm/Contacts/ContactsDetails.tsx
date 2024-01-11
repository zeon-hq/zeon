import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import leftArrowIcon from "assets/leftArrow.svg";
import linkedinIcon from "assets/linkedin.svg";
import mailIcon from "assets/mail.svg";
import mailWhiteIcon from "assets/mailWhite.svg";
import noteIcon from "assets/note.svg";
import phoneIcon from "assets/phoneCall.svg";
import plusIcon from "assets/plus.svg";
import { useDispatch } from "react-redux";
import {
  initContactData,
  setSelectedContactPage,
  setShowNoteCreateModal,
} from "reducer/crmSlice";
import styled from "styled-components";
import Stepper, { StepType } from "../Stepper";
import useCrm from "hooks/useCrm";
import CreateNoteModal from "crm/CreateNoteModal";
import { CRMResourceType } from "crm/type";
import { findPrimaryEmail, findPrimaryPhoneNumIntl } from "crm/utils";
import { useEffect, useState } from "react";
import { fetchContact } from "service/CRMService";
import { AdditonalData } from "crm/AdditonalData/index";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Note from "crm/Notes/Note";
import { isEmpty } from "lodash";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const LeftContainer = styled.div`
  width: 30%;
  margin-right: 2%;
  margin-left: 2%;
`;

const MiddleContainer = styled.div`
  width: 45%;
  border-left: 1px solid #e1e1e1;
  padding-left: 2%;
`;

const RightContainer = styled.div`
  width: 25%;
  border-left: 1px solid #e1e1e1;
`;

const BackButton = styled(Flex)`
  cursor: pointer;
`;

const TextInputWrapper = styled(TextInput)`
  label {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0em;
    color: #344054;
  }
  input:disabled {
    color: #344054;
    background-color: #ffffff;
  }
`;

function ContactsDetails() {
  const dispatch = useDispatch();
  const {
    showNoteCreateModal,
    selectedContactPage,
    selectedContact,
    selectedCompany,
  } = useCrm();
  const { contactId } = useParams();

  const [activeTab, setActiveTab] = useState<string | null>(
    selectedContactPage.activeTab ?? "notes"
  );

  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    dispatch(setSelectedContactPage({ type: "all" }));
    const pathName = location.pathname.split("/");
    pathName.pop();
    navigate(pathName.join("/"));
  };

  useEffect(() => {
    if (contactId) {
      //@ts-ignore
      dispatch(initContactData({ contactId }));
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (!params.has("activeTab")) {
      params.append("activeTab", activeTab ?? "interactions");
      navigate(`${url.pathname}?${params.toString()}`);
    } else {
      params.set("activeTab", activeTab ?? "interactions");
      navigate(`${url.pathname}?${params.toString()}`);
    }
  }, [activeTab, navigate]);

  const stepsData = [
    {
      type: StepType.email,
      name: "John Doe",
      company: "Stripe",
      time: "22 January 2023 9:30 pm",
      text: "Got the go ahead and confirmation for our initial demo call",
    },
    {
      type: StepType.phone,
      name: "Jane Smith",
      company: "Acme Inc",
      time: "23 January 2023 3:45 pm",
      text: "Gave an early introduction to Zeon and scheduled a call to further discuss",
    },
  ];

  return (
    !isEmpty(selectedContact) ? (
      <Container>
        <LeftContainer>
          <Group my="lg" position="apart">
            <BackButton align="center" gap={8} onClick={handleBack}>
              <Image
                maw={16}
                color="#FFFFFF"
                mx="auto"
                src={leftArrowIcon}
                alt="back"
              />
              <Text size={14} weight={600} color="#3054B9">
                Contacts
              </Text>
              <Text size={14} weight={600} color="#3054B9">
                /
              </Text>
              <Text size={14} weight={600} color="#000">
                {selectedContact?.firstName}
              </Text>
            </BackButton>
          </Group>

          <Box>
            <TextInputWrapper
              label="First Name"
              placeholder="First Name"
              radius="md"
              value={selectedContact?.firstName}
              disabled
            />
            <TextInputWrapper
              label="Last Name"
              placeholder="Last Name"
              radius="md"
              value={selectedContact?.lastName}
              disabled
            />
            <TextInputWrapper
              label="Company"
              placeholder="Company"
              radius="md"
              value={selectedContact?.companyName}
              disabled
            />
            <TextInputWrapper
              label="Position"
              placeholder="Position"
              radius="md"
              value={selectedContact?.jobPosition}
              disabled
            />
            <TextInputWrapper
              label="Email"
              placeholder="your@email.com"
              icon={<Image maw={16} mx="auto" src={mailIcon} alt="mail" />}
              value={
                findPrimaryEmail(
                  selectedContact?.emailAddress
                ) || ""
              }
              radius="md"
              disabled
            />
            <TextInputWrapper
              label="Phone Number"
              placeholder="Phone Number"
              icon={<Image maw={16} mx="auto" src={phoneIcon} alt="phone" />}
              radius="md"
              value={
                findPrimaryPhoneNumIntl(
                  selectedContact?.phoneNumber
                ) || ""
              }
              disabled
            />
            <TextInputWrapper
              label="LinkedIn"
              placeholder="LinkedIn"
              icon={
                <Image maw={16} mx="auto" src={linkedinIcon} alt="linkedin" />
              }
              radius="md"
              value={selectedContact?.linkedInUrl}
              disabled
            />
          </Box>
        </LeftContainer>

        <MiddleContainer>
          <Group my="lg" position="left">
            {/* <Button
              style={{
                borderRadius: "8px",
                paddingTop: "8px",
                paddingBottom: "8px",
                color: "#344054",
                paddingLeft: "14px",
                border: "1px solid #D0D5DD",
                paddingRight: "14px",
              }}
              radius="xs"
              size="xs"
              fw={600}
              fs={{
                fontSize: "14px",
              }}
              leftIcon={
                <Image
                  maw={15}
                  mx="auto"
                  src={plusIcon}
                  alt="add interaction"
                />
              }
              color="dark"
              variant="outline"
            >
              Add an Interaction
            </Button> */}

            <Button
              style={{
                borderRadius: "8px",
                paddingTop: "8px",
                paddingBottom: "8px",
                color: "#344054",
                paddingLeft: "14px",
                border: "1px solid #D0D5DD",
                paddingRight: "14px",
              }}
              radius="xs"
              size="xs"
              fw={600}
              fs={{
                fontSize: "14px",
              }}
              leftIcon={
                <Image maw={15} mx="auto" src={noteIcon} alt="add note" />
              }
              color="dark"
              variant="outline"
              onClick={() => {
                dispatch(setShowNoteCreateModal(true));
              }}
            >
              Add Note
            </Button>

            <Button
              style={{
                borderRadius: "8px",
                paddingTop: "8px",
                paddingBottom: "8px",
                color: "#FFFFFF",
                paddingLeft: "14px",
                border: "1px solid #3C69E7",
                paddingRight: "14px",
                background: "#3C69E7",
              }}
              radius="xs"
              size="xs"
              fw={600}
              fs={{
                fontSize: "14px",
              }}
              leftIcon={
                <Image
                  maw={15}
                  mx="auto"
                  src={mailWhiteIcon}
                  alt="send email"
                />
              }
              color="dark"
              variant="outline"
            >
              Send E-Mail
            </Button>
          </Group>

          <Tabs
            variant="pills"
            defaultValue="interactions"
            radius={"md"}
            styles={(theme) => ({
              root: {
                marginTop: "16px",
              },
              tab: {
                ...theme.fn.focusStyles(),
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                letterSpacing: "0em",

                "&[data-active]": {
                  backgroundColor: "#F2F4F7",
                  color: "#000",
                },
                tabsList: {
                  display: "flex",
                },
              },
            })}
            value={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.List>
              {/* <Tabs.Tab value="interactions" h="28px">
                Interactions
              </Tabs.Tab> */}
              <Tabs.Tab value="notes" h="28px">
                Notes
              </Tabs.Tab>
              {/* <Tabs.Tab value="associated_lists" h="28px">
                Associated Lists
              </Tabs.Tab> */}
            </Tabs.List>

            <Tabs.Panel value="interactions">
              <Stepper steps={stepsData} />
            </Tabs.Panel>

            <Tabs.Panel value="notes">
              <div
                style={{
                  paddingTop: "16px",
                }}
              >
                <Note resourceId={selectedContact.contactId} resourceType={CRMResourceType.CONTACT} notes={selectedContact?.notes || []} />
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="associated_lists">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20%",
                }}
              >
                <Text size="lg">Coming Soon</Text>
              </div>
            </Tabs.Panel>
          </Tabs>
        </MiddleContainer>

        <RightContainer>
          <AdditonalData
            resourceId={selectedContact?.id || selectedContact?.contactId}
            type="contact"
            additionalValue={selectedContact?.additionalDatafields || {}}
          />
        </RightContainer>
        {showNoteCreateModal && (
          <CreateNoteModal
            resourceId={contactId || ""}
            resourceType={CRMResourceType.CONTACT}
            showNoteCreateModal={showNoteCreateModal}
          />
        )}
      </Container>
    ) : (
      <p> Loading </p>
    )
  );
}

export default ContactsDetails;
