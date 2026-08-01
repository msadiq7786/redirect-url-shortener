import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../context/user-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { createUrl } from "../db/url";
import { urlSchema } from "../schema/url";
import QRCode from "react-qrcode-logo";
import * as Yup from "yup";
import Error from "./error";
import toast from "react-hot-toast";
import LoadingDot from "./loading-dot";

interface CreateLinkType {
  title: string;
  originalUrl: string;
  customUrl?: string;
  qr: File;
}
type FormErrors = Partial<Record<keyof CreateLinkType, string>>;

// Type for the QRCode ref that exposes canvasRef
interface QRCodeRef {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

function CreateLink({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [formData, setFormData] = useState({
    originalUrl: longLink || "",
    customUrl: "",
    title: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const qrRef = useRef<QRCodeRef>(null);

  const handleModelClose = () => {
    setOpen(false);
    setSearchParams((prev) => {
      prev.delete("createNew");
      return prev;
    });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    loading,
    error,
    data,
    fn: createFn,
  } = useFetch(createUrl, {
    ...formData,
    userId: user?.id ?? "",
  });

  useEffect(() => {
    if (error === null && data) {
      toast.success("Link created successfully!");
      navigate(`/link/${(data as { id: string }[])[0].id}`);
    }
  }, [error, data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message ?? "Failed to create link.");
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await urlSchema.validate(formData, { abortEarly: false });
      const canvas = qrRef.current?.canvasRef?.current;
      if (!canvas) {
        toast.error("QR Code is not ready yet. Please enter a URL first.");
        return;
      }
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );
      if (!blob) {
        toast.error("Failed to generate QR Code.");
        return;
      }
      await createFn(blob);
      searchParams.delete("createNew");
    } catch (errUnknown) {
      const newErrors: FormErrors = {};
      if (errUnknown instanceof Yup.ValidationError) {
        errUnknown.inner.forEach((err) => {
          if (err.path && err.path in formData) {
            newErrors[err.path as keyof CreateLinkType] = err.message;
          }
        });
      }
      setErrors(newErrors);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-screen"
      onClick={handleModelClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-white/10 bg-zinc-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Create Short Link
            </h1>
            <p className="text-white/60 mt-1">
              Paste your long URL and customize your short link.
            </p>
          </div>
          <button
            onClick={handleModelClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
          {formData.originalUrl && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <QRCode
                value={formData.originalUrl}
                size={200}
                ref={qrRef as any}
              />
            </div>
          )}

          <div>
            <label className="block text-white/60 mb-2 text-xs uppercase">
              Original URL
            </label>
            <input
              type="url"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleInputChange}
              placeholder="https://example.com"
              required
              className="w-full rounded border border-white/20 bg-gray-800/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.originalUrl && <Error message={errors.originalUrl} />}
          </div>

          <div>
            <label className="block text-white/60 mb-2 text-xs uppercase">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="My Portfolio"
              className="w-full rounded border border-white/20 bg-gray-800/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          <div>
            <label className="block text-white/60 mb-2 text-xs uppercase">
              Custom Alias
            </label>
            <input
              type="text"
              name="customUrl"
              value={formData.customUrl}
              onChange={handleInputChange}
              placeholder="my-awesome-link"
              className="w-full rounded border border-white/20 bg-gray-800/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.customUrl && <Error message={errors.customUrl} />}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleModelClose}
              className="rounded border border-white/20 px-4 py-2 text-white hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded bg-primary px-5 py-2 font-medium text-black hover:bg-primary-active disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <LoadingDot />
                  Creating...
                </>
              ) : (
                "Create Link"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLink;
