import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Property } from "../types";
import Spinner from "../components/Spinner";
import PropertyForm from "../components/PropertyForm";
import type { TPropertyFormSchema } from "../lib/validators";
import { XMarkIcon } from "@heroicons/react/24/solid";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

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

  useEffect(() => {
    if (property) {
      setExistingImages(property.images || []);
    }
  }, [property]);

  const mutation = useMutation({
    mutationFn: (updatedProperty: FormData) => {
      return api.put(`/properties/${id}`, updatedProperty, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      navigate("/dashboard/my-listings");
    },
  });

  const handleSubmit = (data: TPropertyFormSchema, newImages?: FileList) => {
    const propertyData = new FormData();

    Object.entries(data).forEach(([key, value]) =>
      propertyData.append(key, String(value))
    );

    propertyData.append("imagesToDelete", JSON.stringify(imagesToDelete));

    if (newImages) {
      for (let i = 0; i < newImages.length; i++) {
        propertyData.append("images", newImages[i]);
      }
    }
    mutation.mutate(propertyData);
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <div className="text-red-500 p-8">
        Error loading property: {error.message}
      </div>
    );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Edit Property Listing
        </h1>
        <p className="mt-2 text-sm text-gray-600 truncate">
          Updating details for:{" "}
          <span className="font-medium">{property?.title}</span>
        </p>
      </div>

      {/* UI for managing existing images */}
      <div className="mb-8 p-4 border rounded-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Manage Existing Images
        </h2>
        {existingImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((imageUrl) => (
              <div key={imageUrl} className="relative group">
                <img
                  src={
                    imageUrl.startsWith("http")
                      ? imageUrl
                      : `${SERVER_URL}${imageUrl}`
                  }
                  alt="Property"
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExistingImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none hover:bg-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No existing images to display. Upload new ones below.
          </p>
        )}
      </div>

      <PropertyForm
        initialData={property}
        isSubmitting={mutation.isPending}
        submitButtonText="Save Changes"
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
