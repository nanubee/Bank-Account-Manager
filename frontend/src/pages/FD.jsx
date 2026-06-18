import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function FD() {
  const [accounts, setAccounts] = useState([]);
  const [fds, setFDs] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");

  const loadData = async () => {
    try {
      const accountsResponse = await api.get(`/accounts/${USER_ID}`);
      setAccounts(accountsResponse.data);

      const fdResponse = await api.get(`/fds/user/${USER_ID}`);
      setFDs(fdResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createFD = async () => {
    try {
      await api.post("/fds/", {
        account_id: Number(selectedAccountId),
        amount: Number(amount),
        interest_rate: Number(interestRate),
        start_date: startDate,
        duration_months: Number(durationMonths),
      });

      alert("FD created successfully");

      setSelectedAccountId("");
      setAmount("");
      setInterestRate("");
      setStartDate("");
      setDurationMonths("");

      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to create FD");
    }
  };

  const closeFD = async (fdId) => {
    try {
      await api.post(`/fds/${fdId}/close`);

      alert("FD closed successfully");

      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to close FD");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Fixed Deposits</h1>

      <p className="text-slate-500 mb-8">Create and manage fixed deposits.</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New FD</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="border border-slate-300 rounded-xl p-3"
          >
            <option value="">Select Account</option>

            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.bank_name} (...{account.account_number_last4})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-slate-300 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Interest Rate (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="border border-slate-300 rounded-xl p-3"
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-slate-300 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Duration (Months)"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            className="border border-slate-300 rounded-xl p-3"
          />
        </div>

        <button
          onClick={createFD}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Create FD
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Fixed Deposits</h2>

      <div className="grid gap-4">
        {fds.map((fd) => (
          <div
            key={fd.fd_id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h3 className="font-bold text-lg mb-3">FD #{fd.fd_id}</h3>

            <p>Amount: ₹{Number(fd.amount).toLocaleString()}</p>

            <p>Interest Rate: {fd.interest_rate}%</p>

            <p>Duration: {fd.duration_months} months</p>

            <p>
              Maturity Amount: ₹{Number(fd.maturity_amount).toLocaleString()}
            </p>

            <p
              className={
                fd.status === "active"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {fd.status}
            </p>

            {fd.status === "active" && (
              <button
                onClick={() => closeFD(fd.fd_id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Close FD
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FD;
