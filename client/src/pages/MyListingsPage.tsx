import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import api from "../services/api";
import type { Property } from "../types";
import Spinner from "../components/Spinner";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { useState } from "react";
import { Switch } from "@headlessui/react";

const fetchMyListings = async (): Promise<Property[]> => {
  const { data } = await api.get("/properties/my-listings");
  return data;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MyListingsPage() {
  const queryClient = useQueryClient();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const {
    data: listings,
    isLoading,
    isError,
  } = useQuery<Property[], Error>({
    queryKey: ["myListings"],
    queryFn: fetchMyListings,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsConfirmModalOpen(false);
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/properties/${id}/toggle-availability`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
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
    return <div className="text-red-500 p-8">Error fetching listings.</div>;

  return (
    <>
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold leading-6 text-gray-900">
              My Property Listings
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all properties you have listed on the platform.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              to="/dashboard/add-listing"
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" /> New Listing
            </Link>
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
                        Status
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
                    ) : listings && listings.length > 0 ? (
                      listings.map((listing) => (
                        <tr
                          key={listing._id}
                          className={
                            !listing.isAvailable
                              ? "bg-gray-100"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {listing.title}
                            </div>
                            <div className="text-gray-500">
                              {listing.city}, {listing.state}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                listing.status === "For Sale"
                                  ? "bg-green-50 text-green-700 ring-green-600/20"
                                  : "bg-blue-50 text-blue-700 ring-blue-600/20"
                              }`}
                            >
                              {listing.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Switch
                              checked={listing.isAvailable}
                              onChange={() => handleToggle(listing._id)}
                              className={classNames(
                                listing.isAvailable
                                  ? "bg-indigo-600"
                                  : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                              )}
                            >
                              <span className="sr-only">
                                Mark as sold/rented
                              </span>
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  listing.isAvailable
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                            <span
                              className={`ml-3 text-xs font-medium ${
                                listing.isAvailable
                                  ? "text-green-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {listing.isAvailable
                                ? "Active"
                                : listing.status === "For Sale"
                                ? "Sold"
                                : "Rented"}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-x-4">
                              <Link
                                to={`/property/${listing._id}`}
                                className="text-gray-400 hover:text-green-600"
                                title="View Public Page"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/dashboard/edit-listing/${listing._id}`}
                                className="text-gray-400 hover:text-indigo-600"
                                title="Edit Listing"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() =>
                                  openDeleteConfirmation(listing._id)
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
                          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No Listings Found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You haven't added any properties yet.
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
