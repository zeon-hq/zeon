import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import leftArrowIcon from "assets/leftArrow.svg";
import linkedinIcon from "assets/linkedin.svg";
import mailIcon from "assets/mail.svg";
import phoneIcon from "assets/phoneCall.svg";
import userPlus from "assets/userPlusWhite.svg";
import { findPrimaryEmail, findPrimaryPhoneNumE164 } from "crm/utils";
import useCrm from "hooks/useCrm";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedContactPage } from "reducer/crmSlice";
import { createContact, editContact, fetchAllCompaniesPair } from "service/CRMService";

function CreateContact() {
  const dispatch = useDispatch();
  const { workspaceInfo } = useDashboard();
  const { selectedContactPage } = useCrm();

  const editValues = selectedContactPage?.contactData;

  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: editValues?.firstName || "",
      lastName: editValues?.lastName || "",
      companyId: editValues?.companyId || "",
      jobPosition: editValues?.jobPosition || "",
      emailAddress: findPrimaryEmail(editValues?.emailAddress) || "",
      phoneNumber: findPrimaryPhoneNumE164(editValues?.phoneNumber) || "",
      linkedInUrl: editValues?.linkedInUrl || "",
    },
    validate: {
      emailAddress: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      phoneNumber: (value) =>
        /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(
          value
        )
          ? null
          : "Invalid phone number, Please use international format",
      linkedInUrl: (value) =>
        /^https:\/\/www.linkedin.com\/.*/.test(value)
          ? null
          : "Invalid LinkedIn URL",
    },
  });

  const labelStyles = {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0em",
    color: "#344054",
  };

  useEffect(() => {
    fetchAllCompaniesPair(workspaceInfo.workspaceId || "").then((res) => {
      setCompanyOptions(res.data);
    });
  }, [workspaceInfo.workspaceId]);

  const handleBack = () => {
    dispatch(setSelectedContactPage({ type: "all" }));
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      data.workspaceId = workspaceInfo.workspaceId;
      data.emailAddress = [data?.emailAddress];
      data.phoneNumber = [data?.phoneNumber];

      if (selectedContactPage?.type === "edit") {
        await editContact(selectedContactPage?.contactData?.contactId, data);
      } else {
      await createContact(data);
      }

      showNotification({
        title: "Success",
        message: "Contact created successfully",
        color: "blue",
        icon: null,
        autoClose: 5000,
      });
      dispatch(setSelectedContactPage({ type: "all" }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Contact creation failed",
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
            Contacts
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
          size="xs"
          fw={600}
          loading={loading}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={userPlus} alt="add contact" />
          }
          color="dark"
          variant="outline"
        >
          {selectedContactPage?.type === "edit" ? "Save" : "Add"} Contact
        </Button>
      </Group>
      <Box mx="auto" mt="md" maw={452}>
        <TextInput
          label="First Name"
          placeholder="First Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("lastName")}
        />
        <Select
          data={companyOptions}
          label="Company"
          placeholder="Company"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("companyId")}
        />
        <TextInput
          label="Position"
          placeholder="Position"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("jobPosition")}
        />
        <TextInput
          label="Email"
          placeholder="your@email.com"
          icon={<Image maw={16} mx="auto" src={mailIcon} alt="mail" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("emailAddress")}
        />
        <TextInput
          label="Phone Number"
          placeholder="Phone Number"
          icon={<Image maw={16} mx="auto" src={phoneIcon} alt="phone" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("phoneNumber")}
        />
        <TextInput
          label="LinkedIn"
          placeholder="LinkedIn"
          icon={<Image maw={16} mx="auto" src={linkedinIcon} alt="linkedin" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("linkedInUrl")}
        />
      </Box>
    </form>
  );
}

export default CreateContact;
