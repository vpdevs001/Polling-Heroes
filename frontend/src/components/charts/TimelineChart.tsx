import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TimelineChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
    }),
  }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="label"
            stroke="#52525b"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
