import React from "react";
import { Box, Grid, Text, Anchor, Space, Button } from "@mantine/core";
import styled from "styled-components";

type Props = {
  date: string;
  paid: boolean;
};

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InvoiceDiv = ({ date, paid }: Props) => {
  return (
    <Box>
      <Grid gutter="xs" sx={{ borderBottom: "1px solid #F1F3F5" }}>
        <Grid.Col span={8}>
          <Text size="sm">Invoice Billed for {date}</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <FlexBox>
            <Text size="sm" color={paid ? "green" : "red"}>
              {paid ? "Paid" : "Pending"}
            </Text>
          </FlexBox>
        </Grid.Col>
        <Grid.Col span={2}>
          <FlexBox>
            {paid ? (
              <Anchor href="" size="sm">
                Download Invoice
              </Anchor>
            ) : (
              <Button radius="md" size="xs" className="primary">
                {" "}
                Pay Now{" "}
              </Button>
            )}
          </FlexBox>
        </Grid.Col>
      </Grid>
      <Space h={20}></Space>
    </Box>
  );
};

export default InvoiceDiv;
