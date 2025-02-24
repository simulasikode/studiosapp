// app/auth/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignup from "../../hooks/auth/useSignup";
import { useToast } from "@/app/service/color-process/utils/toast";
import {
  inputClasses,
  buttonClasses,
} from "@/app/service/color-process/utils/constants";
import { isValidEmail } from "../../hooks/auth/authUtils";

const SignupPage = () => {
  const [name, setName] = useState(""); // State for Name input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const router = useRouter();
  const { signup, isLoading } = useSignup();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      // Validate Name input
      showToast("Error", "Name is required", "error");
      return;
    }
    if (!email) {
      showToast("Error", "Email is required", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Error", "Invalid email format", "error");
      return;
    }
    if (!password) {
      showToast("Error", "Password is required", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Error", "Password must be at least 6 characters", "error");
      return;
    }

    try {
      await signup(email, password, name); // Pass name to signup hook
      showToast("Success", "Account created! Please login.", "success");
      router.push("/service/color-process/");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="relative mx-auto max-w-md min-h-[100vh] top-16">
      <div className="p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* --- Name Input --- */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className={`${inputClasses} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* --- Email Input --- */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`${inputClasses} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* --- Password Input --- */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`${inputClasses} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className={`${buttonClasses} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a
            href="/service/color-process/auth/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
