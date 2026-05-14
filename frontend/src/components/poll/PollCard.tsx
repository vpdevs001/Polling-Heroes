import { Link } from "react-router-dom";
import { BarChart3, Copy, Trash2 } from "lucide-react";
import type { PollListItem } from "../../types/index.js";
import { Badge } from "../ui/Badge.js";
import { Button } from "../ui/Button.js";
import { Card } from "../ui/Card.js";
import { copyToClipboard, formatDate, publicPollUrl, statusBadgeClass } from "../../lib/utils.js";

type Props = {
  poll: PollListItem;
  onEnd?: () => void;
  onDelete?: () => void;
  busy?: boolean;
};

export function PollCard({ poll, onEnd, onDelete, busy }: Props) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{poll.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {poll.participantType} · {poll.submissionCount} responses
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Created {formatDate(poll.createdAt)}
            {poll.expiresAt ? ` · Expires ${formatDate(poll.expiresAt)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusBadgeClass(poll.status)}>{poll.status}</Badge>
          {poll.isPublished ? (
            <Badge className="bg-indigo-500/15 text-indigo-200 ring-indigo-500/30">Published</Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={`/dashboard/polls/${poll.id}/analytics`}>
          <Button type="button" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </Link>
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => void copyToClipboard(publicPollUrl(poll.url)).then(() => {})}
        >
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
        {poll.status === "Active" && onEnd ? (
          <Button type="button" variant="ghost" disabled={busy} onClick={onEnd}>
            End poll
          </Button>
        ) : null}
        {onDelete ? (
          <Button type="button" variant="danger" disabled={busy} className="gap-2" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
