import React from "react";

import "./request-list.css";
import { useData } from "../../hooks/use-data/use-data";
import { Request } from "./request-row";

export const RequestList = () => {
  const requests = useData();

  console.log(requests);
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
        <Request key={i} request={request} />
      ))}
    </div>
  );
};
