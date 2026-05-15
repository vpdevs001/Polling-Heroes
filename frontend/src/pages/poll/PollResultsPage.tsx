import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as analyticsApi from "../../api/analytics.api.js";
import { ResultBarChart } from "../../components/charts/ResultBarChart.js";
import { Card } from "../../components/ui/Card.js";
import { Spinner } from "../../components/ui/Spinner.js";
import type { AnalyticsPayload } from "../../types/index.js";

export function PollResultsPage() {
  const { slug } = useParams();
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setError(null);
      try {
        const res = await analyticsApi.getPublicResults(slug);
        if (!res.success || !res.data) throw new Error(res.message);
        setData(res.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          setError("notpublished");
        } else if (axios.isAxiosError(e) && e.response?.status === 404) {
          setError("notfound");
        } else {
          setError(e instanceof Error ? e.message : "Failed to load results");
        }
      }
    })();
  }, [slug]);

  if (!slug) return null;
  if (!data && !error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }
  if (error === "notpublished") {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Results not published yet</h1>
        <p className="mt-2 text-zinc-400">Check back later once the host publishes the outcome.</p>
      </Card>
    );
  }
  if (error === "notfound") {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Poll not found</h1>
      </Card>
    );
  }
  if (error || !data) {
    return (
      <Card>
        <p className="text-rose-300">{error}</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">{data.poll.title}</h1>
        {data.poll.description ? <p className="mt-2 text-zinc-300">{data.poll.description}</p> : null}
        <p className="mt-3 text-sm text-zinc-400">{data.poll.totalSubmissions} total submissions</p>
      </div>
      {data.questions.map((q) => (
        <Card key={q.id}>
          <h2 className="text-lg font-semibold text-white">{q.text}</h2>
          <p className="text-sm text-zinc-400">{q.totalAnswers} answers</p>
          <div className="mt-4">
            <ResultBarChart
              data={q.options.map((o) => ({
                name: `${o.text} (${o.percentage}%)`,
                count: o.count,
              }))}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
