import { Space } from "@mantine/core";
import Heading from "components/details/inbox/component/Heading";
import AddKnowledgeBaseFile from "components/ui-components/AddKnowledgeBaseFile";
import { useState } from "react";
import { Plus } from "tabler-icons-react";


const Knowledge = () => {
  const [openAddDataModal, setOpenAddDataModal] = useState(false);

  return (
    <div>
      <Heading
        heading="Memory Management"
        subheading="Give your co-pilot contextual information about anything"
        showDivider
        onSave={() => {
          setOpenAddDataModal(true);
        }}
        buttonText="Add file"
        icon={<Plus />}
      />
      <Space h="10px" />

      {
        openAddDataModal &&
        <div style={{
          fontFamily:'Inter !important'
        }}>
        <AddKnowledgeBaseFile
          opened={openAddDataModal}
          onClose={() => setOpenAddDataModal(false)}
        />
        </div>
      }

    </div>
  )
}

export default Knowledge