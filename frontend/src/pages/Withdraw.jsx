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
    try {
      await api.post("/withdraw", {
        account_id: Number(selectedAccountId),
        amount: Number(amount),
        description: description,
      });

      alert("Withdraw successful");

      setSelectedAccountId("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Withdraw Money</h1>

      <select
        value={selectedAccountId}
        onChange={(e) => setSelectedAccountId(e.target.value)}
      >
        <option value="">Select Account</option>

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

      <button onClick={withdrawMoney}>Withdraw</button>
    </div>
  );
}

export default Withdraw;
