import React from "react";

import "./app.css";
import { RequestList } from "./components/request-list";

function App() {
  return (
    <div className="app">
      <h2>Refund Requests</h2>
      <RequestList />
    </div>
  );
}

export default App;
