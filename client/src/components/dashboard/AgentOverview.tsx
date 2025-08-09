import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../Spinner";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  BanknotesIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const fetchAgentStats = async () => {
  const { data } = await api.get("/agent/stats");
  return data;
};

// Reusable Stat Card
const StatCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="bg-indigo-100 p-3 rounded-full">
      <Icon className="h-8 w-8 text-indigo-600" />
    </div>
  </div>
);

export default function AgentOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["agentDashboardStats"],
    queryFn: fetchAgentStats,
  });

  if (isLoading) return <Spinner />;
  if (!stats) return <div>Failed to load stats.</div>;

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900">
            Agent Overview
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Your personal performance at a glance.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/dashboard/add-listing"
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" /> New Listing
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={BuildingOffice2Icon}
        />
        <StatCard
          title="Sold / Rented"
          value={stats.archivedListings}
          icon={CheckCircleIcon}
        />
        <StatCard
          title="Value of Active Listings"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(stats.totalValue)}
          icon={BanknotesIcon}
        />
      </div>

      {/* Recent Listings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Recent Activity</h3>
        <ul className="divide-y divide-gray-200">
          {stats.recentListings.map((prop: any) => (
            <li
              key={prop._id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{prop.title}</p>
                <p
                  className={`text-sm ${
                    prop.isAvailable ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {prop.isAvailable ? "Active" : "Archived"}
                </p>
              </div>
              <Link
                to={`/dashboard/edit-listing/${prop._id}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
