import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, type Control, type UseFormRegister, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import * as pollApi from "../../api/poll.api.js";
import { createPollFormSchema } from "../../lib/validators.js";
import type { z } from "zod";
import { Button } from "../../components/ui/Button.js";
import { Card } from "../../components/ui/Card.js";
import { Input } from "../../components/ui/Input.js";
import { Modal } from "../../components/ui/Modal.js";
import { copyToClipboard, publicPollUrl } from "../../lib/utils.js";

type FormValues = z.infer<typeof createPollFormSchema>;

const defaultQuestion = (): FormValues["questions"][number] => ({
  text: "",
  isRequired: true,
  order: 1,
  options: [
    { text: "", order: 1 },
    { text: "", order: 2 },
  ],
});

function QuestionEditor({
  index,
  control,
  register,
  remove,
  canRemove,
}: {
  index: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  remove: () => void;
  canRemove: boolean;
}) {
  const { fields, append, remove: removeOpt } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-medium text-white">Question {index + 1}</h2>
        {canRemove ? (
          <Button type="button" variant="ghost" className="gap-2 text-rose-300" onClick={remove}>
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        ) : null}
      </div>
      <Input label="Question text" {...register(`questions.${index}.text`)} />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <Controller
          control={control}
          name={`questions.${index}.isRequired`}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        Required
      </label>
      <div className="space-y-2">
        <p className="text-sm text-slate-400">Options</p>
        {fields.map((opt, oi) => (
          <div key={opt.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input label={`Option ${oi + 1}`} {...register(`questions.${index}.options.${oi}.text`)} />
            </div>
            {fields.length > 2 ? (
              <Button type="button" variant="ghost" onClick={() => removeOpt(oi)}>
                Remove
              </Button>
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => append({ text: "", order: fields.length + 1 })}
        >
          <Plus className="h-4 w-4" />
          Add option
        </Button>
      </div>
    </Card>
  );
}

export function CreatePollPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [createdPollId, setCreatedPollId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(createPollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      participantType: "Anonymous",
      expiresAt: "",
      questions: [defaultQuestion()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questions" });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const payload = {
      title: values.title,
      description: values.description?.trim() ? values.description : null,
      participantType: values.participantType,
      expiresAt: values.expiresAt?.trim() ? new Date(values.expiresAt).toISOString() : null,
      questions: values.questions.map((q, qi) => ({
        text: q.text,
        isRequired: q.isRequired,
        order: qi + 1,
        options: q.options.map((o, oi) => ({
          text: o.text,
          order: oi + 1,
        })),
      })),
    };
    try {
      const res = await pollApi.createPoll(payload);
      if (!res.success || !res.data?.poll) throw new Error(res.message);
      setCreatedSlug(res.data.poll.url);
      setCreatedPollId(res.data.poll.id);
      setModalOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create poll");
    }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Create a poll</h1>
        <p className="text-slate-400">Add questions, options, and choose how participants join.</p>
      </div>
      <form className="space-y-6" onSubmit={onSubmit}>
        <Card className="space-y-4">
          <Input label="Title" {...form.register("title")} />
          <label className="block space-y-1.5 text-sm">
            <span className="text-slate-300">Description</span>
            <textarea
              className="min-h-[96px] w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
              {...form.register("description")}
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-slate-300">Participant type</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-slate-100"
              {...form.register("participantType")}
            >
              <option value="Anonymous">Anonymous (session token)</option>
              <option value="Authenticated">Authenticated (account required)</option>
            </select>
          </label>
          <Input label="Expires at (optional)" type="datetime-local" {...form.register("expiresAt")} />
        </Card>

        {fields.map((field, qi) => (
          <QuestionEditor
            key={field.id}
            index={qi}
            control={form.control}
            register={form.register}
            remove={() => remove(qi)}
            canRemove={fields.length > 1}
          />
        ))}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => append(defaultQuestion())}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add question
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : "Create poll"}
          </Button>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </form>

      <Modal
        open={modalOpen}
        title="Poll created"
        onClose={() => {
          setModalOpen(false);
          if (createdPollId) navigate(`/dashboard/polls/${createdPollId}/analytics`);
        }}
      >
        <p className="text-sm text-slate-300">Share this link with participants:</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-lg bg-black/40 px-3 py-2 text-xs text-indigo-200">
            {createdSlug ? publicPollUrl(createdSlug) : ""}
          </code>
          <Button
            type="button"
            onClick={() => createdSlug && void copyToClipboard(publicPollUrl(createdSlug))}
          >
            Copy
          </Button>
        </div>
        <Button
          type="button"
          className="mt-4 w-full"
          onClick={() => {
            setModalOpen(false);
            if (createdPollId) navigate(`/dashboard/polls/${createdPollId}/analytics`);
          }}
        >
          Go to analytics
        </Button>
      </Modal>
    </div>
  );
}
