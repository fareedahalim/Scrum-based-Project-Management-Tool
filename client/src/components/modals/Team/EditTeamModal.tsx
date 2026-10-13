
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    useUpdateTeam,
} from "../../../hooks/Team/TeamHook";
import type { UpdateTeamPayload } from "../../../services/Team/teamService";

interface EditTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: {
        id: string;
        name: string;
        description: string;
    } | null;
}

const EditTeamModal = ({
    isOpen,
    onClose,
    team,
}: EditTeamModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const updateTeamMutation = useUpdateTeam();

    useEffect(() => {
        if (isOpen && team) {
            setName(team.name);
            setDescription(team.description);
        }
    }, [isOpen, team]);

    if (!isOpen || !team) {
        return null;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: UpdateTeamPayload = {
            name: name.trim(),
            description: description.trim(),
        };

        if (!payload.name || !payload.description) {
            toast.error("Please fill in all fields");
            return;
        }

        updateTeamMutation.mutate(
            {
                teamId: team.id,
                data: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Team updated successfully");
                    onClose();
                },
                onError: (error: any) => {
                    toast.error(
                        error?.response?.data?.message ||
                        "Failed to update team"
                    );
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900">
                    Edit Team
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Update the team name and description.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label
                            htmlFor="team-name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Team Name
                        </label>
                        <input
                            id="team-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            maxLength={50}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="team-description"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="team-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            required
                            rows={3}
                            maxLength={300}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updateTeamMutation.isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                updateTeamMutation.isPending ||
                                !name.trim() ||
                                !description.trim()
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {updateTeamMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTeamModal;