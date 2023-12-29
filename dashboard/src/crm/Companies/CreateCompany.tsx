import {
    Box,
    Button,
    Flex,
    Group,
    Image,
    Text,
    Textarea, // Import Textarea component from @mantine/core
    TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { setSelectedCompanyPage } from "reducer/crmSlice";
import userPlus from "assets/userPlusWhite.svg";
import leftArrowIcon from "assets/leftArrow.svg";

function CreateCompanies() {
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      email: "",
      phoneNumber: "",
      linkedin: "",
      logo: "",
      website: "",
      // Remove "about" from initialValues
      twitter: "",
      location: "",
      employeeCount: "",
      revenue: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const labelStyles = {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0em",
    color: "#344054",
  };

  const handleBack = () => {
    dispatch(setSelectedCompanyPage({ type: "all" }));
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
          size="xs"
          fw={600}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={userPlus} alt="add contact" />
          }
          color="dark"
          variant="outline"
        >
          Add Contact
        </Button>
      </Group>
      <Box mx="auto" mt="md" maw={452}>
        {/* ... Existing code for First Name, Last Name, Email, Phone, LinkedIn, etc. */}

        <TextInput
          label="Company Name"
          placeholder="Company Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("company")}
        />

        <TextInput
          label="Logo"
          placeholder="Logo URL"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("logo")}
        />

        <TextInput
          label="Website"
          placeholder="Website URL"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("website")}
        />

        {/* Replace TextInput with Textarea for "about" */}
        <Textarea
          label="About"
          placeholder="About the company"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("about")}
        />

        <TextInput
          label="Twitter"
          placeholder="Twitter URL"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("twitter")}
        />

        <TextInput
          label="Location"
          placeholder="Company Location"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("location")}
        />

        <TextInput
          label="Employee Count"
          placeholder="Number of Employees"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("employeeCount")}
        />

        <TextInput
          label="Revenue"
          placeholder="Company Revenue"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("revenue")}
        />
      </Box>
    </form>
  );
}

export default CreateCompanies;