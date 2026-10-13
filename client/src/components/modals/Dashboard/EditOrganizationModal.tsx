import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { Organization } from "../../../services/Organization/organizationService";
import { organizationSchema, type OrganizationFormData } from "../../../lib/validations/organization.schema";
import { useUpdateOrganization } from "../../../hooks/Organization/OrganizationHooks";
import toast from "react-hot-toast";


interface EditOrganizationModalProps {
  organization: Organization;
  onClose: () => void;
}

const EditOrganizationModal = ({
  organization,
  onClose,
}: EditOrganizationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),

    defaultValues: {
      name: organization.name,
      description: organization.description || "",
      website: organization.website || "",
      logo: organization.logo || "",
    },
  });
  const { mutate: updateOrganizationMutation, isPending} = useUpdateOrganization();

  

  const onSubmit = (data: OrganizationFormData) => {
  updateOrganizationMutation(data, {
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          "Organization updated successfully"
      );

      onClose();
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to update organization";

      toast.error(message);
    },
  });
};

    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Organization
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your organization details.
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
          {/* Organization Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Organization Name
            </label>

            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Logo */}
          <div>
            <label
              htmlFor="logo"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Logo URL
            </label>

            <input
              id="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              {...register("logo")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.logo && (
              <p className="mt-1 text-sm text-red-500">
                {errors.logo.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Website
            </label>

            <input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...register("website")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.website && (
              <p className="mt-1 text-sm text-red-500">
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
  <button
    type="button"
    onClick={onClose}
    disabled={isPending}
    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isPending}
    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isPending ? "Saving..." : "Save Changes"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganizationModal;

