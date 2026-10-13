
import { useState } from "react";
import { useParams } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

import {
    useGetTeamById,
    useGetTeamMembers,
    useRemoveTeamMember,
} from "../../hooks/Team/TeamHook";

import AddTeamMemberModal from "../../components/modals/Team/AddTeamMemberModal";
import ChangeTeamLeadModal from "../../components/modals/Team/ChangeTeamLeadModal";

const TeamDetailsPage = () => {
    const { teamId } = useParams<{ teamId: string }>();

    // =========================================================
    // MODAL STATES
    // =========================================================

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] =
        useState(false);

    const [isChangeLeadModalOpen, setIsChangeLeadModalOpen] =
        useState(false);

    const [isRemoveConfirmationOpen, setIsRemoveConfirmationOpen] =
        useState(false);

    // Store the member selected for removal
    const [selectedMember, setSelectedMember] =
        useState<{
            userId: string;
            firstName: string;
            lastName: string;
            email: string;
        } | null>(null);

    // =========================================================
    // GET TEAM MEMBERS
    // =========================================================

    const {
        data: members,
        isLoading: isMembersLoading,
        isError: isMembersError,
    } = useGetTeamMembers(teamId ?? "");

    // =========================================================
    // GET TEAM DETAILS
    // =========================================================

    const {
        data: team,
        isLoading,
        isError,
    } = useGetTeamById(teamId ?? "");

    // =========================================================
    // REMOVE MEMBER MUTATION
    // =========================================================

    const removeMemberMutation = useRemoveTeamMember();

    // =========================================================
    // FIRST CLICK
    // OPEN CONFIRMATION MODAL
    // NO API CALL HERE
    // =========================================================

    const handleRemoveMemberClick = (member: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
    }) => {
        setSelectedMember(member);
        setIsRemoveConfirmationOpen(true);
    };

    // =========================================================
    // CONFIRM REMOVE
    // API CALL HAPPENS HERE
    // =========================================================

    const handleConfirmRemove = () => {
        if (!selectedMember || !teamId) {
            return;
        }

        removeMemberMutation.mutate(
            {
                teamId,
                userId: selectedMember.userId,
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Team member removed successfully"
                    );

                    setIsRemoveConfirmationOpen(false);
                    setSelectedMember(null);
                },

                onError: (error: any) => {
                    const message =
                        error?.response?.data?.message ||
                        "Failed to remove team member";

                    toast.error(message);
                },
            }
        );
    };

    // =========================================================
    // CLOSE REMOVE CONFIRMATION
    // =========================================================

    const handleCloseRemoveConfirmation = () => {
        if (removeMemberMutation.isPending) {
            return;
        }

        setIsRemoveConfirmationOpen(false);
        setSelectedMember(null);
    };

    // =========================================================
    // LOADING TEAM
    // =========================================================

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading team...
                </p>
            </div>
        );
    }

    // =========================================================
    // TEAM ERROR
    // =========================================================

    if (isError || !team) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    Failed to load team.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="p-6">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {team.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {team.description}
                    </p>
                </div>

                {/* =================================================
                    TEAM INFORMATION + MEMBERS
                ================================================= */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* =================================================
                        TEAM INFORMATION
                    ================================================= */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Team Information
                        </h2>

                        <div className="mt-5 space-y-6">

                            {/* Team Name */}
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Team Name
                                </p>

                                <p className="mt-1 text-sm text-gray-700">
                                    {team.name}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Description
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-700">
                                    {team.description}
                                </p>
                            </div>

                            {/* =================================================
                                TEAM LEAD
                            ================================================= */}

                            <div>

                                {/* Label + Change Button */}
                                <div className="flex items-center justify-between">

                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Team Lead
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsChangeLeadModalOpen(true)
                                        }
                                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Change Lead
                                    </button>

                                </div>

                                {/* Lead Card */}
                                <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">

                                    {team.lead ? (
                                        <>
                                            {/* Lead Avatar */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                                                {team.lead.firstName.charAt(
                                                    0
                                                )}
                                                {team.lead.lastName.charAt(
                                                    0
                                                )}
                                            </div>

                                            {/* Lead Details */}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        team.lead
                                                            .firstName
                                                    }{" "}
                                                    {
                                                        team.lead
                                                            .lastName
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    Team Lead
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No lead assigned
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>
                    </div>

                    {/* =================================================
                        TEAM MEMBERS
                    ================================================= */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        {/* Members Header */}
                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Team Members
                                </h2>

                                {!isMembersLoading &&
                                    !isMembersError &&
                                    members && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {members.length}{" "}
                                            {members.length === 1
                                                ? "member"
                                                : "members"}
                                        </p>
                                    )}
                            </div>

                            {/* Add Member */}
                            <button
                                type="button"
                                onClick={() =>
                                    setIsAddMemberModalOpen(true)
                                }
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Add Member
                            </button>

                        </div>

                        {/* Members Content */}
                        <div className="mt-5">

                            {/* Loading */}
                            {isMembersLoading ? (
                                <p className="text-sm text-gray-500">
                                    Loading team members...
                                </p>

                            /* Error */
                            ) : isMembersError ? (
                                <p className="text-sm text-red-500">
                                    Failed to load team members.
                                </p>

                            /* Empty */
                            ) : !members ||
                                members.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No team members found.
                                </p>

                            /* Members List */
                            ) : (
                                <div className="space-y-3">

                                    {members.map((member) => {

                                        // Check whether this member
                                        // is the current team lead.
                                        const isLead =
                                            member.userId ===
                                            team.lead?.id;

                                        return (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                                            >

                                                {/* =================================================
                                                    USER
                                                ================================================= */}

                                                <div className="flex min-w-0 items-center gap-3">

                                                    {/* Profile Image */}
                                                    {member.profileImage ? (
                                                        <img
                                                            src={
                                                                member.profileImage
                                                            }
                                                            alt={`${member.firstName} ${member.lastName}`}
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                                                            {member.firstName.charAt(
                                                                0
                                                            )}
                                                            {member.lastName.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* User Details */}
                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-2">

                                                            <p className="truncate text-sm font-medium text-gray-900">
                                                                {
                                                                    member.firstName
                                                                }{" "}
                                                                {
                                                                    member.lastName
                                                                }
                                                            </p>

                                                            {/* Team Lead Badge */}
                                                            {isLead && (
                                                                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                                                    Team Lead
                                                                </span>
                                                            )}

                                                        </div>

                                                        <p className="truncate text-xs text-gray-500">
                                                            {member.email}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* =================================================
                                                    REMOVE BUTTON
                                                ================================================= */}

                                                {!isLead && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMemberClick(
                                                                {
                                                                    userId:
                                                                        member.userId,
                                                                    firstName:
                                                                        member.firstName,
                                                                    lastName:
                                                                        member.lastName,
                                                                    email:
                                                                        member.email,
                                                                }
                                                            )
                                                        }
                                                        disabled={
                                                            removeMemberMutation.isPending
                                                        }
                                                        className="ml-4 shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* =================================================
                    ADD TEAM MEMBER MODAL
                ================================================= */}

                <AddTeamMemberModal
                    isOpen={isAddMemberModalOpen}
                    onClose={() =>
                        setIsAddMemberModalOpen(false)
                    }
                    teamId={teamId ?? ""}
                />

                {/* =================================================
                    CHANGE TEAM LEAD MODAL
                ================================================= */}

                {team && (
                    <ChangeTeamLeadModal
                        isOpen={isChangeLeadModalOpen}
                        onClose={() =>
                            setIsChangeLeadModalOpen(false)
                        }
                        teamId={teamId ?? ""}
                        currentLeadId={team.lead?.id}
                    />
                )}

            </div>

            {/* =====================================================
                REMOVE MEMBER CONFIRMATION MODAL
            ===================================================== */}

            {isRemoveConfirmationOpen &&
                selectedMember && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">

                        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between border-b px-6 py-4">

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Remove Team Member?
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Please confirm this action.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseRemoveConfirmation
                                    }
                                    disabled={
                                        removeMemberMutation.isPending
                                    }
                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            {/* Modal Content */}
                            <div className="p-6">

                                {/* Warning Box */}
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">

                                    <div className="flex gap-3">

                                        {/* Warning Icon */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                            <AlertTriangle size={20} />
                                        </div>

                                        {/* Message */}
                                        <div>

                                            <p className="text-sm font-semibold text-red-800">
                                                Are you sure?
                                            </p>

                                            <p className="mt-1 text-sm leading-5 text-red-700">
                                                Do you really want to
                                                remove{" "}
                                                <strong>
                                                    {
                                                        selectedMember.firstName
                                                    }{" "}
                                                    {
                                                        selectedMember.lastName
                                                    }
                                                </strong>{" "}
                                                from this team?
                                            </p>

                                            <p className="mt-2 text-xs text-red-600">
                                                This user will no longer
                                                be part of this team and
                                                can be added to another
                                                team.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Member Information */}
                                <div className="mt-4 rounded-lg bg-gray-50 p-4">

                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Member
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {selectedMember.firstName}{" "}
                                        {selectedMember.lastName}
                                    </p>

                                    <p className="mt-1 break-all text-xs text-gray-500">
                                        {selectedMember.email}
                                    </p>

                                </div>

                                {/* Buttons */}
                                <div className="mt-6 flex justify-end gap-3">

                                    {/* Keep Member */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseRemoveConfirmation
                                        }
                                        disabled={
                                            removeMemberMutation.isPending
                                        }
                                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Keep Member
                                    </button>

                                    {/* Confirm Remove */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleConfirmRemove
                                        }
                                        disabled={
                                            removeMemberMutation.isPending
                                        }
                                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {removeMemberMutation.isPending
                                            ? "Removing..."
                                            : "OK, Remove"}
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                )}
        </>
    );
};

export default TeamDetailsPage;
