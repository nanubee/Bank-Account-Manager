import { useEffect, useState } from "react";
import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

function Assets() {
  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editAssetType, setEditAssetType] = useState("");
  const [editAssetName, setEditAssetName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCurrentValue, setEditCurrentValue] = useState("");

  const loadData = async () => {
    try {
      const accountsResponse = await api.get(`/accounts`);
      setAccounts(accountsResponse.data);

      const assetsResponse = await api.get(`/assets`);
      setAssets(assetsResponse.data);
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createAsset = async () => {
    try {
      await api.post("/assets/", {
        account_id: Number(selectedAccountId),
        asset_type: assetType,
        asset_name: assetName,
        description: description,
        current_value: Number(currentValue),
        purchase_date: purchaseDate,
      });

      alert("Asset added successfully");

      setSelectedAccountId("");
      setAssetType("");
      setAssetName("");
      setDescription("");
      setCurrentValue("");
      setPurchaseDate("");

      loadData();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const startEdit = (asset) => {
    setEditingId(asset.asset_id);

    setEditAssetType(asset.asset_type);
    setEditAssetName(asset.asset_name);
    setEditDescription(asset.description);
    setEditCurrentValue(asset.current_value);
  };

  const updateAsset = async () => {
    try {
      await api.put(`/assets/${editingId}`, {
        asset_type: editAssetType,
        asset_name: editAssetName,
        description: editDescription,
        current_value: Number(editCurrentValue),
      });

      alert("Asset updated");

      setEditingId(null);

      loadData();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const deleteAsset = async (id) => {
    try {
      await api.delete(`/assets/${id}`);

      alert("Asset deleted");

      loadData();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Assets</h1>

      <p className="text-slate-500 mb-8">
        Track physical assets and net worth.
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Asset</h2>

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

          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option value="">Select Asset Type</option>
            <option value="Property">Property</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Gold">Gold</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Asset Name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
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

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>

        <button
          onClick={createAsset}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Add Asset
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Assets</h2>

      <div className="grid gap-4">
        {assets.map((asset) => {
          const linkedAccount = accounts.find(
            (account) => account.account_id === asset.account_id,
          );

          return (
            <div
              key={asset.asset_id}
              className="bg-white rounded-2xl p-6 shadow-sm border"
            >
              {editingId === asset.asset_id ? (
                <>
                  <select
                    value={editAssetType}
                    onChange={(e) => setEditAssetType(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  >
                    <option value="Property">Property</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Gold">Gold</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    value={editAssetName}
                    onChange={(e) => setEditAssetName(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <input
                    type="number"
                    value={editCurrentValue}
                    onChange={(e) => setEditCurrentValue(e.target.value)}
                    className="border rounded-xl p-2 w-full mb-2"
                  />

                  <button
                    onClick={updateAsset}
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
                  <h3 className="font-bold text-lg">{asset.asset_name}</h3>

                  <p>
                    Linked Account: {linkedAccount?.bank_name}(
                    {linkedAccount?.account_number_last4})
                  </p>

                  <p>Type: {asset.asset_type}</p>

                  <p>Value: ₹{Number(asset.current_value).toLocaleString()}</p>

                  <p>Description: {asset.description}</p>

                  <button
                    onClick={() => startEdit(asset)}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-xl mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAsset(asset.asset_id)}
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

export default Assets;
