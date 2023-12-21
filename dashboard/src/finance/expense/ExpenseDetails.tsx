import { Space } from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import ZActionText from "components/ui-components/Button/ZActionText";
import ZCurrency from "components/ui-components/common/ZCurrency";
import ZDate from "components/ui-components/common/ZDate";
import ZSelect from "components/ui-components/common/ZSelect";
import ZTextInput from "components/ui-components/common/ZTextInput";
import ZInput from "components/ui-components/common/ZTextInput";
import { createExpense, deleteExpense } from "finance/FinanceService";
import { ExpenseDetailsContainer } from "finance/styles";
import useFinance from "finance/useFinance";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { initFinance } from "reducer/financeSlice";
import { Trash } from "tabler-icons-react";

type Props = {};

const ExpenseDetails = (props: Props) => {
  const  {
    selectedExpense
  } = useFinance();
  const dispatch = useDispatch();
  const { control, setValue, handleSubmit, setError, formState:{
    errors
  }} = useForm({
    defaultValues: {
      ...selectedExpense,
      amount: selectedExpense?.totalAmount?.value || "",
      tax: selectedExpense?.tax?.value || "",
      invoiceDate: selectedExpense?.invoiceDate || "",
      paymentDate: selectedExpense?.paymentDate || "",
      status: selectedExpense?.status || "unpaid",
      category: selectedExpense?.categoryId || "",
      tags: selectedExpense?.tags?.map((tag: any) => ({ label: tag, value: tag })) || [],
      vendor: selectedExpense?.vendor || "",
    }
  });
  const {workspaceId} = useParams<{workspaceId: string}>();

  const onSubmit = async (data: any) => {
    console.log(data);
    // get value of category
    const category = data?.category?.value || "";
    // gwt value of tags
    const tags = data?.tags?.map((tag: any) => tag.value) || [];
    // get vendor
    const vendor = data?.vendor?.value || "";
    const status = data?.status?.value || "unpaid";
    delete data.category;
 
    // check if amount.currency and tax.currency are same
    if(data.amount.currency !== data.tax.currency) {
      setError("tax", {
        type: "manual",
        message: "Currency of amount and tax should be same"
      })
      return;
    }
    
    const expenseData = {
      ...data,
      categoryId: category,
      tags,
      vendor,
      workspaceId,
      status    };

    try {
      const res = await createExpense(expenseData);
      //@ts-ignore
      dispatch(initFinance({workspaceId}));
      console.log(res);
    } catch (error) {
      console.log(error);

    }
  };

  const onDelete = async () => {
    console.log("delete");
    if(!selectedExpense?.expenseId) {
     showNotification({
        title: "Error",
        message: "Expense not selected",
        color: "red",
     })

      return;
    }
    try {
        const res = await deleteExpense(selectedExpense?.expenseId);
        //@ts-ignore
        dispatch(initFinance({workspaceId}));
        showNotification({
          title: "Success",
          message: "Expense deleted successfully",
          color: "green",
        })
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      })
      
    }
  }

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
          defaultValue: {
            label: selectedExpense?.vendor || "Vendor 1",
            value: selectedExpense?.vendor || "vendor1"
          }
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
          defaultValue: selectedExpense?.invoiceNumber || "",
          error: errors?.invoiceNumber?.message || "",
          rules: {
            required: "Invoice Number is required",
          }
        }}
      />
       <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Invoice Date",
          placeholder: "Invoice Date",
          required: true,

          //@ts-ignore
          defaultValue: new Date(selectedExpense?.invoiceDate) || null,
        }}
        formProps={{
          name: "invoiceDate",
          control,
          rules: {
            required: "Invoice Date is required",
          }
        }}
      />
       <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Payment Date",
          placeholder: "Payment Date",
          required: true,
          //@ts-ignore
          defaultValue: new Date(selectedExpense?.paymentDate) || null,
        }}
        formProps={{
          name: "paymentDate",
          control,
          rules: {
            required: "Payment Date is required",
          }
        }}
      />
       <Space h="sm" />
      <ZCurrency
        control={control}
        name="amount"
        rules={{ required: true }}
        defaultValue={
        {
          //@ts-ignore
          value: selectedExpense?.amount?.value || "",
          currency: selectedExpense?.totalAmount?.currency || "USD"
        }
        }
        setValue={setValue}
        label="Amount"
        
      />
       <Space h="sm" />
      <ZCurrency
        control={control}
        name="tax"
        rules={{ required: true }}
        defaultValue={
          {
            //@ts-ignore
            value: selectedExpense?.tax?.value || "",
            currency: selectedExpense?.tax?.currency || "USD"
          }
        }
        setValue={setValue}
        label="Tax"
        error={errors?.tax?.message || ""}
      />
       <Space h="sm" />
       {/* Status */}
        <ZSelect
          label={"Status"}
          inputProps={{
            placeholder: "Status",
            required: true,
            options: [
              { label: "Paid", value: "paid" },
              { label: "Unpaid", value: "unpaid" },
              { label: "Rejected", value: "rejected"},

            ],
            defaultValue: {
              label: selectedExpense?.status || "Unpaid",
              value: selectedExpense?.status || "unpaid"
            }
          }}
          formProps={{
            name: "status",
            control,
            rules: {
              required: "Status is required",
            }
          }}
        />
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
          control
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
      <ZActionText onClick={onDelete} secondaryColor="#fef3f2" label="Delete Expense" color="#d92d20" leftIcon={<Trash size="14px" />} />
    </ExpenseDetailsContainer>
  );
};

export default ExpenseDetails;
