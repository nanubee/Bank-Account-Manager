import { useEffect, useState } from "react";
import api from "../api";
//import { USER_ID } from "../config";

function Transfer() {
  //const USER_ID = localStorage.getItem("user_id");
  const [accounts, setAccounts] = useState([]);

  const [selectedFromAccountId, setSelectedFromAccountId] = useState("");
  const [selectedToAccountId, setSelectedToAccountId] = useState("");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await api.get(`/accounts`);
        setAccounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAccounts();
  }, []);

  const transferMoney = async () => {
    if (!selectedFromAccountId || !selectedToAccountId || !amount) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedFromAccountId === selectedToAccountId) {
      alert("Sender and receiver accounts cannot be the same");
      return;
    }

    try {
      await api.post("/transactions/transfer", {
        from_account_id: Number(selectedFromAccountId),
        to_account_id: Number(selectedToAccountId),
        amount: Number(amount),
        description,
      });

      alert("Transfer successful");

      setSelectedFromAccountId("");
      setSelectedToAccountId("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Transfer failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900">Transfer Funds</h1>

      <p className="text-slate-500 mt-2 mb-8">
        Move money between your accounts securely and instantly.
      </p>

      {/* Transfer Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-6">Transfer Details</h2>

        <div className="space-y-5">
          {/* Sender Account */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From Account
            </label>

            <select
              value={selectedFromAccountId}
              onChange={(e) => setSelectedFromAccountId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Sender Account</option>

              {accounts.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.bank_name} (...{account.account_number_last4})
                </option>
              ))}
            </select>
          </div>

          {/* Receiver Account */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To Account
            </label>

            <select
              value={selectedToAccountId}
              onChange={(e) => setSelectedToAccountId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Receiver Account</option>

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
              placeholder="Enter transfer amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <input
              type="text"
              placeholder="Reason for transfer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Transfer Button */}
          <button
            onClick={transferMoney}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Transfer Money
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
