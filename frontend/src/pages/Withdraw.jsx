import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Withdraw() {
  const [accounts, setAccounts] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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

  const withdrawMoney = async () => {
    if (!selectedAccountId || !amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/transactions/withdraw", {
        account_id: Number(selectedAccountId),
        amount: Number(amount),
        description,
      });

      alert("Withdrawal successful");

      setSelectedAccountId("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Withdrawal failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900">Withdraw Funds</h1>

      <p className="text-slate-500 mt-2 mb-8">
        Withdraw money from any of your accounts.
      </p>

      {/* Withdraw Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-6">Withdrawal Details</h2>

        <div className="space-y-5">
          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Account
            </label>

            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Account</option>

              {accounts.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.bank_name} (...{account.account_number_last4})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>

            <input
              type="number"
              placeholder="Enter withdrawal amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <input
              type="text"
              placeholder="ATM Withdrawal, Shopping, Bills..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Withdraw Button */}
          <button
            onClick={withdrawMoney}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
          >
            Withdraw Money
          </button>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
