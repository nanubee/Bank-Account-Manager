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
import MF from "./pages/MF";
import Stock from "./pages/Stock";
import Assets from "./pages/Assets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

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
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/fds" element={<FD />} />
            <Route path="/rds" element={<RD />} />
            <Route path="/mfs" element={<MF />} />
            <Route path="/stocks" element={<Stock />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
