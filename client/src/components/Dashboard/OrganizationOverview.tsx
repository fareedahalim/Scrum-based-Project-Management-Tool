import { useState } from "react";
import { Building2, Globe, Pencil, X } from "lucide-react";

import type { Organization } from "../../services/Organization/organizationService";
import EditOrganizationModal from "../modals/Dashboard/EditOrganizationModal";

interface OrganizationOverviewProps {
  organization: Organization;
}

const OrganizationOverview = ({
  organization,
}: OrganizationOverviewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Organization
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {organization.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>

        {/* Organization details */}
        <div className="mt-5 flex items-start gap-5">
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            {organization.logo ? (
              <img
                src={organization.logo}
                alt={organization.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2
                size={32}
                className="text-gray-400"
              />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            {organization.description ? (
              <p className="text-sm text-gray-600">
                {organization.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                No organization description added.
              </p>
            )}

            {organization.website && (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Globe size={16} />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditOrganizationModal
          organization={organization}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrganizationOverview;