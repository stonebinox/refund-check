export interface RefundRequestSchema {
  name: string;
  timezone: string;
  createdAt: number;
  requestSource: string;
  investmentTs: number;
  refundTs: number;
}
