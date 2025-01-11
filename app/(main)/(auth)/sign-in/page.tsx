"use client";

//shadcn ui
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

//react icons
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState<string>("name2@gmail.com");
  const [password, setPassword] = useState<string>("name2@gmail.com");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );
      const redirectUrl =
        session?.user?.userType === "Doctor" ? "/doctorside" : "/home";
      router.push(redirectUrl); // Redirect based on userType
      toast({
        title: "Login successful",
        description: "You have successfully logged in.",
      });
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
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
          <CardTitle className="text-center text-xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm text-center text-gray-600">
            Secure access to your Chronix Portal account
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
              type="email"
              disabled={pending}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded-md"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded-md"
            />
            <Button className="w-full" size="lg" disabled={pending}>
              {pending ? "Signing In..." : "Continue"}
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
            Create new account
            <Link
              className="text-sky-700 ml-4 hover:underline cursor-pointer"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
