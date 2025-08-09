import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { Switch } from "@headlessui/react";
import api from "../services/api";
import type { Property } from "../types";
import Spinner from "../components/Spinner";
import ConfirmationModal from "../components/modals/ConfirmationModal";

const fetchAllProperties = async (filters: {
  status: string;
  availability: string;
  searchTerm: string;
}): Promise<Property[]> => {
  const params = new URLSearchParams(filters);
  const { data } = await api.get(`/properties/all?${params.toString()}`);
  return data;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ManagePropertiesPage() {
  const queryClient = useQueryClient();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // State for filtering and searching
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery<Property[], Error>({
    queryKey: [
      "allPropertiesAdmin",
      statusFilter,
      availabilityFilter,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      fetchAllProperties({
        status: statusFilter,
        availability: availabilityFilter,
        searchTerm: debouncedSearchTerm,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPropertiesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsConfirmModalOpen(false);
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/properties/${id}/toggle-availability`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPropertiesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const openDeleteConfirmation = (id: string) => {
    setPropertyToDelete(id);
    setIsConfirmModalOpen(true);
  };
  const handleDelete = () => {
    if (propertyToDelete) {
      deleteMutation.mutate(propertyToDelete);
    }
  };
  const handleToggle = (id: string) => {
    toggleAvailabilityMutation.mutate(id);
  };

  if (isError)
    return <div className="text-red-500 p-8">Error fetching properties.</div>;

  return (
    <>
      <div>
        <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-6 text-gray-900">
              Property Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View, manage, and edit all property listings on the platform.
            </p>
          </div>
        </div>

        {/* --- Search and Filter Controls --- */}
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-4">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                placeholder="Search by title, address, city..."
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <select
              title="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full h-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            >
              <option value="all">Any Status</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <select
              title="availability"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="block w-full h-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            >
              <option value="all">Any Availability</option>
              <option value="true">Active</option>
              <option value="false">Sold/Rented</option>
            </select>
          </div>
        </div>

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
                        Property
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Agent
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Availability
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
                        <td colSpan={4} className="py-24">
                          <Spinner />
                        </td>
                      </tr>
                    ) : properties && properties.length > 0 ? (
                      properties.map((property) => (
                        <tr
                          key={property._id}
                          className={
                            !property.isAvailable
                              ? "bg-gray-100"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-gray-500">
                              {property.city}, {property.state}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {property.agent.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Switch
                              checked={property.isAvailable}
                              onChange={() => handleToggle(property._id)}
                              className={classNames(
                                property.isAvailable
                                  ? "bg-indigo-600"
                                  : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  property.isAvailable
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-x-4">
                              <Link
                                to={`/property/${property._id}`}
                                className="text-gray-400 hover:text-green-600"
                                title="View Public Page"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/dashboard/edit-listing/${property._id}`}
                                className="text-gray-400 hover:text-indigo-600"
                                title="Edit Listing"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() =>
                                  openDeleteConfirmation(property._id)
                                }
                                className="text-gray-400 hover:text-red-600"
                                title="Delete Listing"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No Properties Found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            No properties match your current filters. Try
                            adjusting your search.
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        message="Are you sure you want to permanently delete this property listing? This action cannot be undone."
        isConfirming={deleteMutation.isPending}
      />
    </>
  );
}
