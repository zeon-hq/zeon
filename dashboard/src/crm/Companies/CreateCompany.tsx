import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Select,
  Text,
  Textarea, // Import Textarea component from @mantine/core
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { setSelectedCompanyPage } from "reducer/crmSlice";
import userPlus from "assets/userPlusWhite.svg";
import leftArrowIcon from "assets/leftArrow.svg";
import twitterIcon from "assets/twitter.svg";
import linkedinIcon from "assets/linkedin.svg";
import globeIcon from "assets/globe.svg";
import locationIcon from "assets/location.svg";
import employeeCountIcon from "assets/employee_count.svg";
import revenueIcon from "assets/revenue.svg";
import phoneIcon from "assets/phoneCall.svg";
import { createCompany, editCompany } from "service/CRMService";
import { showNotification } from "@mantine/notifications";
import useDashboard from "hooks/useDashboard";
import useCrm from "hooks/useCrm";
import { useState } from "react"

function CreateCompanies() {
  const dispatch = useDispatch();
  const { workspaceInfo } = useDashboard();
  const { selectedCompanyPage } = useCrm();
  const [loading, setLoading] = useState(false);

  const editValues = selectedCompanyPage?.companyData;

  const form = useForm({
    initialValues: {
      name: editValues?.name || "",
      url: editValues?.url || "",
      description: editValues?.description || "",
      linkedInUrl: editValues?.linkedInUrl || "",
      xUrl: editValues?.xUrl || "",
      location: editValues?.location || "",
      phoneNumber: editValues?.phoneNumber || "",
      companySize: editValues?.companySize || "",
      companyWorth: editValues?.companyWorth || "",
    },
    validate: {
      phoneNumber: (value) =>
        /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(
          value
        )
          ? null
          : "Invalid phone number, Please use international format",
    },
  });

  const labelStyles = {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0em",
    color: "#344054",
  };

  const employeeCountOptions = [
    { value: "micro", label: "1-10" },
    { value: "small", label: "11-50" },
    { value: "medium", label: "51-200" },
    { value: "large", label: "201-500" },
    { value: "xlarge", label: "501-1000" },
    { value: "xxlarge", label: "1001-5000" },
    { value: "xxxlarge", label: "5001-10000" },
    { value: "super", label: "10000+" },
  ];

  const revenueOptions = [
    { value: "micro", label: "0-1M" },
    { value: "small", label: "1M-10M" },
    { value: "medium", label: "10M-50M" },
    { value: "large", label: "50M-100M" },
    { value: "xlarge", label: "100M-500M" },
    { value: "xxlarge", label: "500M-1B" },
    { value: "xxxlarge", label: "1B-5B" },
    { value: "super", label: "5B-10B" },
    { value: "mega", label: "10B+" },
  ];

  const handleBack = () => {
    dispatch(setSelectedCompanyPage({ type: "all" }));
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      data.workspaceId = workspaceInfo.workspaceId;
      data.phoneNumber = [data?.phoneNumber];
      
      if (editValues?.companyId) {
        await editCompany(editValues?.companyId, data);
      } else {
        await createCompany(data);
      }

      showNotification({
        title: "Success",
        message: `Company ${editValues?.companyId ? "updated" : "created"} successfully`,
        color: "blue",
        icon: null,
        autoClose: 5000,
      });
      dispatch(setSelectedCompanyPage({ type: "all" }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: `Company ${editValues?.companyId ? "update" : "creation"} failed`,
        color: "red",
        icon: null,
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group m="lg" position="apart">
        <Flex
          align={"center"}
          gap={8}
          onClick={handleBack}
          style={{
            cursor: "pointer",
          }}
        >
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
            Create
          </Text>
        </Flex>
        <Button
          type="submit"
          style={{
            borderRadius: "8px",
            paddingTop: "8px",
            paddingBottom: "8px",
            color: "#FFFFFF",
            paddingLeft: "14px",
            border: "1px solid #3C69E7",
            paddingRight: "14px",
            marginRight: "10px",
            background: "#3C69E7",
          }}
          radius="xs"
          loading={loading}
          size="xs"
          fw={600}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={userPlus} alt="add company" />
          }
          color="dark"
          variant="outline"
        >
          {editValues?.companyId ? "Update" : "Add"} Company
        </Button>
      </Group>
      <Box mx="auto" mt="md" maw={452}>
        <TextInput
          label="Company Name"
          placeholder="Company Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Website"
          placeholder="Website URL"
          icon={
            <Image src={globeIcon} alt="website URL" width={15} height={15} />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("url")}
        />

        <Textarea
          label="About"
          placeholder="About the company"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("description")}
        />

        <TextInput
          label="LinkedIn"
          placeholder="LinkedIn URL"
          icon={
            <Image
              src={linkedinIcon}
              alt="linkedin URL"
              width={18}
              height={18}
            />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("linkedInUrl")}
        />

        <TextInput
          label="Twitter"
          placeholder="Twitter URL"
          icon={
            <Image src={twitterIcon} alt="twitter URL" width={15} height={15} />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("xUrl")}
        />

        <TextInput
          label="Location"
          placeholder="Company Location"
          icon={
            <Image
              src={locationIcon}
              alt="company location"
              width={15}
              height={18}
            />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("location")}
        />

        <TextInput
          label="Phone Number"
          placeholder="Company Phone Number"
          icon={
            <Image
              src={phoneIcon}
              alt="company location"
              width={15}
              height={15}
            />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("phoneNumber")}
        />

        <Select
          label="Employee Count"
          data={employeeCountOptions}
          placeholder="Number of Employees"
          min={0}
          icon={
            <Image
              src={employeeCountIcon}
              alt="employee count"
              width={15}
              height={15}
            />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("companySize")}
        />

        <Select
          label="Company Worth"
          data={revenueOptions}
          placeholder="Company Worth"
          min={0}
          icon={
            <Image
              src={revenueIcon}
              alt="company worth"
              width={13}
              height={18}
            />
          }
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("companyWorth")}
        />
      </Box>
    </form>
  );
}

export default CreateCompanies;
