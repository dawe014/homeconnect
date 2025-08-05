import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// The response data is the same for login and register, so we can reuse this.
interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  token: string;
}

// Define the type for the data sent to the mutation
interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation<AuthResponse, Error, LoginCredentials>({
    // 1. The mutation function now calls the /login endpoint
    mutationFn: (credentials) => {
      return api.post("/auth/login", credentials).then((res) => res.data);
    },
    // The success logic is identical: update context and redirect
    onSuccess: (data) => {
      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token
      );
      navigate("/"); // Redirect to home page on successful login
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 2. We only need to mutate with email and password
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* 3. The UI text is updated for logging in */}
        <h1 className="text-2xl font-bold text-center">
          Login to Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4. The 'Name' input field is removed */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              title="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              title="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {mutation.isError && (
            <p className="text-sm text-red-600">{mutation.error.message}</p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
