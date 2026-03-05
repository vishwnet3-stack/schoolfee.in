"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Validation Functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const validateFullName = (fullName: string): boolean => {
  return fullName.trim().length >= 2;
};

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors = { fullName: "", email: "", password: "" };
    let isValid = true;

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
        isValid = false;
      } else if (!validateFullName(formData.fullName)) {
        newErrors.fullName = "Full name must be at least 2 characters";
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before continuing", {
        description: "Check the highlighted fields below.",
      });
      return;
    }

    setIsLoading(true);

    // Show a loading toast immediately for feedback
    const loadingToastId = isLogin
      ? toast.loading("Signing you in...", { description: "Please wait a moment." })
      : toast.loading("Creating your account...", { description: "Setting things up for you." });

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────────
        const response = await fetch("/api/public/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        toast.dismiss(loadingToastId);

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Invalid credentials", {
              description: "The email or password you entered is incorrect. Please try again.",
            });
          } else if (response.status === 404) {
            toast.error("Account not found", {
              description: "No account exists with this email. Please register first.",
            });
          } else if (response.status === 403) {
            toast.error("Account not verified", {
              description: "Please verify your email before signing in.",
            });
          } else {
            toast.error(data.error || "Login failed", {
              description: "Something went wrong. Please try again.",
            });
          }
          return;
        }

        // Notify all components (Header, UserProfileDropdown) of auth change
        window.dispatchEvent(new Event("auth-change"));

        toast.success("Welcome back!", {
          description: `Signed in as ${formData.email}`,
          duration: 4000,
        });

        router.push("/profile");
      } else {
        // ── REGISTER ───────────────────────────────────────────
        const response = await fetch("/api/public/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        toast.dismiss(loadingToastId);

        if (!response.ok) {
          if (response.status === 409) {
            toast.error("Email already registered", {
              description: "An account with this email already exists. Try signing in instead.",
            });
          } else {
            toast.error(data.error || "Registration failed", {
              description: "Something went wrong. Please try again.",
            });
          }
          return;
        }

        toast.success("Account created successfully! 🎉", {
          description:
            "",
          duration: 6000,
        });

        // Reset form and switch to login
        setFormData({ fullName: "", email: "", password: "" });
        setErrors({ fullName: "", email: "", password: "" });
        setIsLogin(true);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Auth error:", error);
      toast.error("Connection error", {
        description:
          "Unable to reach the server. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "" });
    setErrors({ fullName: "", email: "", password: "" });
  };

  return (
    <div className=" flex items-end justify-center lg:py-6 p-2 sm:p-3 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">

      <Card className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-2xl py-0 lg:px-2 lg:pt-4 overflow-hidden relative z-10 border-1 border-gray overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left Side - Illustration */}
          <div className="hidden md:flex bg-gradient-to-br from-slate-50 to-blue-50 items-center justify-center p-2 lg:p-0 relative overflow-hidden" style={{ marginBottom: "-25px !important" }}>
            <img
              src="/landing-page/education-continuity.jpg"
              alt="Education"
              className="rounded-xl object-contain" style={{ marginBottom: "-25px !important" }}
            />
          </div>

          {/* Right Side - Form */}
          <div className="flex flex-col p-4 sm:p-5 md:p-7">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <img
                src="https://schoolfee.in/logo/schoolfee%20logo.webp"
                alt="Schoolfee Logo"
                className="h-10 object-contain"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={switchMode}
                  disabled={isLoading}
                  className="text-xs sm:text-sm font-semibold text-[#00468E] border border-[#00468E]/30 hover:border-[#00468E] hover:bg-[#00468E]/5 px-2.5 sm:px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {isLogin ? "SIGN UP" : "SIGN IN"}
                </button>
              </div>
            </div>

            {/* Welcome text */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isLogin
                  ? "Sign in to access your SchoolFee account"
                  : "Join us and support education across India"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col" noValidate>
              <div className="space-y-3 mb-4">

                {/* Full Name — Register only */}
                {!isLogin && (
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      className={
                        errors.fullName
                          ? "border-red-500 focus-visible:ring-red-300"
                          : ""
                      }
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className={
                      errors.email ? "border-red-500 focus-visible:ring-red-300" : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="8+ characters"
                      disabled={isLoading}
                      className={`pr-10 ${
                        errors.password ? "border-red-500 focus-visible:ring-red-300" : ""
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password — Login only */}
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-xs sm:text-sm text-[#00468E] hover:text-[#F4951D] font-medium transition"
                      onClick={() =>
                        toast.info("Password reset", {
                          description:
                            "Please contact our support team to reset your password.",
                        })
                      }
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00468E] to-[#0056b3] hover:from-[#003870] hover:to-[#00468E] text-white font-semibold py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 mb-4 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>

              <div className="mt-auto">
                <p className="text-xs text-center text-slate-500">
                  Initiative of Community Health Mission
                </p>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}