import {
    Box,
    Group,
    Textarea, // Import Textarea component from @mantine/core
    TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { setSelectedContactPage } from "reducer/crmSlice";

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
    dispatch(setSelectedContactPage({ type: "all" }));
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Group m="lg" pt={20} position="apart">
        {/* ... Existing code for back button and Add Contact button */}
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