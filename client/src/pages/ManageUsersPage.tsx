import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import api from "../services/api";
import Spinner from "../components/Spinner";
import EditUserModal from "../components/modals/EditUserModal";
import RegisterUserModal from "../components/modals/RegisterUserModal";
import type { TRegisterSchema } from "../components/modals/RegisterUserModal";
import ConfirmationModal from "../components/modals/ConfirmationModal";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "agent" | "admin";
}

// Updated fetch function to accept filter parameters
const fetchUsers = async (filters: {
  role: string;
  searchTerm: string;
}): Promise<User[]> => {
  const params = new URLSearchParams(filters);
  const { data } = await api.get(`/users?${params.toString()}`);
  return data;
};

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // State for filtering and searching
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debouncing effect for the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: users, isLoading } = useQuery<User[], Error>({
    queryKey: ["users", roleFilter, debouncedSearchTerm],
    queryFn: () =>
      fetchUsers({ role: roleFilter, searchTerm: debouncedSearchTerm }),
  });

  const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

  const handleMutationError = (error: any) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred.";
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(""), 5000);
  };
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: { id: string; role: User["role"] }) =>
      api.put(`/users/${updatedUser.id}`, { role: updatedUser.role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditModalOpen(false);
    },
    onError: handleMutationError,
  });
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsConfirmModalOpen(false);
    },
    onError: handleMutationError,
  });
  const registerUserMutation = useMutation({
    mutationFn: (userData: TRegisterSchema) =>
      api.post("/auth/register", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsRegisterModalOpen(false);
    },
  });
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const openDeleteConfirmation = (id: string) => {
    setUserToDelete(id);
    setIsConfirmModalOpen(true);
  };
  const handleSaveChanges = (updatedUser: {
    id: string;
    role: User["role"];
  }) => {
    updateUserMutation.mutate(updatedUser);
  };
  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
    }
  };
  const handleRegisterUser = (userData: TRegisterSchema) => {
    registerUserMutation.mutate(userData);
  };

  return (
    <>
      <div>
        <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-6 text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users on the platform. Search, filter, and manage
              accounts.
            </p>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" /> Add User
            </button>
          </div>
        </div>

        {/* --- Search and Filter Controls --- */}
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <select
              id="role"
              name="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full h-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              title="User Role"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-lg  sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="py-24">
                          <Spinner />
                        </td>
                      </tr>
                    ) : users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    user.avatar
                                      ? user.avatar.startsWith("http")
                                        ? user.avatar
                                        : `${SERVER_URL}${user.avatar}`
                                      : `https://ui-avatars.com/api/?name=${user.name}`
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-red-50 text-red-700 ring-red-600/20"
                                  : user.role === "agent"
                                  ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                                  : "bg-gray-50 text-gray-600 ring-gray-500/10"
                              } ring-1 ring-inset capitalize`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-x-4">
                              <button
                                onClick={() => openEditModal(user)}
                                className="text-gray-400 hover:text-indigo-600"
                                title="Edit user"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(user._id)}
                                className="text-gray-400 hover:text-red-600"
                                title="Delete user"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No Users Found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            No users match your current filters. Try adjusting
                            your search.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveChanges}
        user={selectedUser}
        isSaving={updateUserMutation.isPending}
      />
      <RegisterUserModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterUser}
        isRegistering={registerUserMutation.isPending}
        errorMessage={
          registerUserMutation.isError
            ? (registerUserMutation.error as any).response?.data?.message
            : undefined
        }
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Confirm User Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
        isConfirming={deleteUserMutation.isPending}
      />
    </>
  );
}
