import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Copy, LineChart as LineChartIcon } from "lucide-react";
import * as analyticsApi from "../../api/analytics.api.js";
import * as pollApi from "../../api/poll.api.js";
import { ResultBarChart } from "../../components/charts/ResultBarChart.js";
import { ResultPieChart } from "../../components/charts/ResultPieChart.js";
import { TimelineChart } from "../../components/charts/TimelineChart.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Spinner } from "../../components/ui/Spinner.js";
import { useSocket } from "../../hooks/useSocket.js";
import type { AnalyticsPayload } from "../../types/index.js";
import { copyToClipboard, formatDate, publicPollUrl, statusBadgeClass } from "../../lib/utils.js";

export function PollAnalyticsPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { joinPoll, leavePoll, onResponseNew, onPollEnded, onPollPublished } = useSocket();
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [pollMeta, setPollMeta] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!pollId) return;
    setError(null);
    try {
      const [a, p] = await Promise.all([
        analyticsApi.getAnalytics(pollId),
        pollApi.getPoll(pollId),
      ]);
      if (!a.success || !a.data) throw new Error(a.message);
      if (!p.success || !p.data) throw new Error(p.message);
      setData(a.data);
      setPollMeta({ url: p.data.poll.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    }
  }, [pollId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!pollId) return;
    joinPoll(pollId);
    const unsubA = onResponseNew((payload) => {
      if (payload.pollId === pollId) {
        void load();
      }
    });
    const unsubB = onPollEnded((payload) => {
      if (payload.pollId === pollId) void load();
    });
    const unsubC = onPollPublished((payload) => {
      if (payload.pollId === pollId) void load();
    });
    return () => {
      leavePoll(pollId);
      unsubA();
      unsubB();
      unsubC();
    };
  }, [pollId, joinPoll, leavePoll, onResponseNew, onPollEnded, onPollPublished, load]);

  const onEnd = async () => {
    if (!pollId) return;
    setBusy(true);
    try {
      await pollApi.endPoll(pollId);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const onPublish = async () => {
    if (!pollId) return;
    setBusy(true);
    try {
      await pollApi.publishPoll(pollId);
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (!pollId) return <p className="text-rose-300">Missing poll id</p>;
  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const share = pollMeta ? publicPollUrl(pollMeta.url) : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-white">{data.poll.title}</h1>
            <Badge className={statusBadgeClass(data.poll.status)}>{data.poll.status}</Badge>
            {data.poll.isPublished ? (
              <Badge className="bg-indigo-500/15 text-indigo-200 ring-indigo-500/30">Published</Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {data.poll.participantType} · {data.poll.totalSubmissions} submissions · Unique{" "}
            {data.poll.uniqueResponders}
          </p>
          {data.poll.expiresAt ? (
            <p className="text-xs text-slate-500">Expires {formatDate(data.poll.expiresAt)}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={() => share && void copyToClipboard(share)}
          >
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          {data.poll.status === "Active" ? (
            <Button type="button" disabled={busy} onClick={() => void onEnd()}>
              End poll
            </Button>
          ) : null}
          {data.poll.status === "Ended" && !data.poll.isPublished ? (
            <Button type="button" disabled={busy} onClick={() => void onPublish()}>
              Publish results
            </Button>
          ) : null}
          {data.poll.isPublished ? (
            <Link to={pollMeta ? `/poll/${pollMeta.url}/results` : "#"}>
              <Button type="button" variant="ghost">
                View public results
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">Total submissions</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data.poll.totalSubmissions}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Questions</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data.questions.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Unique responders</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data.poll.uniqueResponders}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-white">
          <LineChartIcon className="h-5 w-5 text-indigo-300" />
          <h2 className="text-lg font-semibold">Timeline</h2>
        </div>
        <TimelineChart data={data.timeline} />
      </Card>

      <div className="space-y-6">
        {data.questions.map((q) => (
          <Card key={q.id}>
            <h3 className="text-lg font-semibold text-white">{q.text}</h3>
            <p className="text-sm text-slate-400">{q.totalAnswers} answers</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <ResultBarChart
                data={q.options.map((o) => ({
                  name: `${o.text} (${o.percentage}%)`,
                  count: o.count,
                }))}
              />
              <ResultPieChart data={q.options.map((o) => ({ name: o.text, value: o.count }))} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
