import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as pollApi from "../../api/poll.api.js";
import * as responseApi from "../../api/response.api.js";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Spinner } from "../../components/ui/Spinner.js";
import { useAuth } from "../../hooks/useAuth.js";
import type { PublicPollPayload } from "../../types/index.js";
import { getSessionToken } from "../../lib/utils.js";

export function PollRespondPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [payload, setPayload] = useState<PublicPollPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [already, setAlready] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sessionToken = useMemo(() => (slug ? getSessionToken(slug) : ""), [slug]);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoadError(null);
      try {
        const res = await pollApi.getPublicPoll(slug);
        if (!res.success || !res.data) throw new Error(res.message);
        const p = res.data.poll;
        if (p.status === "Ended" && p.isPublished) {
          navigate(`/poll/${slug}/results`, { replace: true });
          return;
        }
        setPayload(res.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setLoadError("notfound");
        } else {
          setLoadError(e instanceof Error ? e.message : "Failed to load poll");
        }
      }
    })();
  }, [slug, navigate]);

  if (!slug) return <p className="text-rose-300">Invalid link</p>;
  if (loadError === "notfound") {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Poll not found</h1>
        <p className="mt-2 text-zinc-400">This link may be incorrect or the poll was removed.</p>
      </Card>
    );
  }
  if (!payload && !loadError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }
  if (loadError) {
    return (
      <Card>
        <p className="text-rose-300">{loadError}</p>
      </Card>
    );
  }
  if (!payload) return null;

  const { poll, questions } = payload;

  if (poll.participantType === "Authenticated") {
    if (isLoading) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      );
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: `/poll/${slug}` }} />;
    }
  }

  if (poll.status === "Ended" && !poll.isPublished) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">This poll has ended</h1>
        <p className="mt-2 text-zinc-400">Responses are closed and results are not published yet.</p>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Thank you!</h1>
        <p className="mt-2 text-zinc-400">Your response has been recorded.</p>
      </Card>
    );
  }

  if (already) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Already responded</h1>
        <p className="mt-2 text-zinc-400">We already have a submission from you for this poll.</p>
      </Card>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const q of questions) {
      if (q.isRequired && !answers[q.id]) {
        setFormError(`Please answer: ${q.text}`);
        return;
      }
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const bodyAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));
      const body =
        poll.participantType === "Anonymous"
          ? { sessionToken, answers: bodyAnswers }
          : { answers: bodyAnswers };
      const res = await responseApi.submitResponse(slug, body);
      if (!res.success) throw new Error(res.message);
      setSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message?.includes("already")) {
        setAlready(true);
      } else if (axios.isAxiosError(err) && err.response?.status === 410) {
        setFormError("This poll is no longer accepting responses.");
      } else {
        setFormError(
          axios.isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message ?? "Submit failed"
            : "Submit failed",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">{poll.title}</h1>
        {poll.description ? <p className="mt-2 text-zinc-300">{poll.description}</p> : null}
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
        {questions.map((q) => (
          <Card key={q.id}>
            <p className="text-base font-medium text-white">
              {q.text}
              {q.isRequired ? <span className="text-rose-300"> *</span> : null}
            </p>
            <div className="mt-4 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-2 hover:border-white/40"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={answers[q.id] === o.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                  />
                  <span className="text-zinc-200">{o.text}</span>
                </label>
              ))}
            </div>
          </Card>
        ))}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting…" : "Submit responses"}
        </Button>
        {formError ? <p className="text-center text-sm text-rose-300">{formError}</p> : null}
      </form>
      {poll.isPublished ? (
        <p className="text-center text-sm text-zinc-400">
          <Link className="text-white hover:underline underline-offset-4" to={`/poll/${slug}/results`}>
            View published results
          </Link>
        </p>
      ) : null}
    </div>
  );
}
