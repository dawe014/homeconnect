import React, { useState, useEffect } from "react";
import type { User } from "../pages/ManageUsersPage";
interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: { id: string; role: User["role"] }) => void;
  user: User | null;
  isSaving: boolean;
}

export function EditUserModal({
  isOpen,
  onClose,
  onSave,
  user,
  isSaving,
}: EditUserModalProps) {
  const [role, setRole] = useState<User["role"]>("user");

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    onSave({ id: user._id, role });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User: {user.name}</h2>
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded disabled:bg-indigo-400"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface RegisterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (userData: any) => void;
  isRegistering: boolean;
  errorMessage?: string;
}

export function RegisterUserModal({
  isOpen,
  onClose,
  onRegister,
  isRegistering,
  errorMessage,
}: RegisterUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as User["role"],
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user" as User["role"],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register a New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="text-red-500 bg-red-100 p-3 rounded text-sm">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              title="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              title="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              title="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              title="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded disabled:bg-green-400"
              disabled={isRegistering}
            >
              {isRegistering ? "Registering..." : "Register User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
