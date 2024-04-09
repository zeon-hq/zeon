export enum PricingPlan {
  ZEON_BASIC_MONTHLY = "zeon_basic_monthly",
  ZEON_ENTERPRISE_MONTHLY = "zeon_enterprise_monthly",
  ZEON_PROFESSIONAL_MONTHLY = "zeon_professional_monthly",
  ZEON_ADVANCED_MONTHLY = "zeon_advanced_monthly",
}

export const pricingPlanName: any = {
  [PricingPlan.ZEON_BASIC_MONTHLY]: "Basic",
  [PricingPlan.ZEON_ENTERPRISE_MONTHLY]: "Enterprise",
  [PricingPlan.ZEON_PROFESSIONAL_MONTHLY]: "Professional",
  [PricingPlan.ZEON_ADVANCED_MONTHLY]: "Advanced",
};

export const pricingPlanAllowedActions = {
  [PricingPlan.ZEON_ENTERPRISE_MONTHLY]: {
    AI_ACTIONS: "50k",
    CONVERSATIONS: "100k",
  },
  [PricingPlan.ZEON_PROFESSIONAL_MONTHLY]: {
    AI_ACTIONS: "3000",
    CONVERSATIONS: "30k",
  },
  [PricingPlan.ZEON_ADVANCED_MONTHLY]: {
    AI_ACTIONS: "1000",
    CONVERSATIONS: "10k",
  },
  [PricingPlan.ZEON_BASIC_MONTHLY]: {
    AI_ACTIONS: "0",
    CONVERSATIONS: "0",
  },
};


export const pricingPlanFeatures = {
  [PricingPlan.ZEON_BASIC_MONTHLY]: [
    "Unlimited Users",
    "Unlimited Channels",
    "Unlimited Messages",
    "Unlimited Integrations",
    "Unlimited AI Actions",
    "Unlimited Conversations",
  ],
  [PricingPlan.ZEON_ENTERPRISE_MONTHLY]: [
    "Unlimited Users",
    "Unlimited Channels",
    "Unlimited Messages",
    "Unlimited Integrations",
    "Unlimited AI Actions",
    "Unlimited Conversations",
  ],
  [PricingPlan.ZEON_PROFESSIONAL_MONTHLY]: [
    "Unlimited Users",
    "Unlimited Channels",
    "Unlimited Messages",
    "Unlimited Integrations",
    "Unlimited AI Actions",
    "Unlimited Conversations",
  ],
  [PricingPlan.ZEON_ADVANCED_MONTHLY]: [
    "Unlimited Users",
    "Unlimited Channels",
    "Unlimited Messages",
    "Unlimited Integrations",
    "Unlimited AI Actions",
    "Unlimited Conversations",
  ],
}