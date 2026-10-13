interface OrganizationHealthProps {
  healthScore?: number;
  systemStatus?: string;
}

const OrganizationHealth = ({
  healthScore,
  systemStatus,
}: OrganizationHealthProps) => {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold text-gray-900">
        Organization Health
      </h2>

      <div className="mt-5">
        <p className="text-sm text-gray-500">
          Health Score
        </p>

        <p className="mt-1 text-3xl font-bold">
          {healthScore !== undefined
            ? `${healthScore}%`
            : "--"}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500">
          System Performance
        </p>

        <p className="mt-1 font-medium">
          {systemStatus ?? "--"}
        </p>
      </div>
    </section>
  );
};

export default OrganizationHealth;