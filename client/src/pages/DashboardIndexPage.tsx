// client/src/pages/DashboardIndexPage.tsx
import { useAuth } from "../context/AuthContext";
import AdminOverview from "../components/dashboard/AdminOverview"; // Updated path
import AgentOverview from "../components/dashboard/AgentOverview"; // New import
import Spinner from "../components/Spinner";

export default function DashboardIndexPage() {
  const { user } = useAuth();

  if (!user) {
    return <Spinner />;
  }

  if (user.role === "admin") {
    return <AdminOverview />;
  }

  return <AgentOverview />;
}
