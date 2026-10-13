import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Mail, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateInvitation } from "../../../hooks/Invitation/InvitationHooks";
import { createInvitationSchema, type CreateInvitationFormData } from "../../../lib/validations/invitation.schema";




interface InviteUserModalProps {
  onClose: () => void;
}

const InviteUserModal = ({
  onClose,
}: InviteUserModalProps) => {
  const createInvitationMutation =
    useCreateInvitation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInvitationFormData>({
    resolver: zodResolver(createInvitationSchema),
  });

  const onSubmit = async (
    data: CreateInvitationFormData
  ) => {
    try {
      await createInvitationMutation.mutateAsync({
        email: data.email,
      });

      
      toast.success(
        "Invitation sent successfully"
      );

      reset();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to send invitation";

      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Invite User
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Send an invitation to join Nexora.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="invite-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="invite-email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs leading-5 text-gray-600">
              The invited user will receive a link to
              create their account. They will be added
              as a <strong>MEMBER</strong>.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createInvitationMutation.isPending
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createInvitationMutation.isPending
              }
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />

              {createInvitationMutation.isPending
                ? "Sending..."
                : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;