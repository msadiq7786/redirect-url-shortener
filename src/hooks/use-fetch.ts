import { useState } from "react";

function useFetch<
  TData,
  TOptions = Record<string, never>,
  TArgs extends unknown[] = [],
>(
  cb: (options: TOptions, ...args: TArgs) => Promise<TData>,
  options: TOptions = {} as TOptions,
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs): Promise<TData | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(options, ...args);
      setData(response);
      return response;
    } catch (err) {
      setData(null);

      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Something went wrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fn,
  };
}

export default useFetch;
