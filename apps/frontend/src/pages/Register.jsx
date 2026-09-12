// src/pages/Register.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
const UserIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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
const PhoneIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);
const ArrowRightIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
const CheckCircleIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const SpinnerIcon = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
const ShieldIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);
const TruckIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625A1.125 1.125 0 0 0 8.625 4.5H3.375A1.125 1.125 0 0 0 2.25 5.625v8.25" />
  </svg>
);
const HeartIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

/* ───────────── floating label input ───────────── */
const FloatingInput = ({ icon: Ico, label, type = "text", name, value, onChange, required, children, autoComplete }) => {
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
        autoComplete={autoComplete || "off"}
        className={`
                    peer w-full pl-11 pr-4 pt-5 pb-2 text-sm border rounded-xl bg-white
                    transition-all duration-200 outline-none
                    ${focused ? "border-primary ring-2 ring-primary/10" : "border-gray-200 hover:border-gray-300"}
                `}
        placeholder=" "
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

/* ───────────── password strength ───────────── */
const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;

    if (s <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (s <= 2) return { score: 2, label: "Fair", color: "bg-orange-400" };
    if (s <= 3) return { score: 3, label: "Good", color: "bg-yellow-400" };
    if (s <= 4) return { score: 4, label: "Strong", color: "bg-green-400" };
    return { score: 5, label: "Very strong", color: "bg-emerald-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="flex items-center gap-2 mt-2 px-1">
      <div className="flex-1 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-[10px] font-semibold text-gray-400">{strength.label}</span>
    </div>
  );
};

/* ───────────── main register ───────────── */
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    countryCode: "+2",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const fullPhone = formData.countryCode + formData.phone;
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username: formData.username,
          phone: fullPhone,
          email: formData.email,
          password: formData.password,
        }
      );
      setSuccessMessage(res.data.message);
      setFormData({ username: "", phone: "", countryCode: "+2", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ───── Left: Brand panel (hidden on mobile) ───── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-primary items-center justify-center p-12">
        {/* Decorative */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 right-16 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-sm text-center">
          <Link to="/">
            <img src="/logo.png" alt="Notervo" className="h-8 w-auto mx-auto mb-10 opacity-80" />
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            Join Notervo
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-10">
            Create your account and discover notebooks crafted for focused work, clear thinking, and premium everyday writing.
          </p>

          {/* Benefits */}
          <div className="space-y-3 text-left">
            {[
              { icon: ShieldIcon, text: "Secure checkout & data protection" },
              { icon: TruckIcon, text: "Free shipping on all orders" },
              { icon: HeartIcon, text: "Save favorites & track orders" },
            ].map(({ icon: Ic, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Ic className="w-4 h-4 text-gray-300" />
                </span>
                <span className="text-sm text-gray-200">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Right: Register form ───── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50/50">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <img src="/logo-dark.png" alt="Notervo" className="h-7 w-auto mx-auto" />
            </Link>
          </div>

          {/* ───── Success state ───── */}
          {successMessage ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-sm text-gray-500 mb-2">{successMessage}</p>
              <p className="text-sm text-gray-400 mb-8">
                Please check your email inbox (and spam folder) for the verification link.
              </p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="group w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20"
                >
                  Go to Login
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Create account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your details to get started.
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

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Username */}
                <FloatingInput
                  icon={UserIcon}
                  label="Full name"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />

                {/* Phone */}
                <div>
                  <div className="flex gap-2">
                    <div className="relative w-[100px] flex-shrink-0">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-10">
                        <PhoneIcon className="w-[18px] h-[18px]" />
                      </div>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-full pl-11 pr-2 py-4 text-sm border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="+2">+2</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                      </select>
                    </div>
                    <FloatingInput
                      icon={PhoneIcon}
                      label="01xxxxxxxxx"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <FloatingInput
                    icon={MailIcon}
                    label="Email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 pl-1">
                    A verification link will be sent to this email.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <FloatingInput
                    icon={LockIcon}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
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
                  <PasswordStrength password={formData.password} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none !mt-5"
                >
                  {submitting ? (
                    <SpinnerIcon className="w-5 h-5" />
                  ) : (
                    <>
                      Create account
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;