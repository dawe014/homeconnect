import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
      if (user.avatar) {
        setAvatarPreview(
          user.avatar.startsWith("http")
            ? user.avatar
            : `${SERVER_URL}${user.avatar}`
        );
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (response) => {
      const { data } = response;
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
      };
      login(updatedUser, localStorage.getItem("token") || "");
      setSuccessMessage("Profile updated successfully!");
      setAvatarFile(null);
      setTimeout(clearMessages, 3000);
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile."
      );
      setTimeout(clearMessages, 3000);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: typeof passwordData) =>
      api.put("/users/profile/password", data),
    onSuccess: () => {
      setSuccessMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setTimeout(clearMessages, 3000);
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to change password."
      );
      setTimeout(clearMessages, 3000);
    },
  });

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    changePasswordMutation.mutate(passwordData);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          My Profile
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Manage your personal information and security settings.
        </p>
      </div>

      {/* Message Alerts */}
      <div className="h-12">
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative flex items-center gap-3"
            role="alert"
          >
            <CheckCircleIcon className="h-6 w-6" />
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center gap-3"
            role="alert"
          >
            <ExclamationCircleIcon className="h-6 w-6" />
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* --- Profile Information Card --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Profile Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-200"
                  />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-gray-300" />
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 text-white shadow-md"
                >
                  <CameraIcon className="h-5 w-5" />
                  <input
                    title="avatar"
                    id="avatar-upload"
                    name="avatar"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Change Password Card --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
