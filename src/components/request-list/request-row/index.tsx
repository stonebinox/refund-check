import React from "react";
import moment from "moment-timezone";

import { ProcessedRequestSchema } from "../../../types/ProcessedRequestSchema";

interface RequestProps {
  request: ProcessedRequestSchema;
}

export const RequestRow: React.FC<RequestProps> = ({ request }) => {
  const {
    name,
    approved,
    createdAt,
    investmentTs,
    timezone,
    refundTs,
    registeredTs,
    requestSource,
  } = request;

  const signupTime = moment(createdAt * 1000);
  const investmentTime = moment(investmentTs * 1000);
  const refundTime = moment(refundTs * 1000);
  const registeredTime = moment(registeredTs * 1000);
  const approvedClass = approved ? "approved" : "rejected";
  const approvedStatus = approvedClass.toUpperCase(); // just a shortcut to display the status for the scope of this assignment - ideally there would be a CTA or a proper string associated with the resultant status

  return (
    <div className="request-row">
      <div>{name}</div>
      <div>{timezone.toUpperCase()}</div>
      <div>{signupTime.format("DD MMM YYYY")}</div>
      <div>{investmentTime.format("dddd, DD MMM YYYY HH:mm:ss")}</div>
      <div>{refundTime.format("dddd, DD MMM YYYY HH:mm:ss")}</div>
      <div>{registeredTime.format("dddd, DD MMM YYYY HH:mm:ss")}</div>
      <div>{requestSource}</div>
      <div className={approvedClass}>{approvedStatus}</div>
    </div>
  );
};
