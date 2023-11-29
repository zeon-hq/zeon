import { Text } from "@mantine/core";
import useDashboard from "hooks/useDashboard";
import styled from "styled-components";
import { Logout } from "tabler-icons-react";
import { logOutUtils } from "util/dashboardUtils";

const Wrapper = styled.div`
  position: absolute;
  bottom: 15px;
  border-top: 1px solid #e9ecef;
  width: 290px;
`;

const Info = styled.div`
  padding: 10px 10px;
  display: grid;
  display: flex;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const FooterSection = () => {
  const { user } = useDashboard();

  return (
    <>
      <Wrapper>
        <Info>
          <div>
            <Text size="sm" weight={600}>
              {" "}
              {`${user.name}`}{" "}
            </Text>
            <Text size="xs" style={{ color: "#373A40" }}>
              {" "}
              {user.email}{" "}
            </Text>
          </div>
          <IconContainer>
            <Logout size={22} strokeWidth={1} onClick={logOutUtils} />
          </IconContainer>
        </Info>
      </Wrapper>
    </>
  );
};

export default FooterSection;
