import { Link, useNavigate } from "react-router-dom";
import Error from "../components/error";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { loginSchema } from "../schema/login";
import useFetch from "../hooks/use-fetch";
import { login } from "../db/auth";
import { useUserContext } from "../context/user-context";
import LoadingDot from "../components/loading-dot";
import toast from "react-hot-toast";

type LoginForm = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginForm, string>>;

function Login() {
  // Aleady Authenticated
  const { isAuthenticated, loading: authLoading } = useUserContext();
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading]);

  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const { data, error, loading, fn: loginFn } = useFetch(login, formData);
  const { fetchUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error.message ?? "Unable to login");
    }
    if (error === null && data) {
      navigate("/dashboard");
      fetchUser();
    }
  }, [data, error]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      await loginFn();
    } catch (errUnknown) {
      const newErrors: FormErrors = {};

      if (errUnknown instanceof Yup.ValidationError) {
        errUnknown.inner.forEach((err) => {
          if (err.path && err.path in formData) {
            newErrors[err.path as keyof LoginForm] = err.message;
          }
        });
      }

      setErrors(newErrors);
    }
  };
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium text-white">
        Login into Your Account
      </h1>
      <p className="text-white/60 tracking-wide mt-2 tex-sm">
        Enter your credentials to access your account.
      </p>
      <form
        className="flex flex-col gap-6 mt-4 max-w-md w-full"
        onSubmit={handleLogin}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Email"
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-white/60 mb-2 text-xs uppercase font-medium tracking-wide"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Password"
            className="w-full bg-gray-800/20 backdrop-blur border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="flex items-center  justify-center gap-2 bg-primary hover:bg-primary-active transition-colors px-4 h-12 rounded text-black cursor-pointer font-medium disabled:bg-primary-disabled"
        >
          {loading ? <LoadingDot /> : "Login"}
        </button>
        <p className="text-white/60 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
