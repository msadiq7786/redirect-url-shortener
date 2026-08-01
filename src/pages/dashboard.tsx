import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import type { ClickType } from "../types";

import Card from "../components/card";
import DashboardGraph from "../components/dashboard-graph";
import UrlCard from "../components/url-card";
import LoadingSpinner from "../components/loading-spinner";
import CreateLink from "../components/create-link";

import { useUserContext } from "../context/user-context";
import useFetch from "../hooks/use-fetch";

import { getUrls } from "../db/url";
import { getUrlsClick } from "../db/click";
import { useDebounce } from "../hooks/use-debounce";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [search] = useSearchParams();
  const longLink = search.get("createNew");
  const [open, setOpen] = useState(() => !!longLink);
  const { user } = useUserContext();
  const debounceSearch = useDebounce({
    delay: 500,
    func: (value: string) => {
      setSearchQuery(value);
    },
  });

  const name = (user?.user_metadata?.name as string | undefined) ?? "there";
  const firstName = name.split(" ")[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const {
    data: urls,
    loading: urlLoading,
    fn: UrlsFn,
    error: urlError,
  } = useFetch(getUrls, user?.id ?? "");

  const {
    loading: clickLoading,
    data: clicks,
    fn: clicksFn,
  } = useFetch(getUrlsClick, urls?.map((url) => url.id) ?? []);

  useEffect(() => {
    UrlsFn();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      clicksFn();
    }
  }, [urls]);

  const filteredUrls =
    urls?.filter((url) =>
      url.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const displayedUrls = filteredUrls.slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-sm text-zinc-500 tracking-wide">{greeting} 👋</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Here's what's happening with your links today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:bg-primary-active cursor-pointer text-nowrap"
        >
          <Plus size={20} />
          Create Link
        </button>

        {open && <CreateLink open={open} setOpen={setOpen} />}
      </section>

      <section className="space-y-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card score={urls?.length ?? 0} text="Created Links" />
          <Card score={clicks?.length ?? 0} text="Total Clicks" />
          <Card
            score={
              Array.from(new Set(clicks?.map((c) => c.country).filter(Boolean)))
                .length
            }
            text="Countries"
          />
          <Card
            score={
              Array.from(new Set(clicks?.map((c) => c.device).filter(Boolean)))
                .length
            }
            text="Devices"
          />
        </div>

        <DashboardGraph
          clicks={(clicks ?? []) as ClickType[]}
          loading={clickLoading}
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Links</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Search, manage and monitor your latest shortened URLs.
            </p>
          </div>

          <Link
            to="/links"
            className="text-sm font-medium text-primary transition hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="flex items-center justify-end">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search links..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                debounceSearch(e.target.value);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 transition focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {(urlLoading || clickLoading) && <LoadingSpinner />}

        {urlError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 py-16 text-center text-red-400">
            Failed to load links.
          </div>
        )}

        {!urlLoading && !filteredUrls.length && !urlError && (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <h3 className="text-lg font-semibold text-white">No links found</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Create your first short link or try another search.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {displayedUrls.map((url) => (
            <UrlCard key={url.id} url={url} fetchUrls={UrlsFn} />
          ))}
        </div>

        {filteredUrls.length > 5 && (
          <div className="text-center pt-2">
            <Link
              to="/links"
              className="text-sm text-zinc-400 hover:text-primary transition-colors"
            >
              + {filteredUrls.length - 5} more links — View all →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
