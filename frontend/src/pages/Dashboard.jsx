import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [summary, setSummary] = useState({
    bank_balance: 0,
    fd_value: 0,
    rd_value: 0,
    total_net_worth: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/net-worth");
        setSummary(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome to MoneyPetti
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Manage accounts, track transactions, and monitor your finances in one
        place.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Bank Balance</p>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{Number(summary.bank_balance).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">FD Value</p>

          <h2 className="text-3xl font-bold text-blue-600">
            ₹{Number(summary.fd_value).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">RD Value</p>

          <h2 className="text-3xl font-bold text-purple-600">
            ₹{Number(summary.rd_value).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Net Worth</p>

          <h2 className="text-3xl font-bold text-slate-900">
            ₹{Number(summary.total_net_worth).toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
