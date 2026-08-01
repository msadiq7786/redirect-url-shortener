import LoadingDot from "./loading-dot";

function LoadingSpinner({ fullPage = false }: { fullPage?: boolean }) {
  const dots = (
    <div className="flex items-center justify-center gap-2">
      <LoadingDot />
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {dots}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{dots}</div>;
}

export default LoadingSpinner;
