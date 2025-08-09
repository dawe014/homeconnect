import { Link } from "react-router-dom";
import type { Property } from "../types";
import { ArrowsPointingOutIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { FaBath, FaBed } from "react-icons/fa";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images[0]?.startsWith("http")
    ? property.images[0]
    : property.images[0]
    ? `${SERVER_URL}${property.images[0]}`
    : "https://via.placeholder.com/400x300.png?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
      <Link to={`/property/${property._id}`}>
        <div className="relative">
          <div className="h-56 w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg ${
              property.status === "For Sale" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {property.status}
          </div>
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 w-full">
            <p className="text-2xl font-extrabold text-white">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
            {property.propertyType}
          </p>

          {/* Title */}
          <h3
            className="mt-2 text-xl font-bold text-gray-900 truncate"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location */}
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            {property.city}, {property.state}
          </p>

          {/* Property Stats */}
          <div className="mt-5 flex items-center justify-start space-x-6 border-t pt-4 text-gray-700">
            <div className="flex items-center gap-1.5">
              <FaBed className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">
                {property.bedrooms} Beds
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaBath className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">
                {property.bathrooms} Baths
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowsPointingOutIcon className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">1,200 sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
