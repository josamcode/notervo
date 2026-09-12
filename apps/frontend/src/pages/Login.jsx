// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

/* ───────────── icons ───────────── */
const EyeIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
const EyeSlashIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);
const MailIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const ArrowRightIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
const SpinnerIcon = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ───────────── floating label input ───────────── */
const FloatingInput = ({ icon: Ico, label, type = "text", name, value, onChange, required, children }) => {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-10">
        <Ico className="w-[18px] h-[18px]" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`
                    peer w-full pl-11 pr-4 pt-5 pb-2 text-sm border rounded-xl bg-white
                    transition-all duration-200 outline-none
                    ${focused ? "border-primary ring-2 ring-primary/10" : "border-gray-200 hover:border-gray-300"}
                `}
        placeholder=" "
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
      />
      <label className={`
                absolute left-11 transition-all duration-200 pointer-events-none
                ${(focused || filled) ? "top-1.5 text-[10px] font-semibold text-primary" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}
            `}>
        {label}
      </label>
      {children}
    </div>
  );
};

/* ───────────── main login ───────────── */
const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { identifier: formData.identifier, password: formData.password }
      );
      Cookies.set("token", res.data.token, { expires: 7 });
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ───── Left: Brand panel (hidden on mobile) ───── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-primary items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 right-12 w-20 h-20 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-sm text-center">
          <Link to="/">
            <img src="/logo.png" alt="Notervo" className="h-8 w-auto mx-auto mb-10 opacity-80" />
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            Welcome back
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            Log into your account and pick up right where you left off. Your notebooks are waiting.
          </p>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "500+", label: "Customers" },
              { val: "50+", label: "Designs" },
              { val: "99%", label: "Happy" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-3">
                <p className="text-white text-lg font-bold">{s.val}</p>
                <p className="text-gray-400 text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Right: Login form ───── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50/50">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <img src="/logo-dark.png" alt="Notervo" className="h-7 w-auto mx-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput
              icon={MailIcon}
              label="Email address"
              type="email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
            />

            <FloatingInput
              icon={LockIcon}
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <EyeIcon className="w-4 h-4" />
                  : <EyeSlashIcon className="w-4 h-4" />
                }
              </button>
            </FloatingInput>

            <button
              type="submit"
              disabled={submitting}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <SpinnerIcon className="w-5 h-5" />
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;