// client/src/pages/HomePage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Property } from "../types";
import PropertyCard from "../components/PropertyCard";
import Spinner from "../components/Spinner";
import SearchFilter from "../components/SearchFilter";
import type { FilterState } from "../components/SearchFilter";
import {
  KeyIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const fetchFeaturedProperties = async (): Promise<Property[]> => {
  const { data } = await api.get("/properties?limit=6&sort=createdAt_desc");
  return data;
};

const testimonials = [
  {
    quote:
      "HomeConnect made finding our dream home a breeze. The advanced search filters and professional agents were a game-changer for us!",
    name: "Sarah & Tom Williams",
    role: "Happy Homeowners",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "As a first-time renter, I was overwhelmed. The platform was so easy to use, and I found the perfect apartment in just a weekend.",
    name: "Michael Chen",
    role: "First-Time Renter",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The agent I connected with was top-notch. They understood exactly what I was looking for and guided me every step of the way.",
    name: "Jessica Miller",
    role: "Moved to a New City",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery<Property[], Error>({
    queryKey: ["featuredProperties"],
    queryFn: fetchFeaturedProperties,
  });

  const handleFilterChange = (filters: FilterState) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value);
      }
    });
    navigate(`/for-sale?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50">
      <div className="relative h-screen min-h-[700px] flex flex-col items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 bg-cover bg-center herobg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Find Your Next Perfect Place
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-200">
            Discover a place you'll love to live with our curated property
            listings.
          </p>
          <div className="mt-10">
            <SearchFilter
              onFilterChange={handleFilterChange}
              isHeroVersion={true}
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Our Listings
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Properties
            </p>
          </div>
          <div className="mt-16">
            {isLoading ? (
              <Spinner />
            ) : isError ? (
              <p className="text-center text-red-500">
                Could not load properties.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties?.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
            <div className="mt-16 text-center">
              <Link
                to="/for-sale"
                className="text-indigo-600 font-semibold hover:text-indigo-500"
              >
                View All Properties &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              A Simple Process
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Journey Home in 3 Steps
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-white">
                <MagnifyingGlassIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                1. Search & Discover
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Use our powerful search to find homes that match your criteria,
                from city apartments to suburban houses.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-white">
                <MapPinIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                2. Connect & Tour
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Connect with our trusted agents to schedule viewings, either
                in-person or virtually.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-white">
                <KeyIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                3. Secure Your Home
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Our agents will guide you through the paperwork and negotiation
                process to get you the keys to your new home.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Clients Say
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex flex-col justify-between rounded-lg bg-gray-50 p-8 shadow-sm"
                >
                  <div className="flex gap-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 flex-none" />
                    ))}
                  </div>
                  <blockquote className="mt-6 text-lg leading-8 tracking-tight text-gray-900">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <footer className="mt-8">
                    <div className="flex items-center gap-x-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full bg-gray-50"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to take the next step?
            <br />
            Start your journey with us today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Link
              to="/agents"
              className="rounded-md bg-white px-5 py-3 text-base font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus:visible:outline focus:visible:outline-2 focus:visible:outline-offset-2 focus:visible:outline-white"
            >
              Find an Agent
            </Link>
            <Link
              to="/dashboard/add-listing"
              className="text-base font-semibold leading-6 text-white hover:text-indigo-100"
            >
              List Your Property &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
