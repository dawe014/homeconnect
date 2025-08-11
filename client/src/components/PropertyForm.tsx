import React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientPropertyFormSchema,
  propertyFormSchema,
} from "../lib/validators";
import type {
  TClientPropertyFormSchema,
  TPropertyFormSchema,
} from "../lib/validators";

import {
  ExclamationCircleIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import { FaBath, FaBed } from "react-icons/fa";

interface PropertyFormProps {
  initialData?: Partial<TClientPropertyFormSchema>;
  isSubmitting: boolean;
  submitButtonText: string;
  onFormSubmit: (data: TPropertyFormSchema, images?: FileList) => void;
  errorMessage?: string;
}

const FormLabel = (props: React.ComponentPropsWithoutRef<"label">) => (
  <label
    {...props}
    className="block text-sm font-medium leading-6 text-gray-900"
  />
);

const InputWithIcon = ({
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"input"> & { icon: React.ReactNode }) => (
  <div className="relative mt-2 rounded-md shadow-sm">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </div>
    <input
      {...props}
      className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  </div>
);

export default function PropertyForm({
  initialData,
  isSubmitting,
  submitButtonText,
  onFormSubmit,
  errorMessage,
}: PropertyFormProps) {
  const [imageFiles, setImageFiles] = React.useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TClientPropertyFormSchema>({
    resolver: zodResolver(clientPropertyFormSchema),
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<TClientPropertyFormSchema> = (data) => {
    const transformedData = propertyFormSchema.parse(data);
    onFormSubmit(transformedData, imageFiles || undefined);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const ErrorMessage = ({ name }: { name: keyof TClientPropertyFormSchema }) =>
    errors[name] ? (
      <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Core Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Start with the main details of the property.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <FormLabel htmlFor="title">Property Title</FormLabel>
            <div className="mt-2">
              <input
                {...register("title")}
                id="title"
                type="text"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="title" />
          </div>

          <div className="sm:col-span-2">
            <FormLabel htmlFor="price">Price (USD)</FormLabel>
            <InputWithIcon
              {...register("price")}
              id="price"
              type="number"
              placeholder="0"
              icon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
            />
            <ErrorMessage name="price" />
          </div>

          <div className="col-span-full">
            <FormLabel htmlFor="description">Description</FormLabel>
            <div className="mt-2">
              <textarea
                {...register("description")}
                id="description"
                rows={6}
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="description" />
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Write a few sentences about the property.
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Location Details
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Provide the property's address and map coordinates.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <FormLabel htmlFor="address">Street address</FormLabel>
            <div className="mt-2">
              <input
                {...register("address")}
                id="address"
                type="text"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="address" />
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <FormLabel htmlFor="city">City</FormLabel>
            <div className="mt-2">
              <input
                {...register("city")}
                id="city"
                type="text"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="city" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="state">State / Province</FormLabel>
            <div className="mt-2">
              <input
                {...register("state")}
                id="state"
                type="text"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="state" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="zipCode">ZIP / Postal code</FormLabel>
            <div className="mt-2">
              <input
                {...register("zipCode")}
                id="zipCode"
                type="text"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="zipCode" />
          </div>
          <div className="sm:col-span-3">
            <FormLabel htmlFor="latitude">Latitude</FormLabel>
            <div className="mt-2">
              <input
                {...register("latitude")}
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 40.7128"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="latitude" />
          </div>
          <div className="sm:col-span-3">
            <FormLabel htmlFor="longitude">Longitude</FormLabel>
            <div className="mt-2">
              <input
                {...register("longitude")}
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., -74.0060"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <ErrorMessage name="longitude" />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Features & Status
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Describe the property's features and its listing status.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <FormLabel htmlFor="bedrooms">Bedrooms</FormLabel>
            <InputWithIcon
              {...register("bedrooms")}
              id="bedrooms"
              type="number"
              placeholder="0"
              icon={<FaBed className="h-5 w-5 text-gray-400" />}
            />
            <ErrorMessage name="bedrooms" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="bathrooms">Bathrooms</FormLabel>
            <InputWithIcon
              {...register("bathrooms")}
              id="bathrooms"
              type="number"
              placeholder="0"
              icon={<FaBath className="h-5 w-5 text-gray-400" />}
            />
            <ErrorMessage name="bathrooms" />
          </div>
          <div className="sm:col-span-2">
            <FormLabel htmlFor="sqft">Sq. Ft.</FormLabel>
            <InputWithIcon
              {...register("sqft")}
              id="sqft"
              type="number"
              placeholder="0"
              icon={<ArrowsPointingOutIcon className="h-5 w-5 text-gray-400" />}
            />
            <ErrorMessage name="sqft" />
          </div>
          <div className="sm:col-span-3">
            <FormLabel htmlFor="propertyType">Property Type</FormLabel>
            <div className="mt-2">
              <select
                {...register("propertyType")}
                id="propertyType"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3">
            <FormLabel htmlFor="status">Listing Status</FormLabel>
            <div className="mt-2">
              <select
                {...register("status")}
                id="status"
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Property Images
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Upload new images to add to the listing.
        </p>
        <div className="mt-10 col-span-full">
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="images"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={onImageChange}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {errorMessage && (
          <div className="flex items-center text-sm text-red-600">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
