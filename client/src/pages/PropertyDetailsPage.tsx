import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

import api from "../services/api";
import type { Property } from "../types";
import Spinner from "../components/Spinner";
import LocationMap from "../components/LocationMap";
import HeroImageGrid from "../components/HeroImageGrid";

const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery<Property, Error>({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id!),
    enabled: !!id,
  });

  const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
  const agentAvatarUrl = property?.agent?.avatar?.startsWith("http")
    ? property.agent.avatar
    : property?.agent?.avatar
    ? `${SERVER_URL}${property.agent.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        property?.agent.name || "A"
      )}&background=e0e7ff&color=4338ca`;

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-20">
        Error: {error.message}
      </div>
    );
  if (!property)
    return (
      <div className="text-center text-gray-500 py-20">Property not found.</div>
    );

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroImageGrid images={property.images} title={property.title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    {property.title}
                  </h1>
                  <p className="mt-2 flex items-center text-lg text-gray-500">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                    property.status === "For Sale"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 my-8">
              <h2 className="text-lg font-semibold text-gray-900 sr-only">
                Key Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-bold text-xl text-indigo-600">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(property.price)}
                  </div>
                </div>
                <div className="border-l">
                  <div className="text-sm text-gray-500">Beds</div>
                  <div className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                    <FaBed /> {property.bedrooms}
                  </div>
                </div>
                <div className="border-l">
                  <div className="text-sm text-gray-500">Baths</div>
                  <div className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                    <FaBath /> {property.bathrooms}
                  </div>
                </div>
                <div className="border-l">
                  <div className="text-sm text-gray-500">Sq. Ft.</div>
                  <div className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                    <FaRulerCombined className="h-5 w-5" />{" "}
                    {property.sqft?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              <p>{property.description}</p>
            </div>

            {/* Map */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Location on Map
              </h2>
              <LocationMap
                address={`${property.address}, ${property.city}`}
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </div>
          </div>

          {/* --- Right Column (Sticky Sidebar) --- */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Agent Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={agentAvatarUrl}
                    alt={property.agent.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Listed By</p>
                    <p className="font-bold text-gray-800 text-lg">
                      {property.agent.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <a
                    href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`}
                    className="w-full text-center rounded-md bg-indigo-600 px-3.5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Contact Agent
                  </a>
                  <Link
                    to={`/agent-listings?agentId=${
                      property.agent._id
                    }&agentName=${encodeURIComponent(property.agent.name)}`}
                    className="w-full text-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    View Agent's Listings
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
