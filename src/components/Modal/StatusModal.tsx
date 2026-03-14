// import React, { Fragment, useEffect } from 'react';
// import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   message: string;
// }

// const StatusModal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (title === "Success") {
//       timer = setTimeout(onClose, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [title, onClose]);

//   const isSuccess = title === "Success";

//   return (

//     <Transition show={isOpen} as={Fragment}>
//       <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
//         <div className="flex items-end justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             enterTo="opacity-100 translate-y-0 sm:scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//           >
//             <DialogPanel className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//           </TransitionChild>

//           <TransitionChild
//             as={Fragment}
//             enter={isSuccess ? "ease-out duration-300 transform transition" : "ease-out duration-300"}
//             enterFrom={isSuccess ? "opacity-0 scale-90" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
//             enterTo="opacity-100 translate-y-0 sm:scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//             leaveTo={isSuccess ? "opacity-0 scale-90" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
//           >
//             <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
//               <div>
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  
//                   <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </div>
//                 <div className="mt-3 text-center sm:mt-5">
//                   <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
//                     {title}
//                   </DialogTitle>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">
//                       {message}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 sm:mt-6">
//                 <button
//                   type="button"
//                   className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
//                   onClick={onClose}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </TransitionChild>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default StatusModal;
import React, { Fragment, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const StatusModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (title === "Success") {
      timer = setTimeout(onClose, 1500); // auto close for success
    }
    return () => clearTimeout(timer);
  }, [title, onClose]);

  const isSuccess = title === "Success";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPanel className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          {/* Content */}
          <TransitionChild
            as={Fragment}
            enter={isSuccess ? "ease-out duration-300 transform transition" : "ease-out duration-300"}
            enterFrom={isSuccess ? "opacity-0 scale-90" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo={isSuccess ? "opacity-0 scale-90" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                {/* Icon Circle */}
                <div
                  className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                    isSuccess ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {isSuccess ? (
                    <svg
                      className="h-6 w-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>

                {/* Title & Message */}
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>

              {/* Close Button (only for errors) */}
              {!isSuccess && (
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StatusModal;
