"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserRegister() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.error("Already logged in", {
        theme: "dark",
        position: "bottom-right",
        toastId: "auth",
      });
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const isVitEmail = (email) =>
    email.toLowerCase().endsWith("@vitbhopal.ac.in");

  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

  const validateStep1 = () => {
    if (!form.name || form.name.length < 2) return "Please enter a valid name";

    if (!form.email) return "Email is required";
    if (!isVitEmail(form.email)) return "Only @vitbhopal.ac.in emails allowed";

    if (!form.password) return "Password is required";
    if (!isStrongPassword(form.password))
      return "Password must be 8+ chars with upper, lower, number & symbol";

    if (form.password !== form.confirmPassword) return "Passwords do not match";

    return null;
  };

  /* ---------------- STEP 1: SEND OTP ---------------- */

  const handleNext = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: "", success: "" });

    const error = validateStep1();
    if (error) {
      setStatus({ loading: false, error, success: "" });
      return;
    }

    setStatus((p) => ({ ...p, loading: true }));

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: "" });
        return;
      }

      setStatus({
        loading: false,
        error: "",
        success: "OTP sent to your email",
      });

      setStep(2);
    } catch {
      setStatus({
        loading: false,
        error: "Failed to send OTP",
        success: "",
      });
    }
  };

  /* ------------------- VERIFY OTP ---------------- */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: "", success: "" });

    if (!/^\d{6}$/.test(otp)) {
      setStatus({
        loading: false,
        error: "Enter a valid 6-digit OTP",
        success: "",
      });
      return;
    }

    setStatus((p) => ({ ...p, loading: true }));

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message, success: "" });
        return;
      }

      login(data.token, data.user);

      toast.success("Registration complete!", {
        theme: "dark",
        position: "bottom-right",
        toastId: "auth",
      });

      router.push("/myTeam");
    } catch {
      setStatus({
        loading: false,
        error: "OTP verification failed",
        success: "",
      });
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="text-white flex justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>
          <p className="text-white/80 mt-2">
            Powered by Null Student Chapter VIT Bhopal
          </p>
        </div>

        <div className="bg-[#191919] border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <form
            onSubmit={step === 1 ? handleNext : handleVerifyOtp}
            className="space-y-5"
          >
            {step === 1 && (
              <>
                {/* Name */}
                <label className="block text-sm text-white mb-2">Name</label>
                <Input
                  icon={User}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />

                {/* Email */}
                <label className="block text-sm text-white mb-2">Email</label>
                <Input
                  icon={Mail}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="demo.23bce10203@vitbhopal.ac.in"
                />

                {/* Password */}
                <PasswordInput
                  label="Password"
                  value={form.password}
                  show={show.password}
                  toggle={() =>
                    setShow((p) => ({ ...p, password: !p.password }))
                  }
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                />

                {/* Confirm Password */}
                <PasswordInput
                  label="Confirm Password"
                  value={form.confirmPassword}
                  show={show.confirm}
                  toggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </>
            )}

            {/* -------- STEP 2 -------- */}
            {step === 2 && (
              <>
                <ReadOnly value={form.name} label="Name" />
                <ReadOnly value={form.email} label="Email" />
                <label className="block text-sm text-white mb-2">
                  Enter OTP
                </label>
                <input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="- - - - - -"
                  className="w-full text-center tracking-widest text-xl py-3 bg-white/10 border border-white/20 rounded-lg"
                />
              </>
            )}

            {status.error && <Message text={status.error} type="error" />}
            {status.success && <Message text={status.success} type="success" />}

            <button
              type="submit"
              disabled={status.loading}
              className=" w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/80 hover:bg-white disabled:bg-white/20 text-black disabled:text-white font-medium rounded-lg transition-all duration-200 focus:outline-none  disabled:cursor-not-allowed"
            >
              {status.loading
                ? "Processing..."
                : step === 1
                  ? "Next"
                  : "Verify OTP"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white h-5 w-5" />
      <input
        {...props}
        className="w-full pl-12 py-3 bg-white/10 border border-white/20 rounded-lg"
      />
    </div>
  );
}

function PasswordInput({ label, value, show, toggle, onChange }) {
  return (
    <div>
      <label className="text-sm text-white mb-2 block">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 h-5 w-5" />
        <input
          type={show ? "text" : "password"}
          placeholder="XXXX-XXXX-XXXX"
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <input
        value={value}
        disabled
        className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-gray-400"
      />
    </div>
  );
}

function Message({ text, type }) {
  const styles =
    type === "error"
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : "bg-green-500/10 border-green-500/20 text-green-400";

  return (
    <div className={`p-3 border rounded-lg text-sm ${styles}`}>{text}</div>
  );
}
