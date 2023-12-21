import { DateInput, DateInputProps } from "@mantine/dates";
import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type Props = {
  formProps: {
    control: Control<any>;
    name: string;
    rules?: RegisterOptions;
    defaultValue?: string;
    error?: string | undefined;
  };

  inputProps: DateInputProps;
};

const ZDate = (props: Props) => {
  const { formProps, inputProps } = props;

  return (
    <>
      <Controller
        {...formProps}
        render={({ field }) => <DateInput {...field} {...inputProps} />}
      />
      {
        formProps.error && <ErrorMessage message={formProps.error} />
      }
    </>
  );
};

export default ZDate;
