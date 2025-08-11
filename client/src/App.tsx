import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import AddListingPage from "./pages/AddListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import EditListingPage from "./pages/EditListingPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import ForRentPage from "./pages/ForRentPage";
import ForSalePage from "./pages/ForSalePage";
import AboutUsPage from "./pages/AboutUsPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPropertiesPage from "./pages/AgentPropertiesPage";
import ProfilePage from "./pages/ProfilePage";
import ManagePropertiesPage from "./pages/ManagePropertiesPage";
import DashboardIndexPage from "./pages/DashboardIndexPage";
import ContactPage from "./pages/ContactPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/for-rent" element={<ForRentPage />} />
        <Route path="/for-sale" element={<ForSalePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/agents" element={<AgentsPage />} />{" "}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/agent-listings" element={<AgentPropertiesPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route
          element={<ProtectedRoute allowedRoles={["user", "agent", "admin"]} />}
        >
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Auth routes without a layout or with a simpler one */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Agent/Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["agent", "admin"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndexPage />} />
          <Route path="overview" element={<DashboardIndexPage />} />
          <Route path="my-listings" element={<MyListingsPage />} />
          <Route path="add-listing" element={<AddListingPage />} />
          <Route path="edit-listing/:id" element={<EditListingPage />} />
          <Route path="manage-users" element={<ManageUsersPage />} />
          <Route path="manage-properties" element={<ManagePropertiesPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
