import { Grid, Space } from "@mantine/core";
import ModuleCard from "components/Module/ModuleCard";
import Heading from "components/details/inbox/component/Heading";
import GuideCards from "components/ui-components/workspaces/GuideCards";
import { docsArray } from "util/Constant";
const Modules = () => {
  const modulesArrayData = [
    {
      title: "Communications & Ticketing",
      description:
        "Create channels to receive incoming messages & tickets. You can deploy a chat widget or embed them onto your website",
      docUrl: "https://www.google.com",
      isLaunched: true,
    }
  ];

  return (
    <>
      <Space h={24} />
      <Heading
        heading="Workspace Modules"
        subheading="Manage modules provisioned for your workspace"
      />
      <Space h={15} />
      <Grid>
        {modulesArrayData.map((data) => {
          return (
            <Grid.Col span={4}>
              <ModuleCard
                description={data.description}
                isLaunched={data.isLaunched}
                name={data.title}
                link={data.docUrl}
              />
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );
};

export default Modules;
