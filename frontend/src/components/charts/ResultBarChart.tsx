import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ResultBarChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ left: 8, right: 16 }}>
          <XAxis
            type="number"
            stroke="#52525b"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              background: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 12,
            }}
          />
          <Bar dataKey="count" fill="#ffffff" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
