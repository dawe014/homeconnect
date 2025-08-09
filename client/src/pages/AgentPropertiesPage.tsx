import { useLocation } from "react-router-dom";
import ListingsPage from "./ListingsPage";

export default function AgentPropertiesPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const agentId = searchParams.get("agentId");
  const agentName = searchParams.get("agentName") || "Agent";

  if (!agentId) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="text-gray-600">
          No agent was specified to view listings for.
        </p>
      </div>
    );
  }

  return (
    <ListingsPage
      pageTitle={`Listings by ${agentName}`}
      initialFilters={{ agentId: agentId }}
    />
  );
}
