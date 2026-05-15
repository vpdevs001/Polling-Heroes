import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button.js";
import axios from "axios";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-zinc-900/50 p-12 backdrop-blur-xl">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-zinc-500" />
            <h1 className="text-2xl font-bold text-white">Verifying your email...</h1>
            <p className="text-zinc-400">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-white">Email Verified!</h1>
            <p className="text-zinc-400">{message}</p>
            <div className="pt-4">
              <Link to="/login">
                <Button className="w-full">
                  Sign In to Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <XCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-white">Verification Failed</h1>
            <p className="text-zinc-400">{message}</p>
            <div className="pt-4 space-y-3">
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Try Registering Again
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
