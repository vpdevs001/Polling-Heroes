import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { registerFormSchema } from "../../lib/validators.js";
import type { z } from "zod";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Input } from "../../components/ui/Input.js";

type Form = z.infer<typeof registerFormSchema>;

export function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Form>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Registration failed");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-400">Start building polls in minutes.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="First name" {...form.register("firstName")} />
            <Input label="Last name" {...form.register("lastName")} />
          </div>
          <Input label="Email" type="email" autoComplete="email" {...form.register("email")} />
          <div className="relative">
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-zinc-400 hover:text-white"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link className="text-white hover:underline underline-offset-4" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
