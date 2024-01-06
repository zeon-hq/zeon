import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Sx,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import leftArrowIcon from "assets/leftArrow.svg";
import linkedinIcon from "assets/linkedin.svg";
import noteIcon from "assets/note.svg";
import phoneIcon from "assets/phoneCall.svg";
import plusIcon from "assets/plus.svg";
import { useDispatch } from "react-redux";
import {
  initCompanyData,
  setSelectedCompanyPage,
  setShowNoteCreateModal,
} from "reducer/crmSlice";
import styled from "styled-components";
import Stepper from "../Stepper";

import twitterIcon from "assets/twitter.svg";
import globeIcon from "assets/globe.svg";
import locationIcon from "assets/location.svg";
import employeeCountIcon from "assets/employee_count.svg";
import revenueIcon from "assets/revenue.svg";
import useCrm from "hooks/useCrm";
import CreateNoteModal from "crm/CreateNoteModal";
import { CRMResourceType } from "crm/type";
import Note from "crm/Notes/Note";
import {
  companySizeFormatter,
  companyWorthFormatter,
  findPrimaryPhoneNumIntl,
} from "crm/utils";
import { useEffect, useState } from "react";
import { fetchCompany } from "service/CRMService";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const PanelStyle: Sx = {
  padding: "0",
  height: "calc(100vh - 163px)",
  overflowY: "auto",
};

const LeftContainer = styled.div`
  width: 40%;
  margin-right: 2%;
  margin-left: 2%;
`;

const RightContainer = styled.div`
  width: 60%;
  border-left: 1px solid #e1e1e1;
  padding-left: 2%;
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

function CompaniesDetails() {
  const dispatch = useDispatch();
  const { selectedCompanyPage, showNoteCreateModal } = useCrm();

  const [activeTab, setActiveTab] = useState<string | null>(
    selectedCompanyPage.activeTab ?? "interactions"
  );
  const [companyData, setCompanyData] = useState<any>(
    selectedCompanyPage?.companyData
  );

  const handleBack = () => {
    dispatch(setSelectedCompanyPage({ type: "all" }));
  };

  // fetch id from url
  const resourceId = companyData?.companyId || "";

  useEffect(() => {
    // if companyData only contains id not other data, fetch data from backend
    if (companyData?.id && !companyData?.name) {
      // fetch data from backend
      fetchCompany(companyData?.id).then((res) => {
        setCompanyData(res.data);
      });
    }
  }, [companyData]);

  // const stepsData = [
  //   {
  //     type: StepType.email,
  //     name: "John Doe",
  //     company: "Stripe",
  //     time: "22 January 2023 9:30 pm",
  //     text: "Got the go ahead and confirmation for our initial demo call",
  //   },
  //   {
  //     type: StepType.phone,
  //     name: "Jane Smith",
  //     company: "Acme Inc",
  //     time: "23 January 2023 3:45 pm",
  //     text: "Gave an early introduction to Zeon and scheduled a call to further discuss",
  //   },
  // ];

  useEffect(() => {
    //@ts-ignore
    dispatch(initCompanyData({companyId:selectedCompanyPage?.companyData?.companyId}));
  })

  return (
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
              Companies
            </Text>
            <Text size={14} weight={600} color="#3054B9">
              /
            </Text>
            <Text size={14} weight={600}>
              Zeon
            </Text>
          </BackButton>
        </Group>

        <Box>
          <TextInputWrapper
            label="Company Name"
            placeholder="Company Name"
            value={companyData?.name}
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Website"
            placeholder="Website URL"
            value={companyData?.url}
            icon={
              <Image src={globeIcon} alt="website URL" width={15} height={15} />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="About"
            placeholder="About the company"
            radius="md"
            value={companyData?.description}
            disabled
          />

          <TextInputWrapper
            label="LinkedIn"
            placeholder="LinkedIn URL"
            value={companyData?.linkedInUrl}
            icon={
              <Image
                src={linkedinIcon}
                alt="linkedin URL"
                width={18}
                height={18}
              />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Twitter"
            placeholder="Twitter URL"
            value={companyData?.xUrl}
            icon={
              <Image
                src={twitterIcon}
                alt="twitter URL"
                width={15}
                height={15}
              />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Location"
            placeholder="Company Location"
            value={companyData?.location}
            icon={
              <Image
                src={locationIcon}
                alt="company location"
                width={15}
                height={18}
              />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Phone Number"
            placeholder="Company Phone Number"
            value={findPrimaryPhoneNumIntl(companyData?.phoneNumber)}
            icon={
              <Image
                src={phoneIcon}
                alt="company location"
                width={15}
                height={15}
              />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Employee Count"
            placeholder="Number of Employees"
            value={companySizeFormatter(companyData?.companySize)}
            icon={
              <Image
                src={employeeCountIcon}
                alt="employee count"
                width={15}
                height={15}
              />
            }
            radius="md"
            disabled
          />

          <TextInputWrapper
            label="Company Worth"
            placeholder="Company Worth"
            value={companyWorthFormatter(companyData?.companyWorth)}
            icon={
              <Image
                src={revenueIcon}
                alt="company worth"
                width={13}
                height={18}
              />
            }
            radius="md"
            disabled
          />
        </Box>
      </LeftContainer>

      <RightContainer>
        <Group pt={20} position="left">
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
              <Image maw={15} mx="auto" src={plusIcon} alt="add interaction" />
            }
            color="dark"
            variant="outline"
          >
            Add an Interaction
          </Button>

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
            <Tabs.Tab value="interactions" h="28px">
              Interactions
            </Tabs.Tab>
            <Tabs.Tab value="notes" h="28px">
              Notes
            </Tabs.Tab>
            <Tabs.Tab value="associated_lists" h="28px">
              Associated Lists
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel sx={PanelStyle} value="interactions">
            <Stepper />
          </Tabs.Panel>

          <Tabs.Panel sx={PanelStyle} value="notes">
            <div
              style={{
                paddingTop: "16px",
              }}
            >
              <Note notes={companyData?.notes || []} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel sx={PanelStyle} value="associated_lists">
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
      </RightContainer>
      {showNoteCreateModal && (
        <CreateNoteModal
          resourceId={resourceId}
          resourceType={CRMResourceType.COMPANY}
          showNoteCreateModal={showNoteCreateModal}
        />
      )}
    </Container>
  );
}

export default CompaniesDetails;
