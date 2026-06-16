import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [transactions, setTransactions] = useState([]);

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

  const loadTransactions = async (accountId) => {
    try {
      const response = await api.get(`/transactions/${accountId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccountChange = (e) => {
    const accountId = e.target.value;

    setSelectedAccountId(accountId);

    if (accountId) {
      loadTransactions(accountId);
    } else {
      setTransactions([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>

      <p className="text-slate-500 mt-2 mb-8">
        View transaction history for all your accounts.
      </p>

      {/* Account Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Account
        </label>

        <select
          value={selectedAccountId}
          onChange={handleAccountChange}
          className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Account</option>

          {accounts.map((account) => (
            <option key={account.account_id} value={account.account_id}>
              {account.bank_name} (...{account.account_number_last4})
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No transactions found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">
                  Type
                </th>

                <th className="text-left p-4 font-semibold text-slate-700">
                  Amount
                </th>

                <th className="text-left p-4 font-semibold text-slate-700">
                  Description
                </th>

                <th className="text-left p-4 font-semibold text-slate-700">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.transaction_type === "deposit"
                          ? "bg-green-100 text-green-700"
                          : transaction.transaction_type === "withdraw"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {transaction.transaction_type}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-slate-900">
                    ₹{Number(transaction.amount).toLocaleString()}
                  </td>

                  <td className="p-4 text-slate-600">
                    {transaction.description}
                  </td>

                  <td className="p-4 text-slate-500">
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
