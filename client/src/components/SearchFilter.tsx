import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export interface FilterState {
  searchTerm: string;
  propertyType: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  sort: string;
  [key: string]: string;
}

interface SearchFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  isHeroVersion?: boolean;
  initialFilters?: Partial<FilterState>;
}

export default function SearchFilter({
  onFilterChange = () => {},
  isHeroVersion = false,
  initialFilters = {},
}: SearchFilterProps) {
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  if (isHeroVersion) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 text-gray-800 rounded-lg shadow-2xl max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-grow w-full md:w-auto">
            <input
              type="text"
              name="searchTerm"
              placeholder="Enter a city, address, or keyword..."
              value={filters.searchTerm}
              onChange={handleChange}
              className="w-full px-4 py-3 border-0 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <select
              title="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="px-4 py-3 border-0 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">For Sale/Rent</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 ">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {/* Search Term */}
        <div className="lg:col-span-2">
          <label
            htmlFor="searchTerm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Keyword
          </label>
          <input
            id="searchTerm"
            type="text"
            name="searchTerm"
            placeholder="City, Address..."
            value={filters.searchTerm}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Property Type */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Min. Beds
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </form>
    </div>
  );
}
