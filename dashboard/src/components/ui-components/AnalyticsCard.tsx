import React from "react";
import { Card, Space, Text } from "@mantine/core";

type Props = {
  heading: string;
  text: string;
  
};

const AnalyticsCard = ({ heading, text }: Props) => {
  return (
    <Card sx={{ boxShadow:"0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)", borderRadius:"8px", width: "100%", border: "1px solid #EAECF0" }} p="md" mt={16}>
      
      <Text weight={500} style={{color:"#475467"}}> {heading } </Text>
        <Space h="md" />
      <Text style={{color:"#101828", fontWeight:"600", fontSize:"36px"}} size="lg">{text}</Text>

    </Card>
  );
};

export default AnalyticsCard;
