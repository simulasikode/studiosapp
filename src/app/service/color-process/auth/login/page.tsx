"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "../../hooks/auth/useLogin";
import useGoogleSignIn from "../../hooks/auth/useGoogleSignIn";
import { useToast } from "@/app/service/color-process/utils/toast";
import {
  inputClasses,
  buttonClasses,
} from "@/app/service/color-process/utils/constants";
import { isValidEmail } from "../../hooks/auth/authUtils";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const { login, isLoading: isLoginLoading } = useLogin();
  const { googleSignIn, isLoading: isGoogleLoading } = useGoogleSignIn();
  const isLoading = isLoginLoading || isGoogleLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      await login(email, password);
      showToast("Success", "Logged in successfully!", "success");
      router.push("/service/color-process");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      router.push("/service/color-process");
    } catch (error) {
      console.error("Google Login error:", error);
    }
  };

  const handleContinueAsGuest = () => {
    router.push("/service/color-process"); // Directly navigate to the color-process page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mx-auto max-w-md min-h-[100vh] top-16">
      <div className="p-6 border border-primary">
        <h2 className="text-2xl font-black mb-12 text-center">
          Access an Color Process
        </h2>
        <form onSubmit={handleLogin} className="space-y-6 ">
          <div>
            <label className="block  text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`${inputClasses}  appearance-none  py-2 px-3  leading-tight focus:outline-none `}
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block  text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className={`${inputClasses} appearance-none py-2 px-3  leading-tight focus:outline-none w-full`}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password" // Or "password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-8">
            <button
              className={`${buttonClasses} w-full flex items-center justify-center `}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
            <button
              className={`${buttonClasses} bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex items-center justify-center`}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                "Logging in with Google..."
              ) : (
                <>
                  <FaGoogle className="mr-2" />
                  Login with Google
                </>
              )}
            </button>
            <span className="border-b border-primary my-6" />
            {/* --- "Continue as Guest" Button --- */}
            <button
              type="button" // Important to prevent form submission
              className={`w-full mt-2 py-2 px-4 rounded-full border border-primary hover:border-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`} // Custom guest button style
              onClick={handleContinueAsGuest}
              disabled={isLoading} // Disable during loading if you want
            >
              Continue as Guest
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <a
            href="/service/color-process/auth/signup"
            className="text-blue-500 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
