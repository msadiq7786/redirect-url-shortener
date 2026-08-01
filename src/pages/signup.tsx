import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUserContext } from "../context/user-context";
import { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import { signup } from "../db/auth";
import { signUpSchema } from "../schema/signin";
import * as Yup from "yup";
import Error from "../components/error";
import toast from "react-hot-toast";
import LoadingDot from "../components/loading-dot";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  profileImage: string;
};

type FormErrors = Partial<Record<keyof SignUpForm, string>>;

function SignUp() {
  console.log("Signup Page render");
  // Aleady Authenticated
  const { isAuthenticated, loading: authLoading } = useUserContext();
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading]);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    profileImage: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [searchParams] = useSearchParams();
  const { data, error, loading, fn: signupFn } = useFetch(signup, formData);
  const longLink = searchParams.get("createNew");
  const { fetchUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error.message ?? "Unable to signup");
    }
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      await signUpSchema.validate(formData, { abortEarly: false });
      await signupFn();
    } catch (errUnknown) {
      const newErrors: FormErrors = {};

      if (errUnknown instanceof Yup.ValidationError) {
        errUnknown.inner.forEach((err) => {
          if (err.path && err.path in formData) {
            newErrors[err.path as keyof SignUpForm] = err.message;
          }
        });
      }

      setErrors(newErrors);
    }
  };
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium text-white">Create Account</h1>
      <p className="text-white/60 tracking-wide mt-2">
        {longLink
          ? `Hold on! Create account to shorten your link.`
          : `Create your account to get started.`}
      </p>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-4 max-w-md w-full mt-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            name="name"
            value={formData.name}
            disabled={loading}
            onChange={handleInputChange}
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            disabled={loading}
            onChange={handleInputChange}
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div>
          <label
            htmlFor="password"
            className="w-full block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            disabled={loading}
            onChange={handleInputChange}
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div>
          <label
            htmlFor="profileImage"
            className="w-full block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            name="profileImage"
            disabled={loading}
            onChange={handleInputChange}
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.profileImage && <Error message={errors.profileImage} />}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="flex items-center  justify-center gap-2 bg-primary hover:bg-primary-active transition-colors px-4 h-12 rounded text-black cursor-pointer font-medium disabled:bg-primary-disabled"
        >
          {loading ? <LoadingDot /> : "Signup"}
        </button>
        <p className="text-white/60 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
