import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { loginFormSchema } from "../../lib/validators.js";
import type { z } from "zod";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Input } from "../../components/ui/Input.js";

type Form = z.infer<typeof loginFormSchema>;

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Form>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Sign in to manage your polls.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-zinc-400 hover:text-white"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">
          New here?{" "}
          <Link
            className="text-white hover:underline underline-offset-4"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
