import { BarChart2 } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <BarChart2 className="w-6 h-6 mr-2 text-orange-500" /> Analytics
      </h2>
      <div className="bg-white rounded-xl shadow h-64 flex items-center justify-center text-gray-400">
        {/* TODO: Replace with Chart.js / Recharts integration */}
        Analytics Charts Placeholder
      </div>
    </div>
  );
};

export default AnalyticsPage;
