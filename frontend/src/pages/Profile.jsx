import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const fullName = localStorage.getItem("full_name");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");

    if (!confirmed) return;

    try {
      await api.delete("/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.clear();

      alert("Account deleted successfully");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete account");
    }
  };

  const handleEmailChange = async () => {
    try {
      await api.put(
        "/auth/change-email",
        {
          new_email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      localStorage.setItem("email", newEmail);

      alert("Email updated successfully");

      setNewEmail("");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to update email");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.put(
        "/auth/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to update password");
    }
  };

  return (
    <div className="p-8">
      <div className="flex gap-6 flex-wrap items-start">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-80">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {fullName
                ?.split(" ")
                .map((name) => name[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h2 className="mt-3 text-xl font-semibold">{fullName}</h2>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2">
              <strong>Email:</strong> {email}
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="ml-11 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-6"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-[500px]">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

          {/* Change Email */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Change Email</h3>

            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <button
              onClick={handleEmailChange}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Update Email
            </button>
          </div>

          <hr className="my-6" />

          {/* Change Password */}
          <div>
            <h3 className="font-semibold mb-3">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <button
              onClick={handlePasswordChange}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
