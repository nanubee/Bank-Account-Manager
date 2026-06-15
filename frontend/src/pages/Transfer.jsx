import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Transfer() {
  const [accounts, setAccounts] = useState([]);

  const [selectedFromAccountId, setSelectedFromAccountId] = useState("");
  const [selectedToAccountId, setSelectedToAccountId] = useState("");

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

  const transferMoney = async () => {
    if (!selectedFromAccountId || !selectedToAccountId || !amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/transfer", {
        from_account_id: Number(selectedFromAccountId),
        to_account_id: Number(selectedToAccountId),
        amount: Number(amount),
        description: description,
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
    <div>
      <h1>Transfer Money</h1>

      <select
        value={selectedFromAccountId}
        onChange={(e) => setSelectedFromAccountId(e.target.value)}
      >
        <option value="">Select Sender Account</option>

        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.bank_name} (...{account.account_number_last4})
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={selectedToAccountId}
        onChange={(e) => setSelectedToAccountId(e.target.value)}
      >
        <option value="">Select Receiver Account</option>

        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.bank_name} (...{account.account_number_last4})
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={transferMoney}>Transfer</button>
    </div>
  );
}

export default Transfer;
