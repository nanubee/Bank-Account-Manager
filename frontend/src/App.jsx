import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/accounts" element={<Accounts />} />

        <Route path="/deposit" element={<Deposit />} />

        <Route path="/withdraw" element={<Withdraw />} />

        <Route path="/transactions" element={<Transactions />} />

        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
