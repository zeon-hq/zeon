import { Button, Input } from "@mantine/core";

type Props = {};

const ForgotPassword = (props: Props) => {

  return (
    <div>
      <Input
        placeholder="Enter your email"
        type={"email"}
      />
      <Button radius="md">Send</Button>
    </div>
  );
};

export default ForgotPassword;
