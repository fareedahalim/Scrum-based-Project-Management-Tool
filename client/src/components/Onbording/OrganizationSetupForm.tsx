import { useNavigate } from "react-router-dom"
import { useCreateOrganization } from "../../hooks/Organization/OrganizationHooks";
import { useForm } from "react-hook-form";
import { organizationSchema, type OrganizationFormData } from "../../lib/validations/organization.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const OrganizationSetupForm = () => {
    
    const navigate = useNavigate();

    const createOrganizationMutation = useCreateOrganization();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrganizationFormData>({
        resolver: zodResolver(organizationSchema),

        defaultValues: {
            name: "",
            logo: "",
            description: "",
            website: ""
        },
    })

    const onSubmit = (data: OrganizationFormData) => {
        createOrganizationMutation.mutate(data, {
            onSuccess: (response) => {
                toast.success(
                    response?.message || "Organization ser=tup completed successfully"
                );

                navigate(FRONTEND_ROUTES.DASHBOARD, {
                    replace: true,
                })
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Failed to create Organization";

                toast.error(message)
            }
        })
    }

     return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
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
          placeholder="ABC Technology"
          {...register("name")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name.message}
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
          placeholder="Tell us about your organization"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createOrganizationMutation.isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createOrganizationMutation.isPending
          ? "Creating..."
          : "Complete Organization Setup"}
      </button>
    </form>
  );
};

export default OrganizationSetupForm;