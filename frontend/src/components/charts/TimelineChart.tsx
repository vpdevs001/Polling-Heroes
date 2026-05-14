import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TimelineChart({ data }: { data: { date: string; count: number }[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric" }),
  }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="label" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
          />
          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
