import { Space } from "@mantine/core";
import ZCurrency from "components/ui-components/common/ZCurrency";
import ZDate from "components/ui-components/common/ZDate";
import ZSelect from "components/ui-components/common/ZSelect";
import ZTextInput from "components/ui-components/common/ZTextInput";
import ZInput from "components/ui-components/common/ZTextInput";
import { createExpense } from "finance/FinanceService";
import { ExpenseDetailsContainer } from "finance/styles";
import useDashboard from "hooks/useDashboard";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

type Props = {};

const ExpenseDetails = (props: Props) => {
  const { control, setValue, handleSubmit } = useForm();
  const {workspaceId} = useParams<{workspaceId: string}>();
  const onSubmit = async (data: any) => {
    console.log(data);
    // get value of category
    const category = data?.category?.value || "";
    // gwt value of tags
    const tags = data?.tags?.map((tag: any) => tag.value) || [];
    // get vendor
    const vendor = data?.vendor?.value || "";
    delete data.category;
    
    const expenseData = {
      ...data,
      categoryId: category,
      tags,
      vendor,
      workspaceId,
    };

    try {
      const res = await createExpense(expenseData);
      console.log(res);
    } catch (error) {
      console.log(error);

    }
  };

  return (
    <ExpenseDetailsContainer as="form">
      {/* create a vendor select component using ZSelect */}
      <ZSelect
        label={"Vendor"}
        inputProps={{
          placeholder: "Vendor",
          required: true,
          options: [
            { label: "Vendor 1", value: "vendor1" },
            { label: "Vendor 2", value: "vendor2" },
          ],
        }}
        formProps={{
          name: "vendor",
          control,
        }}
      />
      <Space h="sm" />
      <ZTextInput
        inputProps={{
          label: "Invoice Number",
          placeholder: "Invoice Number",
          required: true,
        }}
        formProps={{
          name: "invoiceNumber",
          control,
        }}
      />
       <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Invoice Date",
          placeholder: "Invoice Date",
          required: true,
        }}
        formProps={{
          name: "invoiceDate",
          control,
        }}
      />
       <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Payment Date",
          placeholder: "Payment Date",
          required: true,
        }}
        formProps={{
          name: "paymentDate",
          control,
        }}
      />
       <Space h="sm" />
      <ZCurrency
        control={control}
        name="amount"
        rules={{ required: true }}
        defaultValue=""
        setValue={setValue}
        label="Amount"
      />
       <Space h="sm" />
      <ZCurrency
        control={control}
        name="tax"
        rules={{ required: true }}
        defaultValue=""
        setValue={setValue}
        label="Tax"
      />
       <Space h="sm" />
      <ZSelect
        label={"Category"}
        inputProps={{
          placeholder: "Category",
          required: true,
          options: [
            { label: "Cash", value: "cash" },
            { label: "Credit Card", value: "creditCard" },
          ],
        }}
        formProps={{
          name: "category",
          control,
        }}
      />
        <Space h="sm" />
      <ZSelect
        label={"Tags"}
        inputProps={{
          placeholder: "Tags",
          isMulti: true,
          required: true,
          options: [
            { label: "Tag 1", value: "tag1" },
            { label: "Tag 2", value: "tag2" },
            { label: "Tag 3", value: "tag3"}
          ],
        }}
        formProps={{
          name: "tags",
          control,
        }}
      />

      <input type="submit" onClick={handleSubmit(onSubmit)} />
    </ExpenseDetailsContainer>
  );
};

export default ExpenseDetails;
