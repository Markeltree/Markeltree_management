import { useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PRIORITIES, STATUSES } from "./taskConstants";
import { useToast } from "@/context/ToastContext";
import { Avatar, Badge, Btn, ErrorNote, Field, Input, ModalForm, Select, TextArea } from "./ui";
import { confirmAction, fmtDate, fmtDateTime, fullName, timeAgo, humanize, useQuery, LOOKUP_TTL } from "./utils";

const opts = (list) => list.map((v) => ({ value: v, label: humanize(v) }));

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
// Due dates are entered as a day; store end of that local day.
const fromLocalInput = (v) => (v ? new Date(`${v}T23:59:00`).toISOString() : null);

/** TASK-01/02: create or edit a task. */
export function TaskFormModal({ task, onSaved, closeModal }) {
  const toast = useToast();
  const { employeeId } = useAuth();
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const { data: projects } = useQuery("/projects", { ttl: LOOKUP_TTL });
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    assigneeId: task?.assignee?.id ?? (task ? "" : employeeId ?? ""),
    projectId: task?.project?.id ?? "",
    priority: task?.priority ?? "MEDIUM",
    status: task?.status ?? "TODO",
    dueDate: toLocalInput(task?.dueDate),
  });
  const [subtasks, setSubtasks] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        ...form,
        description: form.description || null,
        assigneeId: form.assigneeId || null,
        projectId: form.projectId || null,
        dueDate: fromLocalInput(form.dueDate),
      };
      if (task) {
        await api.patch(`/tasks/${task.id}`, body);
      } else {
        const list = subtasks.split("\n").map((s) => s.trim()).filter(Boolean);
        await api.post("/tasks", { ...body, ...(list.length && { subtasks: list.map((title) => ({ title })) }) });
      }
      toast.success(task ? "Task updated." : "Task created.");
      onSaved?.();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalForm title={task ? "Edit Task" : "New Task"} onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel={task ? "Save" : "Create task"}>
      <Field label="Title" required>
        <Input value={form.title} onChange={set("title")} required maxLength={200} />
      </Field>
      <Field label="Description">
        <TextArea value={form.description} onChange={set("description")} rows={4} maxLength={10000} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Assignee" hint="You can assign to your team or project members">
          <Select value={form.assigneeId} onChange={set("assigneeId")} placeholder="Unassigned" options={(people ?? []).map((p) => ({ value: p.id, label: `${fullName(p)} · ${p.designation}` }))} />
        </Field>
        <Field label="Project">
          <Select value={form.projectId} onChange={set("projectId")} placeholder="No project" options={(projects ?? []).map((p) => ({ value: p.id, label: p.name }))} />
        </Field>
        <Field label="Priority">
          <Select value={form.priority} onChange={set("priority")} options={opts(PRIORITIES)} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set("status")} options={opts(STATUSES)} />
        </Field>
        <Field label="Due date">
          <Input type="date" value={form.dueDate} onChange={set("dueDate")} />
        </Field>
      </div>
      {!task && (
        <Field label="Checklist" hint="One item per line (optional)">
          <TextArea value={subtasks} onChange={(e) => setSubtasks(e.target.value)} rows={3} />
        </Field>
      )}
    </ModalForm>
  );
}

