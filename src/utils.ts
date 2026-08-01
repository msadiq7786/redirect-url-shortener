import toast from "react-hot-toast";

type downloadParams = {
  qr: string;
  title: string;
};

export const downloadQR = async ({ qr, title }: downloadParams) => {
  try {
    const response = await fetch(qr);
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${title}.png`;
    a.click();
    URL.revokeObjectURL(href);
    toast.success("QR Code downloaded!");
  } catch {
    toast.error("Failed to download QR Code.");
  }
};

export const copy = (shortUrl: string) => {
  const completeUrl = `${import.meta.env.VITE_BASE_URL}/${shortUrl}`;
  navigator.clipboard.writeText(completeUrl);
  toast.success("Link copied to clipboard!");
};
