import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";

// Utility to get initials
function getInitials(name) {
  if (!name) return "U";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

// Simple Modal Component
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // Edit Profile Form State
  const [editData, setEditData] = useState({
    name: authUser.name,
    email: authUser.email,
    image: authUser.image || "",
  });

  // Change Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Edit Profile Handlers
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: Connect to API/store
    setAuthUser({ ...authUser, ...editData });
    setEditOpen(false);
  };

  // Change Password Handlers
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // TODO: Connect to API/store
    alert("Password changed successfully! (Mock)");
    setPasswordOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center py-2 px-4 md:px-4 w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-3">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      <div className="w-full mx-auto flex flex-col lg:flex-row gap-1">
        {/* Profile Info Section */}
        <div className="min-h-screen flex items-start justify-center p-6">
          {/* Profile Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {authUser.image ? (
                      <img src={authUser?.image || "https://avatar.iran.liara.run/public/boy"} alt={authUser.name} className="w-24 h-24 rounded-full" />
                    ) : (
                      <span className="text-6xl text-center">{getInitials(authUser.name)}</span>
                    )}
                  </div>
                </div>
                {/* Name and Role Badge */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{authUser.name}</h2>
                  <div className="badge badge-primary mt-2">{authUser.role}</div>
                </div>
              </div>
              <div className="divider"></div>
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Email */}
                <div className="stat bg-base-200 rounded-box">
                  <div className="stat-figure text-primary">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Email</div>
                  <div className="stat-value text-lg break-all">{authUser.email}</div>
                </div>
                {/* User ID */}
                <div className="stat bg-base-200 rounded-box">
                  <div className="stat-figure text-primary">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="stat-title">User ID</div>
                  <div className="stat-value text-sm break-all">{authUser.id}</div>
                </div>
                {/* Role Status */}
                <div className="stat bg-base-200 rounded-box">
                  <div className="stat-figure text-primary">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Role</div>
                  <div className="stat-value text-lg">{authUser.role}</div>
                  <div className="stat-desc">
                    {authUser.role === "ADMIN" ? "Full system access" : "Limited access"}
                  </div>
                </div>
                {/* Profile Image Status */}
                <div className="stat bg-base-200 rounded-box">
                  <div className="stat-figure text-primary">
                    <Image className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Profile Image</div>
                  <div className="stat-value text-lg">
                    {authUser.image ? "Uploaded" : "Not Set"}
                  </div>
                  <div className="stat-desc">
                    {authUser.image ? "Image available" : "Upload a profile picture"}
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-outline btn-primary" onClick={() => setEditOpen(true)}>
                  Edit Profile
                </button>
                <button className="btn btn-primary" onClick={() => setPasswordOpen(true)}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <ProblemSolvedByUser />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
          <label>
            Name
            <input
              className="input input-bordered w-full"
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Email
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Profile Image URL
            <input
              className="input input-bordered w-full"
              type="text"
              name="image"
              value={editData.image}
              onChange={handleEditChange}
            />
          </label>
          <button type="submit" className="btn btn-primary mt-4">
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <label>
            Current Password
            <input
              className="input input-bordered w-full"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            New Password
            <input
              className="input input-bordered w-full"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            Confirm New Password
            <input
              className="input input-bordered w-full"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary mt-4">
            Change Password
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
