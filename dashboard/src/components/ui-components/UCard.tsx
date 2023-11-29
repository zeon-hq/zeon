import React from "react";
import { Card, Group, Text, Button } from "@mantine/core";

type Props = {
  heading: string;
  text: string;
  buttonText: string;
  cardAbout: string;
  onClick: () => void;
  loading?: boolean;
};

const UCard = ({
  heading,
  cardAbout,
  text,
  buttonText,
  onClick,
  loading = false,
}: Props) => {
  return (
    <Card
      sx={{
        width: "100%",
        border: "1px solid #E9ECEF",
        backgroundColor: "#F1F3F5",
        height: "35vh",
      }}
      p="md"
      mt={16}
    >
      <Text size="xs" weight={600}>
        {" "}
        {cardAbout}{" "}
      </Text>

      <Group position="apart" mb={10} mt={10}>
        <Text weight={600}>{heading}</Text>
      </Group>

      <Text size="xs">{text}</Text>

      <Button
        radius="md"
        loading={loading}
        onClick={onClick}
        color="indigo"
        variant="outline"
        style={{ position: "absolute", bottom: "20px" }}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default UCard;
