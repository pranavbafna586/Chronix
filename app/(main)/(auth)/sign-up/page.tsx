"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Patient", // Default to Patient
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setPending(false);
        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
        if (form.userType === "Doctor") {
          router.push("/doctorside"); // Redirect to doctor side after successful sign-up
        } else {
          router.push("/home"); // Redirect to home after successful sign-up
        }
      } else if (res.status === 400) {
        setError(data.message);
        setPending(false);
      } else if (res.status === 500) {
        setError(data.message);
        setPending(false);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setError("Something went wrong");
      setPending(false);
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" }).then(() => {
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((session) => {
          const redirectUrl =
            session?.user?.userType === "Doctor" ? "/doctorside" : "/home";
          router.push(redirectUrl); // Redirect based on userType
          toast({
            title: "Login successful",
            description: "You have successfully logged in.",
          });
        });
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <ArrowLeft
            className="text-gray-700 cursor-pointer hover:scale-110 transition"
            onClick={() => router.push("/")} // Redirect to home page
          />
          <h1 className="text-lg font-semibold text-gray-700 ml-2">
            Back to Home
          </h1>
        </div>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {" "}
            Create a Chronix Account
          </CardTitle>
          <CardDescription className="text-sm text-center text-gray-600">
            Secure and trusted account creation for the Chronix Portal
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              disabled={pending}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="p-2 border rounded-md"
            />
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="p-2 border rounded-md"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="p-2 border rounded-md"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className="p-2 border rounded-md"
            />
            <select
              disabled={pending}
              value={form.userType}
              onChange={(e) => setForm({ ...form, userType: e.target.value })}
              required
              className="p-2 border rounded-md w-full"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
            <Button className="w-full" size="lg" disabled={pending}>
              {pending ? "Creating Account..." : "Continue"}
            </Button>
          </form>

          <Separator className="my-4" />
          <div className="flex my-2 justify-evenly mx-auto items-center">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="lg"
              className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FcGoogle className="size-8 left-2.5 top-2.5" />
            </Button>
            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="lg"
              className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FaGithub className="size-8 left-2.5 top-2.5" />
            </Button>
          </div>
          <p className="text-center text-sm mt-2 text-gray-600">
            Already have an account?
            <Link
              className="text-sky-700 ml-4 hover:underline cursor-pointer"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
