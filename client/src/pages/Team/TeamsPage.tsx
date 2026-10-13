
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { MouseEvent } from "react";

import {
    useGetTeams,
    useDeleteTeam,
} from "../../hooks/Team/TeamHook";

import CreateTeamModal from "../../components/modals/Team/CreateTeamModal";
import DeleteTeamModal from "../../components/modals/Team/DeleteTeamModal";
import EditTeamModal from "../../components/modals/Team/EditTeamModal";

const TeamsPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editingTeam, setEditingTeam] = useState<{
        id: string;
        name: string;
        description: string;
    } | null>(null);

    const [selectedTeam, setSelectedTeam] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const navigate = useNavigate();

    const {
        data: teams,
        isLoading,
        isError,
    } = useGetTeams();

    const deleteTeamMutation = useDeleteTeam();

    const handleDeleteTeam = () => {
        if (!selectedTeam) return;

        deleteTeamMutation.mutate(selectedTeam.id, {
            onSuccess: () => {
                toast.success("Team deleted successfully");
                setSelectedTeam(null);
            },
            onError: (error) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to delete team";

                toast.error(message);
            },
        });
    };

    const handleEditTeam = (
        event: React.MouseEvent<HTMLButtonElement>,
        team: { id: string; name: string; description: string }
    ) => {
        event.stopPropagation();

        setEditingTeam(team);
        setIsEditModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading teams...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    Failed to load teams.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Teams
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage teams and their members.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Create Team
                </button>
            </div>

            {/* Empty state */}
            {!teams || teams.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        No teams found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your first team to start collaborating.
                    </p>
                </div>
            ) : (
                /* Team list */
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            onClick={() =>
                                navigate(`/teams/${team.id}`)
                            }
                            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
                        >
                            {/* Team Information */}
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {team.name}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {team.description || "No description"}
                                </p>
                            </div>

                            {/* Team Lead */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Team Lead
                                </p>

                                <div className="mt-2 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                                        {team.lead
                                            ? `${team.lead.firstName} ${team.lead.lastName}`
                                                .split(" ")
                                                .map((name) => name[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                            : "NA"}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {team.lead
                                                ? `${team.lead.firstName} ${team.lead.lastName}`
                                                : "No lead assigned"}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Team Lead
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
                                <button
                                    onClick={(event) => handleEditTeam(event, team)}
                                    className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    disabled={deleteTeamMutation.isPending}
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        setSelectedTeam({
                                            id: team.id,
                                            name: team.name,
                                        });
                                    }}
                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Team Modal */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <EditTeamModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTeam(null);
                }}
                team={editingTeam}
            />
            {/* Delete Team Modal */}
            <DeleteTeamModal
                isOpen={Boolean(selectedTeam)}
                teamName={selectedTeam?.name ?? ""}
                isDeleting={deleteTeamMutation.isPending}
                onClose={() => setSelectedTeam(null)}
                onConfirm={handleDeleteTeam}
            />
        </div>
    );
};

export default TeamsPage;