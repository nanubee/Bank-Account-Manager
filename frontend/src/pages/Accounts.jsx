import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Accounts() {

  const [accounts, setAccounts] = useState([]);
  const [bankName, setBankName] = useState("");
  const [country, setCountry] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");

  const loadAccounts = async () => {
    try {
      const response = await api.get(`/accounts/${USER_ID}`);
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
        user_id: USER_ID,
        bank_name: bankName,
        country,
        account_type: accountType,
        account_number_last4: accountNumber,
        balance: Number(balance),
        currency
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

  return (
    <div>

      <h1>My Accounts</h1>

      <input
      type="text"
      placeholder="Bank Name"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
    />
      <p>{bankName}</p>
      <br />
      <input
      type="text"
      placeholder="Country"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    />
      <br />
      <input
        type="text"
        placeholder="Account Type"
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
      />
      <br />
      <input
      type="text"
      maxLength="4"
      placeholder="Last 4 Digits"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
    />
      {accountNumber.length > 0 && accountNumber.length !== 4 && (
        <p>Account number must contain exactly 4 digits</p>
      )}
      <br />
      <input
        type="number"
        placeholder="Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <br />
      <button onClick={createAccount}>
        Create Account
      </button>
      <br />
      {accounts.map((account) => (

        <div key={account.account_id}>

          <h2>{account.bank_name}</h2>

          <p>ID: {account.account_id}</p>

          <p>Type: {account.account_type}</p>

          <p>Card Number: {account.account_number_last4}</p>

          <p>Balance: {account.balance}</p>

          <p>Currency: {account.currency}</p>

          <p>Country: {account.country}</p>

        </div>

      ))}

    </div>
  );
}

export default Accounts;