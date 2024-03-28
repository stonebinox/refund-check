import { RefundRequestSchema } from "./RefundRequestSchema";

export interface ProcessedRequestSchema extends RefundRequestSchema {
  approved: boolean;
  registeredTs: number;
}
