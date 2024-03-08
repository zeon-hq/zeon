import { Button, Space } from "@mantine/core"
import { notifications, showNotification } from "@mantine/notifications"
import { Label } from "components/ui-components"
import ZActionText from "components/ui-components/Button/ZActionText"
import ZCurrency from "components/ui-components/common/ZCurrency"
import ZDate from "components/ui-components/common/ZDate"
import ZSelect from "components/ui-components/common/ZSelect"
import ZTextInput from "components/ui-components/common/ZTextInput"
import ZInput from "components/ui-components/common/ZTextInput"
import { set } from "dot-prop"
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "finance/FinanceService"
import { ExpenseDetailsContainer } from "finance/styles"
import { ICategory, ITag } from "finance/type"
import useFinance from "finance/useFinance"
import { isEmpty } from "lodash"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { initFinance, setSelectedExpense } from "reducer/financeSlice"
import { getCRMDetailsMinimal } from "service/CoreService"
import { Trash } from "tabler-icons-react"
import AddVendorModal from "./component/AddVendorModal"
import ErrorMessage from "components/ui-components/common/ErrorMessage"

type Props = {}

const ExpenseDetails = (props: Props) => {
  const [options, setOptions] = useState<any>([])
  const [showAddVendorModal, setShowAddVendorModal] = useState(false)

  const {
    selectedExpense,
    tags,
    categories,
    getFlatCategories,
    expenseCreateMode,
    inCreateMode,
    vendorInfo,
  } = useFinance()
  const dispatch = useDispatch()
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    reset,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm()
  const navigate = useNavigate()

  const categoryOptions = getFlatCategories(categories || [])
  useEffect(() => {
    if (selectedExpense) {
      const categoryDefaultValue = categoryOptions.find(
        (option: any) => option.value === selectedExpense?.categoryId
      )
      reset({
        ...selectedExpense,
        invoiceNumber: selectedExpense.invoiceNumber || "",
        amount: {
          //@ts-ignore
          value: selectedExpense.amount?.value || "",
          currency: selectedExpense.amount?.currency || "USD",
        },
        tax: {
          //@ts-ignore
          value: selectedExpense.tax?.value || "",
          currency: selectedExpense.tax?.currency || "USD",
        },
        invoiceDate: new Date(selectedExpense?.invoiceDate) || new Date(),
        paymentDate: new Date(selectedExpense?.paymentDate) || new Date(),
        status: {
          label: selectedExpense?.status || "unpaid",
          value: selectedExpense?.status || "unpaid",
        },
        category: categoryDefaultValue,
        tags:
          selectedExpense?.tags?.map((tag: any) => ({
            label: tag,
            value: tag,
          })) || [],
        vendor: selectedExpense.vendor || "",
      })
    } else {
      reset({
        invoiceNumber: "",
        amount: {
          value: "",
          currency: "USD",
        },
        tax: {
          value: "",
          currency: "USD",
        },
        invoiceDate: null,
        paymentDate: null,
        status: {
          label: "unpaid",
          value: "unpaid",
        },
        category: "",
        tags: [],
        vendor: "",
      })
    }
  }, [selectedExpense, reset])

  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [selectedVendor, setSelectedVendor] = useState<any>() // [contactId, companyId

  const onSubmit = async (data: any) => {
    // get value of category
    const category = data?.category?.value || ""
    // gwt value of tags
    const tags = data?.tags?.map((tag: any) => tag.value) || []
    // get vendor
    const vendor = data?.vendor || ""
    const status = data?.status?.value || "unpaid"
    delete data.category
    const attachedDocuments = isEmpty(selectedExpense)
      ? expenseCreateMode?.attachedDocuments || []
      : selectedExpense?.attachedDocuments || []
    delete data.totalAmount

    if (!data.vendor) {
      setError("vendor", {
        type: "manual",
        message: "Vendor is required",
      })
      return
    }

    // check if amount.currency and tax.currency are same
    if (data.amount.currency !== data.tax.currency) {
      setError("tax", {
        type: "manual",
        message: "Currency of amount and tax should be same",
      })
      return
    }

    if (!data.amount.value) {
      // setError("amount", {
      //   type: "manual",
      //   message: "Amount is required",
      // })
      showNotification({
        title: "Error",
        message: "Amount is required",
        color: "red",
      })
      return
    }

    if (!data.tax.value) {
      // setError("tax", {
      //   type: "manual",
      //   message: "Tax is required",
      // })
      showNotification({
        title: "Error",
        message: "Tax is required",
        color: "red",
      })
      return
    }

    const expenseData = {
      ...data,
      categoryId: category,
      tags,
      vendor,
      workspaceId,
      status,
      attachedDocuments,
    }

    try {
      if (!selectedExpense) {
        const res = await createExpense(expenseData)
        showNotification({
          title: "Success",
          message: "Expense created successfully",
          color: "green",
        })
        //@ts-ignore
        dispatch(initFinance({ workspaceId}))
        reset()
        setSelectedVendor(null)
      } else {
        //@ts-ignore
        const res = await updateExpense({
          data: expenseData,
          expenseId: selectedExpense?.expenseId,
        })
        //@ts-ignore
        dispatch(initFinance({ workspaceId }))
        showNotification({
          title: "Success",
          message: "Expense updated successfully",
          color: "green",
        })
      }
      setSelectedVendor(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = async () => {
    console.log("delete")
    if (!selectedExpense?.expenseId) {
      showNotification({
        title: "Error",
        message: "Expense not selected",
        color: "red",
      })

      return
    }
    try {
      const res = await deleteExpense(selectedExpense?.expenseId)
      dispatch(setSelectedExpense(null))
      navigate(`/finance/${workspaceId}`)
      //@ts-ignore
      dispatch(initFinance({ workspaceId }))
      showNotification({
        title: "Success",
        message: "Expense deleted successfully",
        color: "green",
      })
    } catch (error) {
      console.log(error)
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      })
    }
  }

  const tagOptions = tags.map((tag: ITag) => ({
    label: tag.name,
    value: tag.name,
  }))
  const tagDefaultValue =
    selectedExpense?.tags?.map((tag: any) => ({
      label: tag,
      value: tag,
    })) || []

  useEffect(() => {}, [selectedExpense])

  useEffect(() => {
    if (selectedExpense) {
      setValue(
        "tags",
        selectedExpense.tags?.map((tag: any) => ({
          label: tag,
          value: tag,
        })) || []
      )
    }
  }, [selectedExpense, setValue])

  const onVendorChange = (option: any) => {
    clearErrors("vendor")
    setValue("vendor", option.value)
    setSelectedVendor(option)
  }

  return (
    <ExpenseDetailsContainer as="form">
      {/* create a vendor select component using ZSelect */}
      {/* <ZSelect
        label={"Vendor"}
        inputProps={{
          placeholder: "Vendor",
          required: true,
          options: options,
          defaultValue: {
            label: selectedExpense?.vendor,
            value: selectedExpense?.vendor,
          }
        }}
        formProps={{
          name: "vendor",
          control,
        }}
      /> */}
      <Label text="Vendor" />
      <Button
        className="secondary"
        onClick={() => setShowAddVendorModal(true)}
        variant="contained"
        fullWidth
      >
        {selectedVendor?.label
          ? selectedVendor?.label
          : vendorInfo?.[getValues()?.vendor]
          ? vendorInfo?.[getValues()?.vendor]?.name ||
            `${vendorInfo?.[getValues()?.vendor]?.firstName} ${
              vendorInfo?.[getValues()?.vendor]?.lastName
            }`
          : getValues()?.vendor
          ? getValues()?.vendor
          : "Add Vendor"}
      </Button>
      <ErrorMessage message={(errors?.vendor?.message as string) || ""} />
      <Space h="sm" />
      <ZTextInput
        inputProps={{
          label: "Invoice Number",
          placeholder: "Invoice Number",
          required: true,
          // defaultValue: selectedExpense?.invoiceNumber || "",
        }}
        formProps={{
          name: "invoiceNumber",
          control,
          // defaultValue: selectedExpense?.invoiceNumber || "",
          error: (errors?.invoiceNumber?.message as string) || "",
          rules: {
            required: "Invoice Number is required",
          },
        }}
      />
      <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Invoice Date",
          placeholder: "Invoice Date",
          required: true,

          //@ts-ignore
          // defaultValue: new Date(selectedExpense?.invoiceDate) || null,
        }}
        formProps={{
          name: "invoiceDate",
          control,
          rules: {
            required: "Invoice Date is required",
          },
        }}
      />
      <Space h="sm" />
      <ZDate
        inputProps={{
          label: "Payment Date",
          placeholder: "Payment Date",
          required: true,
          //@ts-ignore
          // defaultValue: new Date(selectedExpense?.paymentDate) || null,
        }}
        formProps={{
          name: "paymentDate",
          control,
          rules: {
            required: "Payment Date is required",
          },
        }}
      />
      <Space h="sm" />
      <ZCurrency
        control={control}
        name="amount"
        rules={{ required: true }}
        defaultValue={{
          //@ts-ignore
          value: selectedExpense?.amount?.value || "",
          currency: selectedExpense?.totalAmount?.currency || "USD",
        }}
        setValue={setValue}
        setError={setError}
        clearError={clearErrors}
        label="Amount"
        error={(errors?.amount?.message as string) || ""}
      />
      <Space h="sm" />
      <ZCurrency
        control={control}
        name="tax"
        rules={{ required: true }}
        defaultValue={{
          //@ts-ignore
          value: selectedExpense?.tax?.value || "",
          currency: selectedExpense?.tax?.currency || "USD",
        }}
        setValue={setValue}
        clearError={clearErrors}
        setError={setError}
        label="Tax"
        error={(errors?.tax?.message as string) || ""}
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
            { label: "Rejected", value: "rejected" },
          ],
          defaultValue: {
            label: selectedExpense?.status,
            value: selectedExpense?.status,
          },
        }}
        formProps={{
          name: "status",
          control,
          rules: {
            required: "Status is required",
          },
        }}
      />
      <Space h="sm" />
      <ZSelect
        label={"Category"}
        inputProps={{
          placeholder: "Category",
          required: true,
          options: categoryOptions,
        }}
        formProps={{
          name: "category",
          control,
        }}
      />
      <Space h="sm" />
      {/* <ZSelect
        label={"Tags"}
        inputProps={{
          placeholder: "Tags",
          isMulti: true,
          required: true,
          options: tagOptions,
        }}
        formProps={{
          name: "tags",
          control,
        }}
      />
      <Space h="sm" /> */}
      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        className="primary"
        fullWidth
        disabled={
          inCreateMode ? false : selectedExpense === null ? true : false
        }
      >
        Submit
      </Button>
      <Space h="sm" />
      {selectedExpense && (
        <ZActionText
          onClick={onDelete}
          secondaryColor="#fef3f2"
          label="Delete Expense"
          color="#d92d20"
          leftIcon={<Trash size="14px" />}
        />
      )}
      {showAddVendorModal && (
        <AddVendorModal
          opened={showAddVendorModal}
          close={() => setShowAddVendorModal(false)}
          workspaceId={workspaceId}
          callback={onVendorChange}
        />
      )}
    </ExpenseDetailsContainer>
  )
}

export default ExpenseDetails
