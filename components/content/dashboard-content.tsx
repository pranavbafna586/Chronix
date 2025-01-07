export function DashboardContent() {
  const stats = [
    {
      title: "Total Users",
      value: "1,254",
      icon: "👥",
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Sessions",
      value: "342",
      icon: "📊",
      bgColor: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: "💰",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Tasks Completed",
      value: "97%",
      icon: "✅",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-md flex items-center ${stat.bgColor} text-white`}
        >
          <div className="text-4xl mr-4">{stat.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
