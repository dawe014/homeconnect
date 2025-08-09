import { Link } from "react-router-dom";
import { BuildingOfficeIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

interface Agent {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  propertyCount: number;
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "";

  const getAvatarUrl = () => {
    if (agent.avatar) {
      if (agent.avatar.startsWith("http")) {
        return agent.avatar;
      }
      return `${SERVER_URL}${agent.avatar}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      agent.name
    )}&background=e0e7ff&color=4338ca&size=256`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="group relative flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="mb-4">
        <img
          className="h-28 w-28 rounded-full object-cover ring-4 ring-white group-hover:ring-indigo-100 transition-all"
          src={avatarUrl}
          alt={agent.name}
        />
      </div>

      <h3 className="text-xl font-bold text-gray-900 truncate max-w-full">
        {agent.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Member since {new Date(agent.createdAt).getFullYear()}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
        <BuildingOfficeIcon className="h-4 w-4" />
        <span>{agent.propertyCount} Active Listings</span>
      </div>

      <div className="flex-grow"></div>

      <div className="mt-6 flex w-full flex-col space-y-3">
        <Link
          to={`/agent/${agent._id}`}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          View Profile & Listings
        </Link>
        <a
          href={`mailto:${agent.email}`}
          className="inline-flex items-center justify-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <EnvelopeIcon className="h-4 w-4 text-gray-500" />
          <span>Contact Agent</span>
        </a>
      </div>
    </div>
  );
}
