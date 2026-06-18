import { Link } from "react-router-dom";

function Sidebar({ expanded, setExpanded }) {
  return (
    <div
      className={`h-screen bg-slate-900 text-white fixed left-0 top-0 flex flex-col transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        {expanded ? (
          <h1 className="text-xl font-bold">
            Money<span className="text-emerald-400">Petti</span>
          </h1>
        ) : (
          <h1 className="text-xl font-bold">MP</h1>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:text-emerald-400"
        >
          ☰
        </button>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <Link to="/" className="hover:text-emerald-400">
          🏠 {expanded && "Dashboard"}
        </Link>

        {expanded && (
          <h2 className="text-xs uppercase text-slate-400 mt-4">Accounts</h2>
        )}

        <Link to="/accounts" className="hover:text-emerald-400">
          💳 {expanded && "Accounts"}
        </Link>

        <Link to="/transfer" className="hover:text-emerald-400">
          🔄 {expanded && "Transfer"}
        </Link>

        {expanded && (
          <h2 className="text-xs uppercase text-slate-400 mt-4">
            Transactions
          </h2>
        )}

        <Link to="/deposit" className="hover:text-emerald-400">
          ➕ {expanded && "Deposit"}
        </Link>

        <Link to="/withdraw" className="hover:text-emerald-400">
          ➖ {expanded && "Withdraw"}
        </Link>

        <Link to="/transactions" className="hover:text-emerald-400">
          📜 {expanded && "History"}
        </Link>

        {expanded && (
          <h2 className="text-xs uppercase text-slate-400 mt-4">Investments</h2>
        )}

        <Link to="/fds" className="hover:text-emerald-400">
          📈 {expanded && "Fixed Deposits"}
        </Link>

        <Link to="/rds" className="hover:text-emerald-400">
          💰 {expanded && "Recurring Deposits"}
        </Link>

        {expanded && (
          <h2 className="text-xs uppercase text-slate-400 mt-4">Wealth</h2>
        )}

        <Link to="/assets" className="hover:text-emerald-400">
          🏡 {expanded && "Assets"}
        </Link>

        <Link to="/reports" className="hover:text-emerald-400">
          📊 {expanded && "Reports"}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
