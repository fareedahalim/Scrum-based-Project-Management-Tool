import { useEffect, useState } from "react";
import {
  useChangeTeamLead,
  useGetTeamMembers,
} from "../../../hooks/Team/TeamHook";
import toast from "react-hot-toast";

interface ChangeTeamLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentLeadId: string;
}

const ChangeTeamLeadModal = ({
  isOpen,
  onClose,
  teamId,
  currentLeadId,
}: ChangeTeamLeadModalProps) => {
  const [leadId, setLeadId] = useState("");

  const {
    data: members,
    isLoading,
    isError,
  } = useGetTeamMembers(teamId);

  const changeLeadMutation = useChangeTeamLead();

  useEffect(() => {
    if (isOpen) {
      setLeadId("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!leadId) {
      toast.error("Please select a new team lead");
      return;
    }

    try {
      await changeLeadMutation.mutateAsync({
        teamId,
        data: {
          leadId,
        },
      });

      toast.success("Team lead changed successfully");

      setLeadId("");
      onClose();
    } catch (error) {
      console.error(
        "Failed to change team lead:",
        error
      );
    }
  };

  const handleClose = () => {
    setLeadId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Change Team Lead
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a member to become the new team lead.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Team Lead
            </label>

            {isError ? (
              <p className="text-sm text-red-500">
                Failed to load team members.
              </p>
            ) : (
              <select
                value={leadId}
                onChange={(event) =>
                  setLeadId(event.target.value)
                }
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
              >
                <option value="">
                  {isLoading
                    ? "Loading members..."
                    : "Select new team lead"}
                </option>

                {members
                  ?.filter(
                    (member) =>
                      member.userId !== currentLeadId
                  )
                  .map((member) => (
                    <option
                      key={member.userId}
                      value={member.userId}
                    >
                      {member.firstName}{" "}
                      {member.lastName} -{" "}
                      {member.email}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={changeLeadMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !leadId ||
                changeLeadMutation.isPending
              }
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changeLeadMutation.isPending
                ? "Changing..."
                : "Change Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeTeamLeadModal;