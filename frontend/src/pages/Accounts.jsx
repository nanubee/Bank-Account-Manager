import { useEffect, useState } from "react";
import api from "../api";
//import { USER_ID } from "../config";

function Accounts() {
  //const USER_ID = localStorage.getItem("user_id");
  const [accounts, setAccounts] = useState([]);

  const [bankName, setBankName] = useState("");
  const [country, setCountry] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");

  const loadAccounts = async () => {
    try {
      const response = await api.get(`/accounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const createAccount = async () => {
    if (!/^\d{4}$/.test(accountNumber)) {
      alert("Account number must contain exactly 4 digits");
      return;
    }

    try {
      await api.post("/accounts", {
        //user_id: USER_ID,
        bank_name: bankName,
        country,
        account_type: accountType,
        account_number_last4: accountNumber,
        balance: Number(balance),
        currency,
      });

      await loadAccounts();

      setBankName("");
      setCountry("");
      setAccountType("");
      setAccountNumber("");
      setBalance("");
      setCurrency("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;

    setCountry(selectedCountry);

    if (selectedCountry === "India") {
      setCurrency("INR");
    } else if (selectedCountry === "Kuwait") {
      setCurrency("KWD");
    } else {
      setCurrency("");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/accounts/${accountId}`);

      alert("Account deleted successfully");

      loadAccounts();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-slate-900">My Accounts</h1>

      <p className="text-slate-500 mt-2 mb-8">
        Manage all your bank accounts in one place.
      </p>

      {/* Create Account Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-6">Add New Account</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <select
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={country}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Other">Other</option>
          </select>
          <input
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            type="text"
            placeholder="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          />

          <input
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            type="text"
            maxLength="4"
            placeholder="Last 4 Digits"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          <input
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <input
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            type="text"
            placeholder="Currency"
            value={currency}
            disabled={country === "India" || country === "Kuwait"}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        {accountNumber.length > 0 && accountNumber.length !== 4 && (
          <p className="text-red-500 text-sm mt-3">
            Account number must contain exactly 4 digits
          </p>
        )}

        <button
          onClick={createAccount}
          className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          Create Account
        </button>
      </div>

      {/* Accounts Grid */}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Accounts Overview
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.account_id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
          >
            <h3 className="text-xl font-bold text-slate-900">
              {account.bank_name}
            </h3>

            <p className="text-slate-500 mt-1">{account.account_type}</p>

            <div className="mt-6">
              <p className="text-sm text-slate-500">Balance</p>

              <p className="text-3xl font-bold text-emerald-600">
                {account.currency} {Number(account.balance).toLocaleString()}
              </p>
            </div>

            <div className="mt-6 text-sm text-slate-500 space-y-1">
              <p>Card: **** {account.account_number_last4}</p>
              <p>Country: {account.country}</p>
              <p>ID: {account.account_id}</p>
            </div>

            <button
              onClick={() => handleDeleteAccount(account.account_id)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Accounts;
