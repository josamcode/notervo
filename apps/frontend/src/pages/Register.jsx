// src/pages/Register.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthShell, {
  AuthError,
  AuthHeading,
  OrDivider,
  PasswordField,
} from "./AuthShell";
import Pill from "../components/ui/Pill";
import { ArrowRight, Check, Heart, Spinner } from "../components/ui/Icons";

const ShieldIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

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

    if (s <= 1) return { score: 1, label: "Weak", color: "bg-ember" };
    if (s <= 2) return { score: 2, label: "Fair", color: "bg-ember/70" };
    if (s <= 3) return { score: 3, label: "Good", color: "bg-ink/60" };
    if (s <= 4) return { score: 4, label: "Strong", color: "bg-ink/85" };
    return { score: 5, label: "Very strong", color: "bg-ink" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2.5 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : "bg-ink/10"}`}
          />
        ))}
      </div>
      <span className="text-[12px] text-muted">{strength.label}</span>
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
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          username: formData.username,
          phone: fullPhone,
          email: formData.email,
          password: formData.password,
        }
      );
      setSuccessMessage(res.data.message);
      setFormData({
        username: "",
        phone: "",
        countryCode: "+2",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      imageIndex={1}
      panelTitle="Join Notervo"
      panelText="Create your account and discover notebooks crafted for focused work, clear thinking, and premium everyday writing."
      panelFooter={
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-cream/25 pt-6 text-[13px] uppercase tracking-[0.02em] text-cream/90">
          <li className="flex items-center gap-2">
            <ShieldIcon className="h-[18px] w-[18px]" />
            Secure checkout & data protection
          </li>
          <li className="flex items-center gap-2">
            <Heart className="h-[18px] w-[18px]" />
            Save favorites & track orders
          </li>
        </ul>
      }
    >
      {/* ───── Success state ───── */}
      {successMessage ? (
        <div className="py-6 text-center md:text-left">
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-cream md:mx-0">
            <Check className="h-7 w-7" strokeWidth={2} />
          </span>
          <h1 className="font-serif text-[32px] font-light leading-[1.02] tracking-tight md:text-display">
            Account created
          </h1>
          <p className="mt-4 text-[15px] leading-snug text-ink">
            {successMessage}
          </p>
          <p className="mt-2 text-[14px] leading-snug text-muted">
            Please check your email inbox (and spam folder) for the verification
            link.
          </p>
          <Pill
            to="/login"
            variant="solid"
            size="lg"
            arrow
            className="mt-8 w-full md:w-auto"
          >
            Go to login
          </Pill>
        </div>
      ) : (
        <>
          <AuthHeading
            title="Create account"
            description="Fill in your details to get started."
          />

          {error && <AuthError>{error}</AuthError>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="register-name" className="field-label">
                Full name
              </label>
              <input
                id="register-name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="name"
                className="field"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="register-phone" className="field-label">
                Phone number
              </label>
              <div className="flex gap-2">
                <label htmlFor="register-country" className="sr-only">
                  Country code
                </label>
                <select
                  id="register-country"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="field w-[96px] shrink-0 cursor-pointer appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-8"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23262624' stroke-width='2'%3E%3Cpath d='m5 9 7 7 7-7'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="+2">+2</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                </select>
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="01xxxxxxxxx"
                  className="field min-w-0 flex-1"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="field-label">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                inputMode="email"
                aria-describedby="register-email-hint"
                className="field"
              />
              <p
                id="register-email-hint"
                className="mt-2 text-[12px] text-muted"
              >
                A verification link will be sent to this email.
              </p>
            </div>

            {/* Password */}
            <div>
              <PasswordField
                id="register-password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                autoComplete="new-password"
                required
              />
              <PasswordStrength password={formData.password} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-solid btn-lg !mt-8 w-full"
            >
              {submitting ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="btn-icon h-[18px] w-[18px]" />
                </>
              )}
            </button>
          </form>

          <OrDivider />

          <p className="text-center text-[14px] text-muted">
            Already have an account?{" "}
            <Link to="/login" className="link-underline text-ink">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
};

export default Register;
