import { RefundRequestSchema } from "../types/RefundRequestSchema";

export const data: RefundRequestSchema[] = [
  {
    name: "Emma Smith",
    timezone: "pst",
    createdAt: 1577919600,
    requestSource: "phone",
    investmentTs: 1609563600,
    refundTs: 1609574400,
  },
  {
    name: "Benjamin Johnson",
    timezone: "cet",
    createdAt: 1581462000,
    requestSource: "web",
    investmentTs: 1609565400,
    refundTs: 1612216800,
  },
  {
    name: "Olivia Davis",
    timezone: "cet",
    createdAt: 1580511600,
    requestSource: "web",
    investmentTs: 1612267200,
    refundTs: 1612292400,
  },
];
