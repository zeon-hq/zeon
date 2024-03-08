import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { TextInput, Select, Text } from "@mantine/core";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { error } from "console";
import ErrorMessage from "./ErrorMessage";

type Props = {
  control: Control<any>;
  name: string;
  rules?: any;
  setValue: UseFormSetValue<any>;
  setError: any;
  label: string;
  error ?: string | undefined;
  defaultValue?: {
    value: string;
    currency: string;
  };
  clearError: any;
};

const ZCurrency = ({
  control,
  name,
  rules,
  defaultValue,
  setValue,
  label,
  setError,
  clearError,
  error
}: Props) => {
  const [commaSeparatedValue, setCommaSeparatedValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [decimalDigits, setDecimalDigits] = useState(2);
  const inputRef = useRef<HTMLInputElement>(null);

  type CurrencyData = {
    [key: string]: {
      symbol: string;
      name: string;
      symbol_native: string;
      decimal_digits: number;
      rounding: number;
      code: string;
      name_plural: string;
    };
  };

  const currencyData: CurrencyData = require("constants/commonCurrency.json");

  useEffect(() => {
    if (currencyData[currency]) {
      setSymbol(currencyData[currency].symbol);
      setDecimalDigits(currencyData[currency].decimal_digits);
    }
    setValue(`${name}.currency`, currency);
  }, [currency]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = event.target.selectionStart;
    const { value } = event.target;
    setValue(`${name}.value`, parseFloat(value.replace(/[^0-9.]/g, "")));
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")).toFixed(2);
    // const formattedValue = numericValue.replace(
    //   new RegExp(`\\B(?=(\\d{${decimalDigits}})+(?!\\d))`, "g"),
    //   ","
    // );
    setCommaSeparatedValue(numericValue);
    if (inputRef.current) {
      inputRef.current.selectionStart = cursorPosition;
      inputRef.current.selectionEnd = cursorPosition;
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setCommaSeparatedValue(defaultValue.value);
      setCurrency(defaultValue.currency);

      setValue(
        `${name}.value`,
        parseFloat(defaultValue.value.replace(/[^0-9.]/g, ""))
      );
      setValue(`${name}.currency`, defaultValue.currency);
    }
  }, [defaultValue, name]);

  const handleCurrencyChange = (value: string) => setCurrency(value);
 console.log(error)
  return (
    <>
      <TextInput
        label={label}
        type="text"
        value={commaSeparatedValue}
        icon={<Text size="sm">{symbol}</Text>}
        onChange={handleInputChange}
        ref={inputRef}
        rightSection={
          <Select
            data={Object.keys(currencyData)}
            value={currency}
            onChange={handleCurrencyChange}
          />
        }
        rightSectionWidth={100}
      />
      {
        error && <ErrorMessage message={error} />
      }
    </>
  );
};

export default ZCurrency;
