export type PlanName = "starter" | "campaign" | "pro" | "authority";

export type PlanStatus = {
  hasPlan: boolean;
  planName?: PlanName;
  details?: string;
};
