import { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "../services/api";
import type { Property } from "../types";
import PropertyCard from "../components/PropertyCard";
import Spinner from "../components/Spinner";
import SearchFilter from "../components/SearchFilter";
import type { FilterState } from "../components/SearchFilter";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const fetchProperties = async (filters: FilterState): Promise<Property[]> => {
  const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value && value !== "all" && value !== "createdAt_desc") {
      acc[key] = value;
    }
    if (key === "sort" && value !== "createdAt_desc") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const params = new URLSearchParams(validFilters).toString();
  const { data } = await api.get(`/properties?${params}`);
  return data;
};

interface ListingsPageProps {
  pageTitle: string;
  initialFilters: Partial<FilterState>;
}

export default function ListingsPage({
  pageTitle,
  initialFilters,
}: ListingsPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    propertyType: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    sort: "createdAt_desc",
    ...initialFilters,
  });

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery<Property[], Error>({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updatedFilters: FilterState = {
        searchTerm: newFilters.searchTerm ?? prev.searchTerm,
        propertyType: newFilters.propertyType ?? prev.propertyType,
        status: newFilters.status ?? prev.status,
        minPrice: newFilters.minPrice ?? prev.minPrice,
        maxPrice: newFilters.maxPrice ?? prev.maxPrice,
        bedrooms: newFilters.bedrooms ?? prev.bedrooms,
        sort: newFilters.sort ?? prev.sort,
      };
      return updatedFilters;
    });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header Section */}
      <div className="bg-gray-100 rounded-lg p-8 my-8 text-center border">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {pageTitle}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse our curated selection of top-tier properties.
        </p>
      </div>

      {/* Filter Bar Component */}
      <SearchFilter
        onFilterChange={handleFilterChange}
        initialFilters={initialFilters}
      />

      {/* Results Header with Count and Sorting */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="text-sm text-gray-700">
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <span className="font-bold">{properties.length}</span> properties
              found
            </>
          )}
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            onChange={handleSortChange}
            value={filters.sort}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Listings Grid Section */}
      <div>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="text-center py-10 px-4">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              An Error Occurred
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Could not load properties at this time. Please try again later.
            </p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: Property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No Properties Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your search and filters did not match any properties. Try
              adjusting your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
