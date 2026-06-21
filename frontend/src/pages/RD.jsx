import { useEffect, useState } from "react";
import api from "../api";

function RD() {
  const [accounts, setAccounts] = useState([]);
  const [rds, setRds] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");

  const [paymentDate, setPaymentDate] = useState("");
  const [selectedRD, setSelectedRD] = useState(null);

  const loadData = async () => {
    try {
      const accountsResponse = await api.get(`/accounts`);
      setAccounts(accountsResponse.data);

      const rdResponse = await api.get(`/rds/user`);
      setRds(rdResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createRD = async () => {
    try {
      await api.post("/rds/", {
        account_id: Number(selectedAccountId),
        monthly_amount: Number(monthlyAmount),
        interest_rate: Number(interestRate),
        start_date: startDate,
        duration_months: Number(durationMonths),
      });

      alert("RD created successfully");

      setSelectedAccountId("");
      setMonthlyAmount("");
      setInterestRate("");
      setStartDate("");
      setDurationMonths("");

      loadData();
    } catch (error) {
      console.log(error.response?.data);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item) => item.msg).join("\n"));
      } else {
        alert(detail || "Failed to create RD");
      }
    }
  };

  const payInstallment = async (rdId) => {
    if (!paymentDate) {
      alert("Select payment date");
      return;
    }

    try {
      await api.post(`/rds/${rdId}/payments`, {
        payment_date: paymentDate,
      });

      alert("Installment paid successfully");

      setPaymentDate("");

      if (selectedRD?.rd_id === rdId) {
        viewSummary(rdId);
      }

      loadData();
    } catch (error) {
      console.log(error.response?.data);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item) => item.msg).join("\n"));
      } else {
        alert(detail || "Payment Failed");
      }
    }
  };

  const viewSummary = async (rdId) => {
    try {
      const response = await api.get(`/rds/${rdId}/summary`);
      setSelectedRD(response.data);
    } catch (error) {
      console.log(error.response?.data);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item) => item.msg).join("\n"));
      } else {
        alert(detail || "Failed to load summary");
      }
    }
  };

  const deleteRD = async (rdId) => {
    try {
      await api.delete(`/rds/${rdId}`);

      alert("RD deleted successfully");

      loadData();
    } catch (error) {
      console.log(error.response?.data);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item) => item.msg).join("\n"));
      } else {
        alert(detail || "Failed to delete RD");
      }
    }
  };

  const closeRD = async (rdId) => {
    try {
      await api.post(`/rds/${rdId}/close`);

      alert("RD closed successfully");

      loadData();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item) => item.msg).join("\n"));
      } else {
        alert(detail || "Failed to close RD");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Recurring Deposits
      </h1>

      <p className="text-slate-500 mb-8">
        Create recurring deposits and track installment payments.
      </p>

      {/* Create RD */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New RD</h2>

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
            placeholder="Monthly Amount"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
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
          onClick={createRD}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Create RD
        </button>
      </div>

      {/* RD List */}

      <h2 className="text-2xl font-semibold mb-4">My Recurring Deposits</h2>

      <div className="grid gap-4">
        {rds.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            No recurring deposits found.
          </div>
        ) : (
          rds.map((rd) => {
            const linkedAccount = accounts.find(
              (account) => account.account_id === rd.account_id,
            );

            return (
              <div
                key={rd.rd_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              >
                <h3 className="font-bold text-lg mb-3">RD #{rd.rd_id}</h3>

                <p>
                  Linked Account: {linkedAccount?.bank_name}(
                  {linkedAccount?.account_number_last4})
                </p>

                <p>
                  Monthly Amount: ₹{Number(rd.monthly_amount).toLocaleString()}
                </p>

                <p>Interest Rate: {rd.interest_rate}%</p>

                <p>Duration: {rd.duration_months} months</p>

                <p>Start Date: {rd.start_date}</p>

                <p
                  className={
                    rd.status === "active"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {rd.status}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  {rd.status === "active" && (
                    <>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="border border-slate-300 rounded-xl p-2"
                      />

                      <button
                        onClick={() => payInstallment(rd.rd_id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                      >
                        Pay Installment
                      </button>

                      <button
                        onClick={() => closeRD(rd.rd_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                      >
                        Close RD
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => viewSummary(rd.rd_id)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900"
                  >
                    View Summary
                  </button>

                  {rd.status === "closed" && (
                    <button
                      onClick={() => deleteRD(rd.rd_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                    >
                      Delete RD
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}

      {selectedRD && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-8">
          <h2 className="text-2xl font-bold mb-4">RD Summary</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500">Total Paid</p>
              <h3 className="text-xl font-bold">
                ₹{Number(selectedRD.total_paid).toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-slate-500">Installments Paid</p>
              <h3 className="text-xl font-bold">
                {selectedRD.installments_paid}
              </h3>
            </div>

            <div>
              <p className="text-slate-500">Installments Remaining</p>
              <h3 className="text-xl font-bold">
                {selectedRD.installments_remaining}
              </h3>
            </div>

            <div>
              <p className="text-slate-500">Expected Maturity Amount</p>
              <h3 className="text-xl font-bold text-green-600">
                ₹{Number(selectedRD.expected_maturity_amount).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RD;
