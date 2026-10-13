import { useGetOrganization } from "../../hooks/Organization/OrganizationHooks";

interface WelcomeSectionProps {
  firstName: string;
}

const WelcomeSection = ({ firstName }: WelcomeSectionProps) => {
  const {
    data: organizationResponse,
    isLoading,
  } = useGetOrganization();

  const organization = organizationResponse?.data;

  // const firstName = user?.firstName || "User";

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }
  return (

    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to{" "}
          {organization?.name || "Nexora"},{" "}
          {firstName}!
        </h1>

      <p className="mt-1 text-sm text-gray-500">
        Here's what's happening with your organization today.
      </p>
    </div>
  );
};

export default WelcomeSection;