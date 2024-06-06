import useDashboard from "hooks/useDashboard";
import React, { useEffect } from "react";
import { Button, Text, Container } from "@mantine/core";
import axios from "axios";
import { FallbackProps } from "react-error-boundary";

const ErrorBoundaryHelper: React.FC<FallbackProps> = ({
  error: propError,
  resetErrorBoundary,
}) => {
  const { user } = useDashboard();

  const reset = () => {
    resetErrorBoundary();
    window.location.reload();
  }
  
  const handleErrorLogging = async (error: string) => {
    if (window.location.hostname !== "app.zeonhq.com") return;

    try {
      await axios.post(
        "https://discord.com/api/webhooks/1247953988893020213/8w9dByZJfkif_PPXi5EjT53m4TJQTl3dYvrL92rl83HMQXjmGFyrEu5lP5rW3oTTJ9Ht",
        {
          content: `Error: ${error}`,
          embeds: [
            {
              title: "Error",
              fields: [
                {
                  name: "User Info",
                  value: JSON.stringify(user),
                },
                {
                  name: "URL",
                  value: window.location.href,
                },
                {
                  name: "User Agent",
                  value: navigator.userAgent,
                },
              ],
            },
          ],
          attachments: [],
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (propError) {
      if (typeof propError === "object") {
        handleErrorLogging(JSON.stringify(propError));
      } else {
        handleErrorLogging(propError);
      }
    }
  }, [propError]);

  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Text size="lg" weight={500}>
        Sorry, Something went wrong
      </Text>
      <Text size="md" color="dimmed">
        Please refresh the page
      </Text>
      <Button
        variant="outline"
        color="gray"
        mt="md"
        onClick={reset}
      >
        Refresh
      </Button>
    </Container>
  );
};

export default ErrorBoundaryHelper;
