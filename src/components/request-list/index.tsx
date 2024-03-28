import React from "react";

import "./request-list.css";
import { useData } from "../../hooks/use-data/use-data";
import { RequestRow } from "./request-row";
import { ProcessedRequestSchema } from "../../types/ProcessedRequestSchema";

export const RequestList: React.FC = () => {
  const requests: ProcessedRequestSchema[] = useData();

  return (
    <div className="request-list">
      <div className="request-row">
        <div>
          <strong>Name</strong>
        </div>
        <div>
          <strong>Timezone</strong>
        </div>
        <div>
          <strong>Signed up on</strong>
        </div>
        <div>
          <strong>Invested on</strong>
        </div>
        <div>
          <strong>Refund requested on</strong>
        </div>
        <div>
          <strong>Refund registered on</strong>
        </div>
        <div>
          <strong>Source</strong>
        </div>
        <div>
          <strong>Status</strong>
        </div>
      </div>
      {requests.map((request, i) => (
        <RequestRow key={i} request={request} />
      ))}
    </div>
  );
};
