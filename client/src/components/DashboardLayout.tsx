import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeModernIcon,
  UserGroupIcon,
  ViewColumnsIcon,
  PlusCircleIcon,
  BellIcon,
  ChartBarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
  const userAvatar = user?.avatar?.startsWith("http")
    ? user.avatar
    : user?.avatar
    ? `${SERVER_URL}${user.avatar}`
    : `https://ui-avatars.com/api/?name=${user?.name}`;

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard/overview",
      icon: ChartBarIcon,
      adminOnly: false,
    },
    {
      name: "My Listings",
      href: "/dashboard/my-listings",
      icon: ViewColumnsIcon,
      adminOnly: false,
    },
    {
      name: "Add Listing",
      href: "/dashboard/add-listing",
      icon: PlusCircleIcon,
      adminOnly: false,
    },
    {
      name: "Manage Users",
      href: "/dashboard/manage-users",
      icon: UserGroupIcon,
      adminOnly: true,
    },
    {
      name: "Property Mgt.",
      href: "/dashboard/manage-properties",
      icon: HomeModernIcon,
      adminOnly: true,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: EnvelopeIcon,
      adminOnly: true,
    },
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
    }`;

  const SidebarContent = () => (
    <>
      <div className="flex h-16 flex-shrink-0 items-center px-4 bg-indigo-800">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <HomeModernIcon className="h-8 w-8 text-white" />
          <span className="text-white text-xl font-bold">HomeConnect</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map(
            (item) =>
              (!item.adminOnly || user?.role === "admin") && (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={getNavLinkClass}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300 group-hover:text-white" />
                  <span>{item.name}</span>
                </NavLink>
              )
          )}
        </nav>
      </div>

      <div className="flex flex-shrink-0 p-4 border-t border-indigo-700">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={userAvatar}
              alt="User avatar"
            />
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs font-medium text-indigo-200 hover:text-red-400 transition-colors group"
            >
              <FaArrowAltCircleRight className="h-4 w-4 text-indigo-300 group-hover:text-red-400 transition-colors" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                  <span className="sr-only">Close sidebar</span>
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-800 pb-4">
                <SidebarContent />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-indigo-800">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </button>
          <div
            className="h-6 w-px bg-gray-900/10 lg:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              >
                <BellIcon className="h-6 w-6" />
                <span className="sr-only">View notifications</span>
              </button>
              <Link
                to="/profile"
                className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <img
                  className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                  src={userAvatar}
                  alt="User profile"
                />
                <span className="sr-only">Your profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