/** Task detail: status, checklist (TASK-04), comments with mentions (TASK-06). */
export function TaskDetailModal({ taskId, onChanged, closeModal, openModal }) {
  const toast = useToast();
  const { user } = useAuth();
  const { data: t, loading, error, reload } = useQuery(`/tasks/${taskId}`);
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const [comment, setComment] = useState("");
  const [mentions, setMentions] = useState([]);
  const [newSub, setNewSub] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => (reload(), onChanged?.());
  const run = async (fn, ok) => {
    setBusy(true);
    try {
      await fn();
      if (ok) toast.success(ok);
      refresh();
    } catch (e) {
      toast.error(e);
    } finally {
      setBusy(false);
    }
  };

  if (loading && !t) return <p className="text-[13px] text-[#8E8E9C] p-4">Loading…</p>;
  if (error) return <ErrorNote error={error} onRetry={reload} />;
  if (!t) return null;
  const isAssignee = t.assignee?.userId === user.id;
  const canWork = t.canManage || isAssignee;
  const overdue = t.dueDate && t.status !== "DONE" && new Date(t.dueDate) < new Date();
  const doneCount = t.subtasks.filter((s) => s.done).length;

  const remove = async () => {
    if (!(await confirmAction({ message: `Delete "${t.title}"? This cannot be undone.`, acceptLabel: "Delete", danger: true }))) return;
    await run(() => api.delete(`/tasks/${t.id}`), "Task deleted.");
    closeModal();
  };

  return (
    <div className="flex flex-col gap-4 max-h-[82vh]">
      <div className="pr-8">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{t.title}</h2>
          <Badge value={t.priority} />
          {overdue && <Badge value="ABSENT">Overdue</Badge>}
        </div>
        <p className="text-[12px] text-[#8E8E9C]">
          {t.project ? `${t.project.name} · ` : ""}Created by {t.createdBy.employee ? fullName(t.createdBy.employee) : t.createdBy.email} · {timeAgo(t.createdAt)}
        </p>
      </div>

      <div className="overflow-y-auto pr-1 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
          <div>
            <p className="text-[11px] text-[#8E8E9C]">Status</p>
            {canWork ? (
              <select
                value={t.status}
                disabled={busy}
                onChange={(e) => run(() => api.patch(`/tasks/${t.id}`, { status: e.target.value }))}
                className="mt-1 text-[12px] border border-[#6E7A8640] rounded px-2 py-1 bg-white dark:bg-[#0D0D0D] dark:text-[#EEF8FD]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {humanize(s)}
                  </option>
                ))}
              </select>
            ) : (
              <Badge value={t.status} />
            )}
          </div>
          <div>
            <p className="text-[11px] text-[#8E8E9C]">Assignee</p>
            <p className="font-medium text-[#0B1B33] dark:text-[#EEF8FD]">{t.assignee ? fullName(t.assignee) : "Unassigned"}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#8E8E9C]">Due</p>
            <p className={`font-medium ${overdue ? "text-[#E5483A]" : "text-[#0B1B33] dark:text-[#EEF8FD]"}`}>{fmtDate(t.dueDate)}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#8E8E9C]">Completed</p>
            <p className="font-medium text-[#0B1B33] dark:text-[#EEF8FD]">{t.completedAt ? fmtDateTime(t.completedAt) : "—"}</p>
          </div>
        </div>

        {t.description && <p className="text-[14px] whitespace-pre-wrap text-[#333] dark:text-[#E5E5F5]">{t.description}</p>}

        <section>
          <h3 className="text-[13px] font-bold text-[#0088D1] mb-2">
            Checklist {t.subtasks.length > 0 && <span className="text-[#8E8E9C] font-normal">({doneCount}/{t.subtasks.length})</span>}
          </h3>
          <ul className="space-y-1">
            {t.subtasks.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-[13px] group">
                <input
                  type="checkbox"
                  className="accent-[#0088D1]"
                  checked={s.done}
                  disabled={!canWork || busy}
                  onChange={(e) => run(() => api.patch(`/tasks/${t.id}/subtasks/${s.id}`, { done: e.target.checked }))}
                />
                <span className={s.done ? "line-through text-[#8E8E9C]" : "text-[#0B1B33] dark:text-[#EEF8FD]"}>{s.title}</span>
                {t.canManage && (
                  <button className="ml-auto opacity-0 group-hover:opacity-100 text-[#FF695B]" title="Remove" onClick={() => run(() => api.delete(`/tasks/${t.id}/subtasks/${s.id}`))}>
                    <Icon icon="mdi:close" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {canWork && (
            <form
              className="flex gap-2 mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (newSub.trim()) run(() => api.post(`/tasks/${t.id}/subtasks`, { title: newSub.trim() })).then(() => setNewSub(""));
              }}
            >
              <Input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="Add checklist item" className="h-9" />
              <Btn type="submit" size="sm" variant="outline" label="Add" />
            </form>
          )}
        </section>

        <section>
          <h3 className="text-[13px] font-bold text-[#0088D1] mb-2">Comments ({t.comments.length})</h3>
          <ul className="space-y-3">
            {t.comments.map((c) => (
              <li key={c.id} className="flex gap-2">
                <Avatar person={c.user.employee} size={28} />
                <div className="flex-1 bg-[#F4F6F9] dark:bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-[12px] font-semibold text-[#0B1B33] dark:text-[#EEF8FD]">
                    {c.user.employee ? fullName(c.user.employee) : "User"} <span className="font-normal text-[#8E8E9C]">· {timeAgo(c.createdAt)}</span>
                  </p>
                  <p className="text-[13px] whitespace-pre-wrap text-[#333] dark:text-[#E5E5F5]">{c.comment}</p>
                  {c.mentions.length > 0 && (
                    <p className="text-[11px] text-[#0088D1] mt-1">
                      @ {c.mentions.map((uid) => fullName((people ?? []).find((p) => p.userId === uid))).join(", ")}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              run(() => api.post(`/tasks/${t.id}/comments`, { comment: comment.trim(), mentions })).then(() => {
                setComment("");
                setMentions([]);
              });
            }}
          >
            <TextArea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment…" rows={2} maxLength={5000} />
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <select
                value=""
                onChange={(e) => e.target.value && !mentions.includes(e.target.value) && setMentions((m) => [...m, e.target.value])}
                className="text-[12px] border border-[#6E7A8640] rounded px-2 h-9 bg-white dark:bg-[#0D0D0D] dark:text-[#EEF8FD] md:w-[220px]"
              >
                <option value="">@ Mention someone…</option>
                {(people ?? [])
                  .filter((p) => p.userId !== user.id)
                  .map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {fullName(p)}
                    </option>
                  ))}
              </select>
              <div className="flex flex-wrap gap-1 flex-1">
                {mentions.map((uid) => (
                  <button type="button" key={uid} onClick={() => setMentions((m) => m.filter((x) => x !== uid))}>
                    <Badge tone="primary">@{fullName((people ?? []).find((p) => p.userId === uid))} ✕</Badge>
                  </button>
                ))}
              </div>
              <Btn type="submit" size="sm" label="Comment" loading={busy} />
            </div>
          </form>
        </section>
      </div>

      {t.canManage && (
        <div className="flex justify-between pt-2 border-t border-[#6E7A8626]">
          <Btn variant="ghost" icon="mdi:trash-can-outline" label="Delete" onClick={remove} />
          <Btn
            variant="outline"
            icon="tabler:edit"
            label="Edit task"
            onClick={() => openModal(TaskFormModal, { sizeClass: "w-[95%] md:w-[620px]", task: t, onSaved: onChanged })}
          />
        </div>
      )}
    </div>
  );
}
