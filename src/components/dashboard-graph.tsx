import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import type { ClickType } from "../types";
import LoadingDot from "./loading-dot";

const PIE_COLORS = [
  "#faff69",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

function groupBy(arr: ClickType[], key: keyof ClickType) {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    const val = (item[key] as string) || "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildDailySeries(clicks: ClickType[], days = 14) {
  const today = new Date();
  const series: { date: string; clicks: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    series.push({ date: label, clicks: 0, _key: key } as (typeof series)[0] & {
      _key: string;
    });
  }

  for (const click of clicks) {
    const day = click.created_at?.slice(0, 10);
    const slot = (series as ((typeof series)[0] & { _key: string })[]).find(
      (s) => s._key === day,
    );
    if (slot) slot.clicks += 1;
  }

  return series.map(({ date, clicks }) => ({ date, clicks }));
}

const tooltipStyle = {
  contentStyle: {
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#fff",
  },
  cursor: { stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
      {children}
    </p>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 items-center justify-center text-zinc-600 text-sm">
      No data yet
    </div>
  );
}

interface Props {
  clicks: ClickType[];
  loading?: boolean;
}

function DashboardGraph({ clicks, loading }: Props) {
  const dailyData = buildDailySeries(clicks, 14);
  const deviceData = groupBy(clicks, "device");
  const countryData = groupBy(clicks, "country").slice(0, 6);

  const totalThisWeek = clicks.filter((c) => {
    const d = new Date(c.created_at);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Clicks over time</SectionLabel>
            <p className="text-2xl font-bold text-white">{clicks.length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Total clicks ·{" "}
              <span className="text-primary">{totalThisWeek} this week</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
            Last 14 days
          </span>
        </div>

        {loading ? (
          <div className="h-52 flex items-center justify-center">
            <div className="flex gap-1.5">
              <LoadingDot />
            </div>
          </div>
        ) : clicks.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={dailyData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#faff69" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#faff69" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#52525b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#faff69"
                strokeWidth={2}
                fill="url(#clickGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#faff69", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-surface-card p-5">
          <SectionLabel>Clicks by device</SectionLabel>
          {deviceData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deviceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
                />
                <Tooltip {...tooltipStyle} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-card p-5">
          <SectionLabel>Top countries</SectionLabel>
          {countryData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={countryData}
                layout="vertical"
                margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: "#52525b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={82}
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="value"
                  fill="#faff69"
                  radius={[0, 5, 5, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardGraph;
