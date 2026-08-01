import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { deleteUrl, getUrl } from "../db/url";
import { useUserContext } from "../context/user-context";
import { getClicksUrl } from "../db/click";
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  BarChart2,
  Globe,
  Smartphone,
  Download,
} from "lucide-react";
import CreateLink from "../components/create-link";
import Card from "../components/card";
import LoadingSpinner from "../components/loading-spinner";
import QRCode from "react-qrcode-logo";
import toast from "react-hot-toast";
import type { ClickType } from "../types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import ConfirmDialog from "../components/confirm-dialog";
import { copy, downloadQR } from "../utils";

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

const PIE_COLORS = ["#faff69", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
const BAR_COLOR = "#faff69";

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-primary">{icon}</span>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
  );
}

function ChartCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-card p-5">
      <SectionTitle icon={icon} title={title} />
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
      No data yet
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function LinkPage() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    data: url,
    error,
    fn: getUrlFn,
  } = useFetch(getUrl, { id: id ?? "", userId: user?.id ?? "" });

  const {
    loading: loadingStats,
    data: clicks,
    fn: getClicksFn,
  } = useFetch(getClicksUrl, id ?? "");

  const { loading: deleting, fn: deleteFn } = useFetch(deleteUrl, id ?? "");

  useEffect(() => {
    getUrlFn();
    getClicksFn();
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/dashboard");
    }
  }, [error]);

  const handleDelete = async () => {
    try {
      await deleteFn();
      toast.success("Link deleted!");
      navigate("/links");
    } catch {
      toast.error("Failed to delete link.");
    }
  };

  if (loading || loadingStats) {
    return <LoadingSpinner fullPage />;
  }

  // ─── Analytics data ─────────────────────────────────────────────────────────
  const safeClicks: ClickType[] = (clicks ?? []) as ClickType[];
  const deviceData = groupBy(safeClicks, "device");
  const countryData = groupBy(safeClicks, "country").slice(0, 10);
  const cityData = groupBy(safeClicks, "city").slice(0, 10);

  const shortUrl = `${import.meta.env.VITE_BASE_URL}/${url?.short_url}`;

  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this link?"
        description={`"${url?.title}" and all its analytics data will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <section className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Link Analytics
            </h1>
            <p className="text-zinc-500 text-sm">
              Real-time tracking for:{" "}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {shortUrl}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadQR({ qr: url?.qr, title: url?.title })}
              className="cursor-pointer flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5 transition"
            >
              <Download size={16} />
              Download
            </button>
            <button
              type="button"
              onClick={() => copy(url?.short_url)}
              className="cursor-pointer flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5 transition"
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="cursor-pointer flex items-center gap-1 rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:bg-primary-active cursor-pointer text-nowrap"
            >
              <Plus size={20} />
              Create Link
            </button>
            {open && <CreateLink open={open} setOpen={setOpen} />}
          </div>
        </section>

        {/* ── Stat Cards ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card score={safeClicks.length} text="Total Clicks" />
          <Card
            score={
              Array.from(
                new Set(safeClicks.map((c) => c.country).filter(Boolean)),
              ).length
            }
            text="Countries"
          />
          <Card
            score={
              Array.from(new Set(safeClicks.map((c) => c.city).filter(Boolean)))
                .length
            }
            text="Cities"
          />
          <Card
            score={
              Array.from(
                new Set(safeClicks.map((c) => c.device).filter(Boolean)),
              ).length
            }
            text="Devices"
          />
        </section>

        {/* ── QR + Info ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-surface-card p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white">{url?.title}</h2>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ExternalLink size={14} />
              <a
                href={url?.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary transition"
              >
                {url?.original_url}
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary">
              <ExternalLink size={14} />
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {shortUrl}
              </a>
            </div>

            {url?.custom_url && (
              <div className="text-xs text-zinc-500">
                Custom alias:{" "}
                <span className="text-zinc-300">{url.custom_url}</span>
              </div>
            )}

            <div className="text-xs text-zinc-500">
              Created{" "}
              {url?.created_at &&
                new Date(url.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-surface-card p-6">
            {url?.qr ? (
              <div className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  QR Code
                </p>
                <QRCode value={url.qr} size={160} />
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">No QR available</p>
            )}
          </div>
        </section>

        {/* ── Analytics Charts ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-primary" size={22} />
            <h2 className="text-xl font-semibold text-white">Analytics</h2>
            <span className="ml-auto text-sm text-zinc-500">
              {safeClicks.length} total click
              {safeClicks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {safeClicks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <BarChart2 size={40} className="mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-white">
                No analytics yet
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Share your link and data will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device Pie */}
              <ChartCard
                title="Clicks by Device"
                icon={<Smartphone size={16} />}
              >
                {deviceData.length ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {deviceData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </ChartCard>

              {/* Country Bar */}
              <ChartCard title="Clicks by Country" icon={<Globe size={16} />}>
                {countryData.length ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={countryData}
                      layout="vertical"
                      margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill={BAR_COLOR}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </ChartCard>

              {/* City Bar */}
              <ChartCard title="Clicks by City" icon={<Globe size={16} />}>
                {cityData.length ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={cityData}
                      layout="vertical"
                      margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill={BAR_COLOR}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </ChartCard>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default LinkPage;
