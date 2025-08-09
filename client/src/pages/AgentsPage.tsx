import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import AgentCard from "../components/AgentCard";
import Spinner from "../components/Spinner";
import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/outline";

interface Agent {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  propertyCount: number;
}

const fetchAgents = async (searchTerm: string): Promise<Agent[]> => {
  const { data } = await api.get(`/users/agents?searchTerm=${searchTerm}`);
  return data;
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data: agents,
    isLoading,
    isError,
  } = useQuery<Agent[], Error>({
    queryKey: ["agents", debouncedSearchTerm],
    queryFn: () => fetchAgents(debouncedSearchTerm),
    keepPreviousData: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="py-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Meet Our Professional Agents
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          The best in the business, ready to help you find your dream home.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12 max-w-lg mx-auto">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border-gray-300 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by agent name..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      <div>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load agents.</div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard key={agent._id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Agents Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your search for "{debouncedSearchTerm}" did not match any agents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
