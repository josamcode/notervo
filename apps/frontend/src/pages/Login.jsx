// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AuthShell, {
  AuthError,
  AuthHeading,
  OrDivider,
  PasswordField,
} from "./AuthShell";
import Pill from "../components/ui/Pill";
import { ArrowRight, Spinner } from "../components/ui/Icons";

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
        `${import.meta.env.VITE_API_URL}/auth/login`,
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
    <AuthShell
      imageIndex={0}
      panelTitle="Welcome back"
      panelText="Log into your account and pick up right where you left off. Your notebooks are waiting."
    >
      <AuthHeading
        title="Sign in"
        description="Enter your credentials to access your account."
      />

      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-identifier" className="field-label">
            Email address
          </label>
          <input
            id="login-identifier"
            type="email"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            autoComplete="email"
            inputMode="email"
            className="field"
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-solid btn-lg !mt-8 w-full"
        >
          {submitting ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="btn-icon h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </form>

      <OrDivider />

      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-[14px] text-muted">Don't have an account?</p>
        <Pill
          to="/register"
          variant="outline"
          size="md"
          className="w-full md:w-auto"
        >
          Create account
        </Pill>
      </div>
    </AuthShell>
  );
};

export default Login;
