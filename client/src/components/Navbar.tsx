import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserCircleIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { text: "For Sale", href: "/for-sale" },
    { text: "For Rent", href: "/for-rent" },
    { text: "Agents", href: "/agents" },
    { text: "About Us", href: "/about" },
    { text: "Contact", href: "/contact" },
  ];

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate("/");
  };

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const getDesktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-500"
      : "text-gray-600 hover:text-indigo-600 font-medium";

  const profileMenuItems = (
    <>
      <NavLink
        to="/profile"
        className={`${getMobileNavLinkClass} group flex items-center px-4 py-2 text-sm rounded-md`}
        onClick={closeAllMenus}
      >
        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        My Profile
      </NavLink>

      {(user?.role === "agent" || user?.role === "admin") && (
        <NavLink
          to="/dashboard"
          className={`${getMobileNavLinkClass} group flex items-center px-4 py-2 text-sm rounded-md`}
          onClick={closeAllMenus}
        >
          <BuildingOffice2Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Dashboard
        </NavLink>
      )}

      <button
        onClick={handleLogout}
        className="w-full text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-4 py-2 text-sm rounded-md"
      >
        <FaRegArrowAltCircleRight className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        Logout
      </button>
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={closeAllMenus}
              className="flex-shrink-0 flex items-center space-x-2"
            >
              <img src="/2.png" alt="logo" className="h-16 w-16 rounded-full" />
              <span className="text-2xl font-bold text-gray-800 hidden sm:block">
                HomeConnect
              </span>
            </Link>

            {/* == Desktop Primary Navigation == */}
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.text}
                  to={link.href}
                  className={getDesktopNavLinkClass}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>

          {/* == Desktop Actions Section == */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              // -- Logged-in state (Desktop) --
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                >
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        user.avatar
                          ? user.avatar
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}&background=e0e7ff&color=4338ca&size=256`
                      }
                      alt={user.name}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                  )}

                  <span className="font-medium text-gray-700">
                    {user?.name}
                  </span>
                </button>
                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    {profileMenuItems}
                  </div>
                )}
              </div>
            ) : (
              // -- Guest state (Desktop) --
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* == Mobile Menu Button == */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8 text-gray-700" />
              ) : (
                <Bars3Icon className="h-8 w-8 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* == Mobile Menu Panel == */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Primary Mobile Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.text}
                to={link.href}
                className={`${getMobileNavLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={closeAllMenus}
              >
                {link.text}
              </NavLink>
            ))}

            {/* Separator and Auth Links */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {isAuthenticated ? (
                // -- Logged-in state (Mobile) --
                <div className="px-2 py-3">
                  <div className="flex items-center space-x-3 mb-3">
                    {user?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          user.avatar
                            ? user.avatar
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name
                              )}&background=e0e7ff&color=4338ca&size=256`
                        }
                        alt={user.name}
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-gray-500" />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 mt-3">{profileMenuItems}</div>
                </div>
              ) : (
                // -- Guest state (Mobile) --
                <div className="flex flex-col space-y-2">
                  <NavLink
                    to="/login"
                    onClick={closeAllMenus}
                    className={`${getMobileNavLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeAllMenus}
                    className={`${getMobileNavLinkClass} block px-3 py-2 rounded-md text-base font-medium`}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
