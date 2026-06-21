import { useEffect, useState } from "react";
import api from "../api";
//import { USER_ID } from "../config";

function Dashboard() {
  //const USER_ID = localStorage.getItem("user_id");
  const [summary, setSummary] = useState({
    bank_balance: 0,
    fd_value: 0,
    rd_value: 0,
    mf_value: 0,
    stock_value: 0,
    asset_value: 0,
    total_net_worth: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get(`/dashboard/net-worth`);

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
        Welcome to MoneyPetti, {localStorage.getItem("full_name")} 👋
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
          <p className="text-slate-500 mb-2">Mutual Funds</p>

          <h2 className="text-3xl font-bold text-emerald-600">
            ₹{Number(summary.mf_value).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Stocks</p>

          <h2 className="text-3xl font-bold text-orange-600">
            ₹{Number(summary.stock_value).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Assets</p>

          <h2 className="text-3xl font-bold text-cyan-600">
            ₹{Number(summary.asset_value).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
          <p className="text-slate-500 mb-2">Total Net Worth</p>

          <h2 className="text-4xl font-bold text-slate-900">
            ₹{Number(summary.total_net_worth).toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
