import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await api.get(`/accounts/${USER_ID}`);
        setAccounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAccounts();
  }, []);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome to MoneyPetti
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Manage accounts, track transactions, and monitor your finances in one
        place.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Total Accounts</p>

          <h2 className="text-4xl font-bold text-slate-900">
            {accounts.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 mb-2">Total Balance</p>

          <h2 className="text-4xl font-bold text-green-600">
            ₹{totalBalance.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
