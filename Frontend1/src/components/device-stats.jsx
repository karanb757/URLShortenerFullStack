import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceStats({ stats }) {
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return <p className="text-gray-500">No device data available</p>;
  }

  // Count devices from stats array
  const deviceCount = stats.reduce((acc, item) => {
    const device = item.device || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for recharts
  const result = Object.keys(deviceCount).map((device) => ({
    name: device.charAt(0).toUpperCase() + device.slice(1),
    value: deviceCount[device],
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={result}
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="value"
            nameKey="name"
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}