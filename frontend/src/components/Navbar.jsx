import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      {" | "}
      <Link to="/accounts">Accounts</Link>
      {" | "}
      <Link to="/deposit">Deposit</Link>
      {" | "}
      <Link to="/withdraw">Withdraw</Link>
      {" | "}
      <Link to="/transfer">Transfer</Link>
      {" | "}
      <Link to="/transactions">Transactions</Link>
    </nav>
  );
}

export default Navbar;
