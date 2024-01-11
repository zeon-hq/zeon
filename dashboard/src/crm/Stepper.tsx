import React from 'react';
import styled from 'styled-components';

import mailIcon from 'assets/mail.svg';
import phoneIcon from 'assets/phoneCall.svg';

export enum StepType {
  email = 'email',
  phone = 'phone',
}

interface StepData {
  type: StepType;
  name: string;
  company: string;
  time: string;
  text: string;
}

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 18px 0;
  position: relative;
`;

const StepIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 10px;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #333; // Default text color
`;

const StepLine = styled.div`
  position: absolute;
  top: 30px;
  left: 2%;
  width: 2px;
  height: 90%;
  background-color: #eaecf0;
`;

const EmailColor = styled.span`
  color: #344054;
`;

const ActionColor = styled.span`
  color: #475467;
`;

const NameColor = styled.span`
  color: #3054B9;
`;

interface StepperProps {
  steps?: StepData[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  return (
    <StepperContainer>
      {steps && steps.map((step, index) => (
        <Step key={index}>
          {index < steps.length - 1 && <StepLine />}
          <StepIcon src={step.type === 'email' ? mailIcon : phoneIcon} alt={step.type} />
          <StepContent>
            <StepText>
              <EmailColor>{step.type === 'email' ? 'E-Mail' : 'Phone'}</EmailColor>
              <ActionColor>{step.type === 'email' ? ' sent to' : ' made to'}</ActionColor>
              <NameColor> {step.name}</NameColor>
              <ActionColor> at</ActionColor>
              <NameColor> {step.company}</NameColor>
              <ActionColor> on</ActionColor>
              <ActionColor> {step.time}</ActionColor>
            </StepText>
            <StepText style={{ marginTop: '8px' }}>{step.text}</StepText>
          </StepContent>
        </Step>
      ))}
    </StepperContainer>
  );
};

export default Stepper;
