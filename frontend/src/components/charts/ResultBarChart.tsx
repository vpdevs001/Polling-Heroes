import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ResultBarChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ left: 8, right: 16 }}>
          <XAxis type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
