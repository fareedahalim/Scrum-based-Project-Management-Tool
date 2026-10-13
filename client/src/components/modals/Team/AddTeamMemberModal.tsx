import { useState } from "react";
// import { useGetAvailableTeamMembers } from "../../../hooks/User/UserHooks";
import { useAddTeamMember, useGetAvailableTeamMembers } from "../../../hooks/Team/TeamHook";

interface AddTeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
}

const AddTeamMemberModal = ({
    isOpen,
    onClose,
    teamId,
}: AddTeamMemberModalProps) => {
    const [userId, setUserId] = useState("");

    const {
        data: users,
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useGetAvailableTeamMembers();

    const addMemberMutation = useAddTeamMember();

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!userId) {
            return;
        }

        try {
            await addMemberMutation.mutateAsync({
                teamId,
                data: {
                    userId,
                },
            });

            setUserId("");
            onClose();
        } catch (error) {
            console.error(
                "Failed to add team member:",
                error
            );
        }
    };

    const handleClose = () => {
        setUserId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Add Team Member
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Select a user to add to this team.
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
                    {/* User */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            User
                        </label>

                        {isUsersError ? (
                            <p className="text-sm text-red-500">
                                Failed to load available users.
                            </p>
                        ) : (
                            <select
                                value={userId}
                                onChange={(event) =>
                                    setUserId(event.target.value)
                                }
                                disabled={
                                    isUsersLoading ||
                                    !users ||
                                    users.length === 0
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isUsersLoading
                                        ? "Loading users..."
                                        : !users ||
                                          users.length === 0
                                        ? "No users available"
                                        : "Select user"}
                                </option>

                                {users?.map((user) => (
    <option
        key={user.id}
        value={user.id}
    >
        {user.firstName}{" "}
        {user.lastName} -{" "}
        {user.email}
    </option>
))}
                            </select>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={addMemberMutation.isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        {/* Add Member */}
                        <button
                            type="submit"
                            disabled={
                                !userId ||
                                addMemberMutation.isPending
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {addMemberMutation.isPending
                                ? "Adding..."
                                : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeamMemberModal;