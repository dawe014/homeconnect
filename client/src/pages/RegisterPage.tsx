import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { registerSchema } from "../lib/validators";
import type { TRegisterSchema } from "../lib/validators";

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  avatar: string;
  token: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation<AuthResponse, Error, TRegisterSchema>({
    mutationFn: (newUser) =>
      api.post("/auth/register", newUser).then((res) => res.data),
    onSuccess: (data) => {
      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
        },
        data.token
      );
      navigate("/");
    },
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex min-h-full flex-1">
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero-background.jpg"
            alt="Modern home interior"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-indigo-700/70">
            <div className="absolute inset-0 bg-noise opacity-10" />
          </div>
          <div className="absolute inset-0 flex flex-col items-start justify-center p-12">
            <div className="transition-opacity duration-300 ease-in-out">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90">
                <img
                  src="/2.png"
                  alt="logo"
                  className="h-12 w-12 rounded-full"
                />
                <span className="text-4xl font-bold text-white tracking-tight">
                  HomeConnect
                </span>
              </Link>
              <p className="mt-6 text-xl text-white/90 max-w-md leading-relaxed">
                Join the community and start your journey to finding the perfect
                property today.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:px-24 xl:px-32">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 lg:hidden mb-6">
                <img
                  src="/2.png"
                  alt="logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-2xl font-bold text-indigo-600">
                  HomeConnect
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Create your account
              </h2>
              <p className="text-lg text-gray-600">Join our community today</p>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-700"
                  >
                    Full Name
                  </label>
                  <div>
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      autoComplete="name"
                      className="block w-full rounded-xl border-0 bg-white/70 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-700"
                  >
                    Email address
                  </label>
                  <div>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-xl border-0 bg-white/70 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-700"
                  >
                    Password
                  </label>
                  <div>
                    <input
                      {...register("password")}
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      className="block w-full rounded-xl border-0 bg-white/70 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div>
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="block w-full rounded-xl border-0 bg-white/70 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium leading-6 text-gray-700"
                  >
                    I am a...
                  </label>
                  <div>
                    <select
                      {...register("role")}
                      id="role"
                      className="block w-full rounded-xl border-0 bg-white/70 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                    >
                      <option value="user">User (Looking for property)</option>
                      <option value="agent">Agent (Listing property)</option>
                    </select>
                  </div>
                </div>

                {mutation.isError && (
                  <div className="rounded-xl bg-red-50 p-4 border border-red-100 transition-opacity duration-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {(mutation.error as any).response?.data?.message ||
                            "Registration failed"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400 transition-all duration-200 hover:shadow-md"
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8">
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
