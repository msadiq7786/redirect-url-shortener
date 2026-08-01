import { useState } from "react";
import { Copy, Download, ExternalLink, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import type { UrlType } from "../types";
import ConfirmDialog from "./confirm-dialog";
import useFetch from "../hooks/use-fetch";
import { deleteUrl } from "../db/url";
import { copy, downloadQR } from "../utils";

interface Props {
  url: UrlType;
  fetchUrls: () => Promise<unknown> | void;
}

function UrlCard({ url, fetchUrls }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { loading: deleting, fn: deleteFn } = useFetch(deleteUrl, url.id);
  const handleDelete = async () => {
    try {
      await deleteFn();
      await fetchUrls();
      toast.success("Link deleted successfully!");
    } catch {
      toast.error("Failed to delete link.");
    } finally {
      setConfirmOpen(false);
    }
  };

  const createdAt = new Date(url.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this link?"
        description={`"${url.title}" and all its analytics data will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      <div className="rounded-2xl border border-white/10 bg-surface-card p-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.03]">
        <div className="flex items-center gap-5">
          <Link to={`/link/${url.id}`} className="shrink-0">
            <img
              src={url.qr}
              alt="QR"
              className="h-20 w-20 rounded-xl border border-white/10 bg-white p-2 hover:scale-105 transition-transform"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  to={`/link/${url.id}`}
                  className="truncate text-base font-semibold hover:text-primary transition-colors"
                >
                  {url.title}
                </Link>

                <a
                  href={`${import.meta.env.VITE_BASE_URL}/${url.short_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {import.meta.env.VITE_BASE_URL}/{url.short_url}
                  <ExternalLink size={14} />
                </a>

                <p className="mt-1 truncate text-sm text-zinc-500">
                  {url.original_url}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                  <span>Created {createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  title="Copy link"
                  className="cursor-pointer rounded-lg p-2 hover:bg-white/10 transition-colors"
                  onClick={() => copy(url.short_url)}
                >
                  <Copy size={18} />
                </button>

                <button
                  title="Download QR"
                  className="cursor-pointer rounded-lg p-2 hover:bg-white/10 transition-colors"
                  onClick={() => downloadQR({ qr: url.qr, title: url.title })}
                >
                  <Download size={18} />
                </button>

                <button
                  title="Delete link"
                  className="cursor-pointer rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UrlCard;
