import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import * as pollApi from "../../api/poll.api.js";
import { PollCard } from "../../components/poll/PollCard.js";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Spinner } from "../../components/ui/Spinner.js";
import type { PollListItem } from "../../types/index.js";
import { useAuth } from "../../hooks/useAuth.js";
import { AlertCircle, Mail, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

export function DashboardPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollListItem[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const load = async () => {
    setError(null);
    try {
      const res = await pollApi.getMyPolls();
      if (!res.success || !res.data) throw new Error(res.message);
      setPolls(res.data.polls);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load polls");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onEnd = async (id: string) => {
    setBusyId(id);
    try {
      await pollApi.endPoll(id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this poll and all responses?")) return;
    setBusyId(id);
    try {
      await pollApi.deletePoll(id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleResend = async () => {
    if (!user?.email || resending) return;
    setResending(true);
    setResendStatus("idle");
    try {
      await axios.post("/api/v1/auth/resend-verification", {
        email: user.email,
      });
      setResendStatus("success");
    } catch {
      setResendStatus("error");
    } finally {
      setResending(false);
    }
  };

  if (polls === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!user?.isVerified && (
        <Card className="border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-500/10 p-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-200">
                Email verification required
              </h3>
              <p className="mt-1 text-sm text-amber-200/60">
                Please verify your email address to unlock all features,
                including creating new polls.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="h-9 border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
                  onClick={handleResend}
                  disabled={resending || resendStatus === "success"}
                >
                  {resending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : resendStatus === "success" ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {resendStatus === "success"
                    ? "Verification email sent!"
                    : "Resend verification email"}
                </Button>
                {resendStatus === "error" && (
                  <span className="text-sm text-rose-400">
                    Failed to send email. Try again later.
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Your polls</h1>
          <p className="text-zinc-400">
            Create, share, and analyze responses in real time.
          </p>
        </div>
        <Link to="/dashboard/create">
          <Button type="button" className="gap-2">
            <Plus className="h-4 w-4" />
            Create poll
          </Button>
        </Link>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {polls.length === 0 ? (
        <Card className="text-center">
          <p className="text-lg text-zinc-200">No polls yet</p>
          <p className="mt-2 text-sm text-zinc-400">
            Create your first poll to get started.
          </p>
          <Link className="mt-4 inline-block" to="/dashboard/create">
            <Button type="button">Create poll</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {polls.map((p) => (
            <PollCard
              key={p.id}
              poll={p}
              busy={busyId === p.id}
              onEnd={() => void onEnd(p.id)}
              onDelete={() => void onDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
