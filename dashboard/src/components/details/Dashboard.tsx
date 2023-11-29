import { Grid, Space } from "@mantine/core";
import AnalyticsCard from "components/ui-components/AnalyticsCard";
import BarChart from "components/ui-components/BarChart";
import useDashboard from "hooks/useDashboard";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { workspaceInfo, showSidebar } = useDashboard();

  useEffect(() => {
    setUserData({
      labels: workspaceInfo.months.map((data: any) => data.label),
      datasets: [
        {
          label: "Message Sent",
          data: workspaceInfo.months.map((data: any) => data.value),
          backgroundColor: "#63ABFD",
          borderColor: "none",
          borderWidth: 0,
          borderRadius: 10,
        },
      ],
    });
  }, [workspaceInfo]);

  const [userData, setUserData] = useState({
    labels: workspaceInfo.months.map((data: any) => data.label),
    datasets: [
      {
        label: "Message Sent",
        data: workspaceInfo.months.map((data: any) => data.value),
        backgroundColor: "#63ABFD",
        borderColor: "none",
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  });

  return (
    <>
      <div>
        <Grid>
          <Grid.Col span={4}>
            <AnalyticsCard
              heading="Total Messages Sent This Month"
              text={workspaceInfo.messageCount.toString()}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <AnalyticsCard
              heading="Open Tickets"
              text={workspaceInfo.openTickets.toString()}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <AnalyticsCard
              heading="Closed Tickets"
              text={workspaceInfo.closedTickets.toString()}
            />
          </Grid.Col>
        </Grid>
        <Space h="xl" />
        <div>
          <BarChart chartData={userData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
