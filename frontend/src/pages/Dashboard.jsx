import { useEffect, useState } from "react";
import api from "../api";
import { USER_ID } from "../config";

function Dashboard() {

  const [accounts, setAccounts] = useState([]);

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

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <div>

      <h1>Dashboard</h1>

      <h2>Total Accounts: {accounts.length}</h2>

      <h2>Total Balance: ₹{totalBalance}</h2>

    </div>
  );
}

export default Dashboard;