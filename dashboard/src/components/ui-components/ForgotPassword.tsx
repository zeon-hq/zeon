import { Button, Input } from "@mantine/core";
import { useInputState } from "@mantine/hooks";

type Props = {};

const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useInputState("");

  return (
    <div>
      <Input
        placeholder="Enter your email"
        type={"email"}
        onChange={setEmail}
      />
      <Button radius="md">Send</Button>
    </div>
  );
};

export default ForgotPassword;
