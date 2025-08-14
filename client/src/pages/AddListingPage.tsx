import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PropertyForm from "../components/PropertyForm";
import type { TPropertyFormSchema } from "../lib/validators";

export default function AddListingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newProperty: FormData) => {
      return api.post("/properties", newProperty, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
      navigate("/dashboard/my-listings");
    },
    onError: (error) => {
      console.error("Failed to add property:", error);
    },
  });

  const handleSubmit = (data: TPropertyFormSchema, images?: File[]) => {
    const propertyData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      propertyData.append(key, String(value));
    });

    if (images) {
      images.forEach((file) => {
        propertyData.append("images", file);
      });
    }

    mutation.mutate(propertyData);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Create a New Property Listing
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the form below to add a new property to the platform.
        </p>
      </div>

      <PropertyForm
        isSubmitting={mutation.isPending}
        submitButtonText="Add Property"
        onFormSubmit={handleSubmit}
        errorMessage={
          mutation.isError
            ? (mutation.error as any).response?.data?.message ||
              "An unexpected error occurred."
            : undefined
        }
      />
    </div>
  );
}
