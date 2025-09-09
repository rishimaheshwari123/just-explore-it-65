import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { signup } from "../service/operations/auth";

const AdminSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, email, password };
    const result = await signup(formData);
    if (result?.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardHeader className="text-center py-6">
          <CardTitle className="text-3xl font-bold">Register</CardTitle>
          <p className="text-gray-600 mt-2">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password with show/hide */}
            <div className="space-y-1 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </span>
              </div>
            </div>

            {/* Already have account */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <Link
                to="/login"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Login
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;
