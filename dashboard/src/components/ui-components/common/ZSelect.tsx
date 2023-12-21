import { Control, Controller, RegisterOptions } from "react-hook-form";
import Select, { Props as SelectProps } from "react-select";
import ZLabel from "./ZLabel";
import { Space } from "@mantine/core";
import ErrorMessage from "./ErrorMessage";

type Props = {
  label: string;
  formProps: {
    control: Control<any>;
    name: string;
    rules?: RegisterOptions;
    defaultValue?: string;
    error?: string | undefined;
  };
  inputProps: SelectProps;
};
const styles = {
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: '#D0D5DD',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '6px',
    fontColor: '#344054',
    fontSize: '14px',
    fontWeight: '500',
  }),
}

const ZSelect = (props: Props) => {
  const { formProps, inputProps, label } = props;
  return (
    <>
      <ZLabel label={label} />
      <Space h="4px" />
      {/* <Controller
        {...formProps}

        render={({ field }) => (
            <Select
            {...field}
            {...inputProps}
            value={field.value}
            styles={styles}
            onChange={(e) => {
                field.onChange(e.value);
            }}
            />
        )}
        /> */}

      <Controller
        {...formProps}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <Select
            {...inputProps}
            onChange={onChange}
            styles={styles}
          />
        )}
      />
      {formProps.error && <ErrorMessage message={formProps.error} />}
    </>
  );
};

export default ZSelect;
