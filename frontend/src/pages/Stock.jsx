import { useEffect, useState } from "react";
import api from "../api";
//import { USER_ID } from "../config";

function Stock() {
  //const USER_ID = localStorage.getItem("user_id");
  const [accounts, setAccounts] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [stockName, setStockName] = useState("");
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

      const stockResponse = await api.get(`/stocks/user`);
      setStocks(stockResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createStock = async () => {
    try {
      await api.post("/stocks/", {
        account_id: Number(selectedAccountId),
        stock_name: stockName,
        invested_amount: Number(investedAmount),
        current_value: Number(currentValue),
        purchase_date: purchaseDate,
      });

      alert("Stock added successfully");

      setSelectedAccountId("");
      setStockName("");
      setInvestedAmount("");
      setCurrentValue("");
      setPurchaseDate("");

      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed");
    }
  };

  const deleteStock = async (id) => {
    try {
      await api.delete(`/stocks/${id}`);

      alert("Stock deleted");

      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (stock) => {
    setEditingId(stock.stock_id);

    setEditFundName(stock.stock_name);
    setEditInvestedAmount(stock.invested_amount);
    setEditCurrentValue(stock.current_value);
  };

  const updateStock = async () => {
    try {
      await api.put(`/stocks/${editingId}`, {
        stock_name: editFundName,
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
      <h1 className="text-3xl font-bold mb-2">Stocks</h1>

      <p className="text-slate-500 mb-8">Track your stock investments.</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Stock</h2>

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
            placeholder="Stock Name"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
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
          onClick={createStock}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Add Stock
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Stocks</h2>

      <div className="grid gap-4">
        {stocks.map((stock) => {
          const linkedAccount = accounts.find(
            (account) => account.account_id === stock.account_id,
          );

          return (
            <div
              key={stock.stock_id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              {editingId === stock.stock_id ? (
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
                    onClick={updateStock}
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
                  <h3 className="font-bold text-lg">{stock.stock_name}</h3>

                  <p>
                    Linked Account: {linkedAccount?.bank_name}(
                    {linkedAccount?.account_number_last4})
                  </p>

                  <p>
                    Invested: ₹{Number(stock.invested_amount).toLocaleString()}
                  </p>

                  <p>
                    Current: ₹{Number(stock.current_value).toLocaleString()}
                  </p>

                  <button
                    onClick={() => startEdit(stock)}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-xl mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStock(stock.stock_id)}
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

export default Stock;
