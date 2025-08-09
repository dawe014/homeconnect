import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import Spinner from "../components/Spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  UserGroupIcon,
  HomeModernIcon,
  BanknotesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const fetchDashboardStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

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

export default function AdminDashboardHomePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) return <Spinner />;
  if (!stats) return <div>Failed to load stats.</div>;

  const propertyTypeChartData = {
    labels: stats.propertyTypeCounts.map((item: any) => item._id),
    datasets: [
      {
        label: "Properties",
        data: stats.propertyTypeCounts.map((item: any) => item.count),
        backgroundColor: ["#4f46e5", "#818cf8", "#a5b4fc", "#c7d2fe"],
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const listingsLast7DaysData = () => {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    });

    const dailyCounts = new Map<string, number>();
    stats.propertiesLast7Days.forEach((p: any) => {
      const dateString = new Date(p.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      dailyCounts.set(dateString, (dailyCounts.get(dateString) || 0) + 1);
    });

    const data = labels.map((label) => dailyCounts.get(label) || 0);

    return {
      labels,
      datasets: [
        {
          label: "Listings Added",
          data,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "";

  return (
    <div className="space-y-8">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={HomeModernIcon}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UserGroupIcon}
        />
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={UserPlusIcon}
        />
        <StatCard
          title="Total Property Value"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(stats.totalPropertyValue)}
          icon={BanknotesIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            New Listings (Last 7 Days)
          </h3>
          <div className="h-[300px]">
            <Line
              data={listingsLast7DaysData()}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Properties by Type</h3>
          <div className="h-[300px]">
            <Pie
              data={propertyTypeChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Listings</h3>
          <ul className="divide-y divide-gray-200">
            {stats.recentListings.map((prop: any) => (
              <li
                key={prop._id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{prop.title}</p>
                  <p className="text-sm text-gray-500">by {prop.agent.name}</p>
                </div>
                <Link
                  to={`/property/${prop._id}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">New Users</h3>
          <ul className="divide-y divide-gray-200">
            {stats.recentUsers.map((user: any) => (
              <li key={user._id} className="py-3 flex items-center">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    user.avatar
                      ? `${SERVER_URL}${user.avatar}`
                      : `https://ui-avatars.com/api/?name=${user.name?.replace(
                          " ",
                          "+"
                        )}`
                  }
                  alt={user.name}
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
