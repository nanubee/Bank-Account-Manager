import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import FD from "./pages/FD";
import RD from "./pages/RD";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [expanded, setExpanded] = useState(false);
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            expanded ? "ml-64" : "ml-20"
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/fds" element={<FD />} />
            <Route path="/rds" element={<RD />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
