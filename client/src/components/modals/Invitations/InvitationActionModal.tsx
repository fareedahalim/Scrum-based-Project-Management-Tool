
import { useState } from "react";
import {
  X,
  Mail,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useResendInvitation,
  useCancelInvitation,
} from "../../../hooks/Invitation/InvitationHooks";

import type { Invitation } from "../../../types/invitationTypes";

interface InvitationActionModalProps {
  invitation: Invitation;
  onClose: () => void;
}

const InvitationActionModal = ({
  invitation,
  onClose,
}: InvitationActionModalProps) => {
  const resendMutation = useResendInvitation();
  const cancelMutation = useCancelInvitation();

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  // =========================================================
  // RESEND
  // =========================================================

  const handleResend = () => {
    resendMutation.mutate(invitation._id, {
      onSuccess: () => {
        toast.success("Invitation resent successfully");
        onClose();
      },

      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Failed to resend invitation";

        toast.error(message);
      },
    });
  };

  // =========================================================
  // FIRST CLICK
  // ONLY SHOW CONFIRMATION
  // NO API CALL HERE
  // =========================================================

  const handleCancelClick = () => {
    console.log("CANCEL BUTTON CLICKED - SHOWING CONFIRMATION");

    setShowConfirmation(true);
  };

  // =========================================================
  // SECOND CLICK
  // API CALL HAPPENS HERE ONLY
  // =========================================================

  const handleConfirmCancel = () => {
    console.log("CONFIRM CANCEL CLICKED - CALLING API");

    cancelMutation.mutate(invitation._id, {
      onSuccess: () => {
        toast.success("Invitation cancelled successfully");

        setShowConfirmation(false);

        onClose();
      },

      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Failed to cancel invitation";

        toast.error(message);
      },
    });
  };

  // =========================================================
  // CLOSE CONFIRMATION
  // =========================================================

  const handleCloseConfirmation = () => {
    if (cancelMutation.isPending) {
      return;
    }

    setShowConfirmation(false);
  };

  const isLoading =
    resendMutation.isPending ||
    cancelMutation.isPending;

  return (
    <>
      {/* =====================================================
          MAIN ACTION MODAL
      ===================================================== */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

        <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Invitation Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage this invitation.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>

          </div>

          {/* Content */}
          <div className="space-y-5 p-6">

            {/* Invitation Details */}
            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-gray-900">
                {invitation.email}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Role: {invitation.role}
              </p>

            </div>

            {/* =================================================
                RESEND BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Mail size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Resend Invitation
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Send a new invitation link to this user.
                </p>
              </div>

            </button>

            {/* =================================================
                CANCEL BUTTON
                IMPORTANT:
                THIS DOES NOT CALL THE API
            ================================================= */}

            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isLoading}
              className="flex w-full items-center gap-3 rounded-lg border border-red-200 px-4 py-3 text-left hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <Ban size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-red-700">
                  Cancel Invitation
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Prevent this invitation from being accepted.
                </p>
              </div>

            </button>

            {/* Close */}
            <div className="flex justify-end pt-2">

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          CONFIRMATION POPUP
      ===================================================== */}

      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cancel Invitation?
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Please confirm this action.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseConfirmation}
                disabled={cancelMutation.isPending}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Message */}
            <div className="p-6">

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <AlertTriangle size={20} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-red-800">
                      Are you sure?
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      Do you really want to cancel the invitation
                      sent to{" "}
                      <strong>{invitation.email}</strong>?
                    </p>

                    <p className="mt-2 text-xs text-red-600">
                      The invited user will no longer be able to
                      accept this invitation.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CONFIRMATION BUTTONS
              ================================================= */}

              <div className="mt-6 flex justify-end gap-3">

                {/* NO */}
                <button
                  type="button"
                  onClick={handleCloseConfirmation}
                  disabled={cancelMutation.isPending}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Keep Invitation
                </button>

                {/* YES / OK */}
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelMutation.isPending}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelMutation.isPending
                    ? "Cancelling..."
                    : "OK, Cancel"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default InvitationActionModal;

