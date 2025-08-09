import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { contactFormSchema } from "../lib/validators";
import type { TContactFormSchema } from "../lib/validators";
import api from "../services/api";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: TContactFormSchema) => api.post("/contact", data),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit: SubmitHandler<TContactFormSchema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Get in touch
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're here to help you with your property journey. Whether you
              have a question about a listing, need support, or want to partner
              with us, we'd love to hear from you.
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <BuildingOffice2Icon className="h-7 w-6 text-gray-400" />
                </dt>
                <dd>
                  123 Real Estate Ave
                  <br />
                  New York, NY 10001
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <PhoneIcon className="h-7 w-6 text-gray-400" />
                </dt>
                <dd>
                  <a
                    className="hover:text-gray-900"
                    href="tel:+1 (555) 234-5678"
                  >
                    +1 (555) 234-5678
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <EnvelopeIcon className="h-7 w-6 text-gray-400" />
                </dt>
                <dd>
                  <a
                    className="hover:text-gray-900"
                    href="mailto:hello@homeconnect.com"
                  >
                    hello@homeconnect.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48"
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            {mutation.isSuccess ? (
              <div className="text-center bg-green-50 p-8 rounded-lg">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-xl font-semibold text-green-800">
                  Message Sent!
                </h3>
                <p className="mt-2 text-green-700">
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Full name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      {...register("name")}
                      id="name"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      {...register("email")}
                      id="email"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      {...register("subject")}
                      id="subject"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      {...register("message")}
                      id="message"
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            {!mutation.isSuccess && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300"
                >
                  {mutation.isPending ? "Sending..." : "Send message"}
                </button>
              </div>
            )}
            {mutation.isError && (
              <p className="mt-4 text-sm text-red-600 text-right">
                {(mutation.error as any).response?.data?.message ||
                  "An error occurred."}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
