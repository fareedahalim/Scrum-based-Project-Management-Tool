import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import WelcomeSection from "../../components/Dashboard/WelcomeSection";
import QuickActions from "../../components/Dashboard/QuickActions";
import StatsGrid from "../../components/Dashboard/StatsGrid";
import ActiveProjects from "../../components/Dashboard/ActiveProjects";
// import DepartmentTeams from "../../components/Dashboard/DepartmentTeams";
import OrganizationHealth from "../../components/Dashboard/OrganizationHealth";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import DepartmentTeams from "../../components/Dashboard/DepartmentsTeams";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useGetOrganization } from "../../hooks/Organization/OrganizationHooks";
import OrganizationOverview from "../../components/Dashboard/OrganizationOverview";

import ProductOwnerProjects from "../../components/Dashboard/ProductOwnerProjects";

const DashboardPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    const {
        data: organizationResponse,
        isLoading,
    } = useGetOrganization();

    const organization = organizationResponse?.data;
    const firstName = user?.firstName || "User";
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
        <div className="flex min-h-screen bg-gray-50">
            {/* <DashboardSidebar /> */}

            <div className="flex min-w-0 flex-1 flex-col">
                {/* <DashboardHeader user={user} /> */}

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-7xl space-y-6">

                        <WelcomeSection
                            firstName={user?.firstName ?? ""}
                        />

                        <ProductOwnerProjects />
                        
                         {organization && (
                            <OrganizationOverview
                            organization= {organization}
                            />
                         )}

                        <QuickActions />

                        <StatsGrid />

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="space-y-6 xl:col-span-2">
                                <ActiveProjects />
                                <DepartmentTeams />
                            </div>

                            <div className="space-y-6">
                                <OrganizationHealth />
                                <RecentActivity />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;