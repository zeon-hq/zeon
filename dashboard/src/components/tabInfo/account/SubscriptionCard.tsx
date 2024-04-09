import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 284px; // Adjust the width as necessary
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: auto;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 50px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
`;

const Price = styled.div`
  margin-bottom: 20px;
`;

const PriceValue = styled.span`
  font-size: 24px;
  color: #333;
`;

const PerMonth = styled.span`
  display: block;
  color: #666;
  font-size: 14px;
`;

const SubscribeButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Feature = styled.li`
  margin-bottom: 10px;
  color: #333;
  &.no-ai {
    color: #ff4141;
  }
`;

export type SubscriptionCardProps = {
    title: string;
    description: string;
    price: number;
    features: string[];
    productId: string;
    hasPlan ?: boolean;
    isCurrent ?: boolean;

}

const SubscriptionCard = ({
    title,
    description,
    price,
    features,
    productId,
    hasPlan
}:SubscriptionCardProps) => {
  return (
    <Card>
      <Header>
        <Logo src="zeon-logo.png" alt="Zeon Logo" />
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Header>
      <Price>
        <PriceValue>${price}</PriceValue>
        <PerMonth>per month</PerMonth>
      </Price>
      <SubscribeButton>Subscribe</SubscribeButton>
      <FeaturesList>
        {
            features.map((feature, index) => (
                <Feature key={index}>{feature}</Feature>
            ))
        }
        {/* <Feature>5 Users</Feature>
        <Feature>2 Chat Channels</Feature>
        <Feature>Unlimited Tickets</Feature>
        <Feature>Public Support</Feature>
        <Feature className="no-ai">No AI Agents!</Feature> */}
      </FeaturesList>
    </Card>
  );
};

export default SubscriptionCard;
