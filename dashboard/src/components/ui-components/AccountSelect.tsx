import {
  Grid,
  Select
} from "@mantine/core";
import { ISelectType } from "components/types";
import { MdKeyboardArrowDown } from "react-icons/md";
import { inputWrapperData } from "util/Constant";

interface IAccountSelect {
  value: string;
  onChange: (e: any) => void;
  label?: string;
  description?: string;
  placeHolder?: string;
  dropdownData: ISelectType[];
}

const AccountSelect = ({
  value,
  onChange,
  description,
  label,
  placeHolder,
  dropdownData,
}: IAccountSelect) => {
  return (
    <>
      <Grid mt={'16px'}>
        <Grid.Col>
          <Select
            label={label}
            rightSection={<MdKeyboardArrowDown />}
            description={description}
            placeholder={placeHolder}
            defaultValue={value}
            data={dropdownData}
            onChange={(e: string) => {
              onChange(e);
            }}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default AccountSelect;
