import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EyeIcon,
  TrashIcon,
  EnvelopeOpenIcon,
  ExclamationCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ViewMessageModal from "../components/modals/ViewMessageModal";

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const fetchMessages = async (): Promise<IContactMessage[]> => {
  const { data } = await api.get("/contact");
  return data;
};

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<IContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: messages, isLoading } = useQuery<IContactMessage[], Error>({
    queryKey: ["contactMessages"],
    queryFn: fetchMessages,
  });

  const handleMutationError = (error: any) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred.";
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const readMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/contact/${id}/read`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      setConfirmModalOpen(false);
    },
    onError: handleMutationError,
  });

  const openViewModal = (message: IContactMessage) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    if (!message.isRead) {
      readMutation.mutate(message._id);
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setMessageToDelete(id);
    setConfirmModalOpen(true);
  };
  const handleDelete = () => {
    if (messageToDelete) deleteMutation.mutate(messageToDelete);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold leading-6 text-gray-900">
              Contact Messages
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage messages submitted through the contact form.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-lg  sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        From
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {messages && messages.length > 0 ? (
                      messages.map((message) => (
                        <tr
                          key={message._id}
                          className={
                            !message.isRead
                              ? "bg-indigo-50 hover:bg-indigo-100"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {message.name}
                            </div>
                            <div className="text-gray-500">{message.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {message.subject}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-x-4">
                              <button
                                onClick={() => openViewModal(message)}
                                className="text-gray-400 hover:text-indigo-600"
                                title="View Message"
                              >
                                {message.isRead ? (
                                  <EnvelopeOpenIcon className="h-5 w-5" />
                                ) : (
                                  <EyeIcon className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  openDeleteConfirmation(message._id)
                                }
                                className="text-gray-400 hover:text-red-600"
                                title="Delete Message"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No Messages
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            There are no contact messages in the inbox yet.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewMessageModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        message={selectedMessage}
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action is permanent."
        isConfirming={deleteMutation.isPending}
      />
    </>
  );
}
