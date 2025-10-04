import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Location({ stats = [] }) {
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return <p className="text-gray-500">No location data available</p>;
  }

  // Count clicks by city
  const cityCount = stats.reduce((acc, item) => {
    const city = item.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count
  const cities = Object.entries(cityCount)
    .map(([city, count]) => ({
      city,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 cities

  if (cities.length === 0) {
    return <p className="text-gray-500">No location data available</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={cities}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#82ca9d" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}