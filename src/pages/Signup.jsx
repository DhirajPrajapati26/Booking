import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bus,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 py-10">

      <div className="w-full max-w-md">



        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg mb-7"
          >
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
              <Bus size={23} />
            </div>

            <span>
              Bus<span className="text-purple-600">Book</span>
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Create an account
          </h1>

          <p className="text-gray-500 mt-2">
            Start booking your bus journeys
          </p>

        </div>


        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">


          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">

            <ShieldCheck
              size={19}
              className="text-indigo-600 mt-0.5 shrink-0"
            />

            <p className="text-sm text-indigo-700">
              Create your account to securely manage
              your bookings and passenger details.
            </p>

          </div>



          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </div>
          )}



          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >



            <div>

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pl-11 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />

              </div>

            </div>



            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pl-11 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />

              </div>

            </div>


            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pl-11 pr-11 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-2.5 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Use at least 6 characters.
              </p>

            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  Create Account
                </>
              )}
            </button>

          </form>



          <div className="border-t border-gray-100 mt-7 pt-6">

            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}

              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

        <div className="text-center mt-6">

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            ← Back to BusBook
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Signup;