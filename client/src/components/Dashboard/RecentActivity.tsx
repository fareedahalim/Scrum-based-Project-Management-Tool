interface RecentActivityProps {
  activities?: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
}

const RecentActivity = ({
  activities = [],
}: RecentActivityProps) => {
  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="font-semibold text-gray-900">
          Recent Activity
        </h2>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No recent activity.
        </div>
      ) : (
        <div className="divide-y">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4">
              <p className="text-sm text-gray-700">
                {activity.message}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {activity.createdAt}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentActivity;