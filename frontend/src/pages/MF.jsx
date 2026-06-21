import { useEffect, useState } from "react";
import api from "../api";

function MF() {
  const [accounts, setAccounts] = useState([]);
  const [mfs, setMFs] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [fundName, setFundName] = useState("");
  const [investedAmount, setInvestedAmount] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [editFundName, setEditFundName] = useState("");
  const [editInvestedAmount, setEditInvestedAmount] = useState("");
  const [editCurrentValue, setEditCurrentValue] = useState("");

  const loadData = async () => {
    try {
      const accountsResponse = await api.get(`/accounts`);
      setAccounts(accountsResponse.data);

      const mfResponse = await api.get(`/mfs/user`);
      setMFs(mfResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createMF = async () => {
    try {
      await api.post("/mfs/", {
        account_id: Number(selectedAccountId),
        fund_name: fundName,
        invested_amount: Number(investedAmount),
        current_value: Number(currentValue),
        purchase_date: purchaseDate,
      });

      alert("Mutual Fund added successfully");

      setSelectedAccountId("");
      setFundName("");
      setInvestedAmount("");
      setCurrentValue("");
      setPurchaseDate("");

      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed");
    }
  };

  const deleteMF = async (id) => {
    try {
      await api.delete(`/mfs/${id}`);

      alert("Mutual Fund deleted");

      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (mf) => {
    setEditingId(mf.mf_id);

    setEditFundName(mf.fund_name);
    setEditInvestedAmount(mf.invested_amount);
    setEditCurrentValue(mf.current_value);
  };

  const updateMF = async () => {
    try {
      await api.put(`/mfs/${editingId}`, {
        fund_name: editFundName,
        invested_amount: Number(editInvestedAmount),
        current_value: Number(editCurrentValue),
      });

      alert("Mutual Fund updated");

      setEditingId(null);

      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Mutual Funds</h1>

      <p className="text-slate-500 mb-8">Track your mutual fund investments.</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Mutual Fund</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option value="">Select Account</option>

            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.bank_name} (...{account.account_number_last4})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Fund Name"
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Invested Amount"
            value={investedAmount}
            onChange={(e) => setInvestedAmount(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Current Value"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>

        <button
          onClick={createMF}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Add Mutual Fund
        </button>
      </div>
      <div className="grid gap-4">
        {mfs.map((mf) => {
          const linkedAccount = accounts.find(
            (account) => account.account_id === mf.account_id,
          );

          return (
            <div
              key={mf.mf_id}
              className="bg-white rounded-2xl p-6 shadow-sm border"
            >
              {editingId === mf.mf_id ? (
                <>
                  <input
                    value={editFundName}
                    onChange={(e) => setEditFundName(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <input
                    type="number"
                    value={editInvestedAmount}
                    onChange={(e) => setEditInvestedAmount(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <input
                    type="number"
                    value={editCurrentValue}
                    onChange={(e) => setEditCurrentValue(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <button
                    onClick={updateMF}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl mr-2"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-slate-500 text-white px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{mf.fund_name}</h3>

                  <p>
                    Linked Account: {linkedAccount?.bank_name} (
                    {linkedAccount?.account_number_last4})
                  </p>

                  <p>
                    Invested: ₹{Number(mf.invested_amount).toLocaleString()}
                  </p>

                  <p>Current: ₹{Number(mf.current_value).toLocaleString()}</p>

                  <p>
                    Gain/Loss: ₹
                    {(
                      Number(mf.current_value) - Number(mf.invested_amount)
                    ).toLocaleString()}
                  </p>

                  <button
                    onClick={() => startEdit(mf)}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-xl mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMF(mf.mf_id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MF;
