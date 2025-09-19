// components/DashboardCard.jsx
export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl flex flex-col items-center">
      <span className="text-gray-600">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
