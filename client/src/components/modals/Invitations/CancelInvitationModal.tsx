
// import { AlertTriangle, X } from "lucide-react";

// interface CancelInvitationModalProps {
//   email: string;
//   isLoading: boolean;
//   onConfirm: () => void;
//   onClose: () => void;
// }

// const CancelInvitationModal = ({
//   email,
//   isLoading,
//   onConfirm,
//   onClose,
// }: CancelInvitationModalProps) => {
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               Cancel Invitation
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               This action cannot be undone.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isLoading}
//             className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">

//           <div className="rounded-lg border border-red-200 bg-red-50 p-4">
//             <div className="flex gap-3">

//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
//                 <AlertTriangle size={20} />
//               </div>

//               <div>
//                 <p className="text-sm font-semibold text-red-800">
//                   Are you sure?
//                 </p>

//                 <p className="mt-1 text-sm leading-5 text-red-700">
//                   You are about to cancel the invitation sent to{" "}
//                   <strong>{email}</strong>.
//                 </p>

//                 <p className="mt-2 text-xs text-red-600">
//                   After cancellation, this invitation can no longer
//                   be accepted.
//                 </p>
//               </div>

//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-6 flex justify-end gap-3">

//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Keep Invitation
//             </button>

//             <button
//               type="button"
//               onClick={onConfirm}
//               disabled={isLoading}
//               className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {isLoading
//                 ? "Cancelling..."
//                 : "Cancel Invitation"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancelInvitationModal;

