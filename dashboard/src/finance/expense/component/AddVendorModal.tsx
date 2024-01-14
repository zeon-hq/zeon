import React, { useEffect } from "react";
import { Button, Modal, Space, Text, TextInput } from "@mantine/core";
import { Label } from "components/ui-components";
import { showNotification } from "@mantine/notifications";
import { setOptions } from "react-chartjs-2/dist/utils";
import { getCRMDetailsMinimal } from "service/CoreService";
import styled from "styled-components";
import debounce from "lodash/debounce";

type Props = {
  opened: boolean;
  close: () => void;
  workspaceId: string | undefined;
  callback: (vendorId: string) => void;
};

const Container = styled.div<{
  selected: boolean;
}>`
  padding: 12px;
  border-radius: var(--radius-none, 0px);
  border-bottom: 1px solid var(--Gray-200, #eaecf0);
  &:first-of-type {
    border-top: 1px solid var(--Gray-200, #eaecf0);
  }
  cursor: pointer;
  //   margin-bottom: 8px;
  &:hover {
    background: var(--Gray-50, #f9fafb);
  }
  font-size: 12px;
  font-weight: 500;
`;

const ModalTile = styled.div`
  font-size: 12px;

  font-weight: 600;
`;

const VendorName = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const styles = {
  body: {
    padding: 0,
  },
  content: {
    height: "400px",
  },
};

const AddVendorModal = ({ opened, close, workspaceId, callback }: Props) => {
  const [options, setOptions] = React.useState<any>(null);
  const [selectedVendor, setSelectedVendor] = React.useState<any>(null); // [contactId, companyId
  const fetchCRMDetails = async () => {
    try {
      if (!workspaceId) return;
      const res = await getCRMDetailsMinimal(workspaceId);
      const { data } = res;
      const contactOptions = data?.contacts?.map((contact: any) => ({
        label: contact?.firstName + " " + contact?.lastName,
        value: contact?.contactId,
      }));
      const companyOptions = data?.companies?.map((company: any) => ({
        label: company?.name,
        value: company?.companyId,
      }));
      const computedOptions = {
        contacts: contactOptions,
        companies: companyOptions,
      };
      // const computedOptions = [...contactOptions, ...companyOptions];
      setOptions(computedOptions);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error fetching CRM details",
        color: "red",
      });
      setOptions([]);
    }
  };

  const handleVendorClick = (vendor: any) => {
    setSelectedVendor(vendor.value);
    close();
    callback(vendor);
  };

  useEffect(() => {
    try {
      fetchCRMDetails();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    /**
     * options : {
     *  contacts: [],
     *  companies: []
     * }
     */
    const filteredContacts = options?.contacts?.filter((contact: any) => {
      return contact.label.toLowerCase().includes(value.toLowerCase())})
    
    const filteredCompanies = options?.companies?.filter((company: any) => {
        return company.label.toLowerCase().includes(value.toLowerCase())})
    const computedOptions = {
        contacts: filteredContacts,
        companies: filteredCompanies,
        };
    setOptions(computedOptions);
  }

  const handleSearchDebounced = debounce(handleSearch, 800);

  return (
    <Modal
      styles={styles}
      opened={opened}
      onClose={close}
      title={<ModalTile>Select Vendor</ModalTile>}
      centered
    >
        <TextInput
            placeholder="Search..."
            radius="sm"
            px={12}
            mb={12}
            onChange={handleSearchDebounced}
        />
      {options?.contacts.map((contact: any) => {
        return (
          <Container
            selected={selectedVendor === contact.value}
            onClick={() => {
              handleVendorClick(contact);
            }}
          >
            {" "}
            <VendorName>{contact.label}</VendorName>{" "}
          </Container>
        );
      })}
      {options?.companies.map((company: any) => {
        return (
          <Container
            selected={selectedVendor === company.value}
            onClick={() => {
              handleVendorClick(company);
            }}
          >
            <VendorName>{company.label}</VendorName>
          </Container>
        );
      })}
    </Modal>
  );
};

export default AddVendorModal;
