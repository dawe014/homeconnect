import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { IContactMessage } from "../../pages/MessagesPage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: IContactMessage | null;
}

export default function ViewMessageModal({ isOpen, onClose, message }: Props) {
  if (!message) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 border-b pb-4"
                >
                  Message from:{" "}
                  <span className="font-bold">{message.name}</span>
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800">{message.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subject</p>
                    <p className="text-gray-800">{message.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Message</p>
                    <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {message.message}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Received
                    </p>
                    <p className="text-gray-800">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
