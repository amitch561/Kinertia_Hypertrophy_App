
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, Apple } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1A1A] px-6 py-12 text-white">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/ae0bbc4b-8585-4a7b-8ce8-7aee614f3756.png" 
            alt="Kinertia Labs Logo" 
            className="h-16 w-16"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8">
          Login to your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#2A2A2A] border-none text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="pl-10 pr-10 bg-[#2A2A2A] border-none text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          <Link to="/forgot-password" className="block text-sm text-gray-400 hover:text-[#E65A00]">
            Forgot password?
          </Link>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#E65A00] hover:bg-[#FF7A22] text-white font-medium py-2 h-12"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#E65A00] hover:text-[#FF7A22] font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-8">
          <p className="text-center text-sm text-gray-400 mb-4">
            Alternatively Login with:
          </p>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-[#E65A00] text-white hover:bg-[#E65A00] h-12"
              onClick={() => console.log('Apple login')}
            >
              <Apple className="mr-2 h-5 w-5" /> APPLE ID
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-[#E65A00] text-white hover:bg-[#E65A00] h-12"
              onClick={() => console.log('Google login')}
            >
              <Mail className="mr-2 h-5 w-5" /> GOOGLE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
