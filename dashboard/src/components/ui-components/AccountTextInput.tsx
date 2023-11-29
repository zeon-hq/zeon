import { Grid, TextInput } from "@mantine/core";
import { Label } from "components/ui-components";
import { inputWrapperData } from "util/Constant";

interface IAccountTextInput {
  value: string;
  onChange: (e: any) => void;
  label?: string;
  description?: string;
  placeHolder?: string;
  type?: string;
}

const AccountTextInput = ({
  value,
  onChange,
  description,
  label,
  placeHolder,
  type
}: IAccountTextInput) => {
  return (
    <>
      {label && <Label text={label} />}
      <Grid>
        <Grid.Col>
          <TextInput
            inputWrapperOrder={inputWrapperData}
            description={description}
            value={value}
            type={type || "text"}
            placeholder={placeHolder}
            onChange={onChange}
            maxLength={30}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default AccountTextInput;
