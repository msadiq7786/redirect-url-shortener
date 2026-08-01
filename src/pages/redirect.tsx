import { useEffect } from "react";
import { getRedirectUrl } from "../db/url";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { storeClicks } from "../db/click";
import LoadingSpinner from "../components/loading-spinner";

function Redirect() {
  const { id } = useParams();
  const { loading, data, fn: redirectFn } = useFetch(getRedirectUrl, id);
  const { loading: loadingStats, fn: statsFn } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    redirectFn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      statsFn();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <div className="text-center space-y-1">
            <p className="text-base font-medium text-white">Redirecting you…</p>
            <p className="text-xs text-zinc-500">
              Please wait while we take you to your destination.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Redirect;
