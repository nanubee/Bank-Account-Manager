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
    <div>
      <h1>Transactions</h1>

      <select value={selectedAccountId} onChange={handleAccountChange}>
        <option value="">Select Account</option>

        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.bank_name} (...{account.account_number_last4})
          </option>
        ))}
      </select>

      <br />
      <br />

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction.transaction_id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Type:</strong> {transaction.transaction_type}
            </p>

            <p>
              <strong>Amount:</strong> ₹{transaction.amount}
            </p>

            <p>
              <strong>Description:</strong> {transaction.description}
            </p>

            <p>
              <strong>Date:</strong> {transaction.created_at}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Transactions;
