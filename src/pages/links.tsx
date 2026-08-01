import { useEffect, useState } from "react";
import { Plus, Search, Link2 } from "lucide-react";

import UrlCard from "../components/url-card";
import LoadingSpinner from "../components/loading-spinner";
import CreateLink from "../components/create-link";

import { useUserContext } from "../context/user-context";
import useFetch from "../hooks/use-fetch";

import { getUrls } from "../db/url";
import { useSearchParams } from "react-router-dom";

function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const createNewLink = searchParams.get("createNew");
  const [open, setOpen] = useState(() => !!createNewLink);
  const { user } = useUserContext();

  const {
    data: urls,
    loading,
    fn: fetchUrls,
    error,
  } = useFetch(getUrls, user?.id ?? "");


  useEffect(() => {
    fetchUrls();
  }, []);

  const filteredUrls =
    urls?.filter(
      (url) =>
        url.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.short_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.original_url.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Link2 className="text-primary" size={28} />
            All Links
          </h1>
          <p className="text-sm text-zinc-400">
            {urls?.length ?? 0} shortened URL{urls?.length !== 1 ? "s" : ""}
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

        {open && (
          <CreateLink
            open={open}
            setOpen={(val) => {
              setOpen(val);
            }}
          />
        )}
      </section>

      {/* Search */}
      <section>
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search by title, short URL or original URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 transition focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 py-16 text-center text-red-400">
          <p className="font-medium">Failed to load links.</p>
          <button
            onClick={() => fetchUrls()}
            className="mt-4 text-sm underline hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredUrls.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <div className="flex justify-center mb-4">
            <Link2 size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            {searchQuery ? "No matching links" : "No links yet"}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {searchQuery
              ? "Try a different search term."
              : "Create your first short link to get started."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-black hover:bg-primary-active transition"
            >
              <Plus size={16} />
              Create Link
            </button>
          )}
        </div>
      )}

      {/* Links grid */}
      {!loading && filteredUrls.length > 0 && (
        <section className="space-y-4">
          {/* Result count when searching */}
          {searchQuery && (
            <p className="text-sm text-zinc-500">
              {filteredUrls.length} result{filteredUrls.length !== 1 ? "s" : ""}{" "}
              for "{searchQuery}"
            </p>
          )}

          {filteredUrls.map((url) => (
            <UrlCard key={url.id} url={url} fetchUrls={fetchUrls} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Links;
