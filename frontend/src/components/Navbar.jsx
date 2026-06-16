import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
              MP
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Money<span className="text-emerald-600">Petti</span>
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex gap-8 text-slate-600 font-medium">
            <Link to="/" className="hover:text-emerald-600 transition">
              Dashboard
            </Link>

            <Link to="/accounts" className="hover:text-emerald-600 transition">
              Accounts
            </Link>

            <Link
              to="/transactions"
              className="hover:text-emerald-600 transition"
            >
              Transactions
            </Link>

            <Link to="/deposit" className="hover:text-emerald-600 transition">
              Deposit
            </Link>

            <Link to="/withdraw" className="hover:text-emerald-600 transition">
              Withdraw
            </Link>

            <Link to="/transfer" className="hover:text-emerald-600 transition">
              Transfer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
