
import { useState } from "react";
import {
  useCreateTeam,
  useGetAvailableTeamMembers,
} from "../../../hooks/Team/TeamHook";
import toast from "react-hot-toast";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTeamModal = ({
  isOpen,
  onClose,
}: CreateTeamModalProps) => {
  const createTeamMutation = useCreateTeam();

  const {
    data: availableMembers,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAvailableTeamMembers();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Team description is required");
      return;
    }

    if (!leadId) {
      toast.error("Please select a team lead");
      return;
    }

    try {
      await createTeamMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        lead: leadId,
      });

      toast.success("Team created successfully");

      setName("");
      setDescription("");
      setLeadId("");

      onClose();
    } catch (error: any) {
      console.error("Create team error:", error);
      console.error(
        "Backend response:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create team";

      toast.error(message);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setLeadId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Team
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a team and assign a team lead.
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Team Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Team Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Frontend Team"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Responsible for frontend development..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Team Lead */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Team Lead
            </label>

            {isUsersError ? (
              <p className="text-sm text-red-500">
                Failed to load available members.
              </p>
            ) : (
              <select
                value={leadId}
                onChange={(event) =>
                  setLeadId(event.target.value)
                }
                disabled={
                  isUsersLoading ||
                  !availableMembers ||
                  availableMembers.length === 0
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
              >
                <option value="">
                  {isUsersLoading
                    ? "Loading members..."
                    : !availableMembers ||
                      availableMembers.length === 0
                    ? "No available members"
                    : "Select a team lead"}
                </option>

                {availableMembers?.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            )}

            {!isUsersLoading &&
              !isUsersError &&
              availableMembers &&
              availableMembers.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  No available members. All members are
                  already assigned to a team.
                </p>
              )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">

            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              disabled={createTeamMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Create Team */}
            <button
              type="submit"
              disabled={
                createTeamMutation.isPending ||
                isUsersLoading ||
                isUsersError ||
                !name.trim() ||
                !description.trim() ||
                !leadId
              }
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createTeamMutation.isPending
                ? "Creating..."
                : "Create Team"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;

