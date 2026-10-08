import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { Avatar, Badge, Btn, Empty, ErrorNote, Field, Input, ModalForm, Page, PageHeader, Panel, Select, TextArea } from "@/components/hr/ui";
import { confirmAction, fmtDateTime, fullName, timeAgo, useQuery, LOOKUP_TTL } from "@/components/hr/utils";

function ComposeModal({ onSaved, closeModal }) {
  const { can, user } = useAuth();
  const toast = useToast();
  const isManager = can("announcements.manage");
  const [form, setForm] = useState({
    title: "",
    body: "",
    audienceType: isManager ? "ALL" : "DEPARTMENT",
    audienceIds: [],
    requiresAcknowledgement: false,
    isPinned: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { data: departments } = useQuery("/org/departments", { ttl: LOOKUP_TTL });
  const { data: teams } = useQuery("/org/teams", { ttl: LOOKUP_TTL });

  // Non-HR authors can only target their own department/team.
  useEffect(() => {
    if (isManager || !user.employee) return;
    api.get(`/employees/${user.employee.id}`).then((me) => {
      setForm((f) => ({ ...f, audienceIds: f.audienceType === "TEAM" ? [me.team?.id].filter(Boolean) : [me.department?.id].filter(Boolean) }));
    });
  }, [isManager, user, form.audienceType]);

  const options = form.audienceType === "DEPARTMENT" ? departments ?? [] : form.audienceType === "TEAM" ? teams ?? [] : [];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value, ...(k === "audienceType" && { audienceIds: [] }) }));
  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post("/announcements", form);
      toast.success("Announcement published.");
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title="New Announcement" onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel="Publish">
      <Field label="Title" required>
        <Input value={form.title} onChange={set("title")} required maxLength={200} />
      </Field>
      <Field label="Message" required>
        <TextArea value={form.body} onChange={set("body")} required rows={6} maxLength={20000} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Audience">
          <Select
            value={form.audienceType}
            onChange={set("audienceType")}
            options={[...(isManager ? [{ value: "ALL", label: "Everyone" }] : []), { value: "DEPARTMENT", label: "Department" }, { value: "TEAM", label: "Team" }]}
          />
        </Field>
        {form.audienceType !== "ALL" && (
          <Field label={form.audienceType === "TEAM" ? "Teams" : "Departments"} hint={isManager ? "Hold Ctrl/Cmd to select several" : "Your own"}>
            <select
              multiple
              disabled={!isManager}
              value={form.audienceIds}
              onChange={(e) => setForm((f) => ({ ...f, audienceIds: [...e.target.selectedOptions].map((o) => o.value) }))}
              className="w-full text-[13px] px-2 py-1 border border-[#6E7A8640] rounded-lg bg-white dark:bg-[#0D0D0D] dark:text-[#EEF8FD] min-h-[80px]"
            >
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-[13px] text-[#6E7A86]">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#0088D1]" checked={form.requiresAcknowledgement} onChange={set("requiresAcknowledgement")} /> Require acknowledgement
        </label>
        {isManager && (
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-[#0088D1]" checked={form.isPinned} onChange={set("isPinned")} /> Pin to top
          </label>
        )}
      </div>
    </ModalForm>
  );
}

function AckList({ announcement, closeModal }) {
  const { data, loading, error } = useQuery(`/announcements/${announcement.id}/acknowledgements`);
  return (
    <div className="flex flex-col gap-3 max-h-[75vh]">
      <div className="pr-8">
        <h2 className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">Acknowledgements</h2>
        <p className="text-[12px] text-[#6E7A86]">{announcement.title}</p>
      </div>
      <ErrorNote error={error} />
      {loading ? (
        <p className="text-[13px] text-[#8E8E9C]">Loading…</p>
      ) : (
        <>
          <p className="text-[13px] font-semibold">
            {data.acknowledged} of {data.total} acknowledged
          </p>
          <ul className="overflow-y-auto divide-y divide-[#6E7A8626]">
            {data.rows.map((r) => (
              <li key={r.user.id} className="flex justify-between py-2 text-[13px]">
                <span>
                  {r.user.employee ? fullName(r.user.employee) : r.user.email}
                  <span className="text-[11px] text-[#8E8E9C]"> {r.user.employee?.department?.name}</span>
                </span>
                {r.acknowledgedAt ? <Badge value="APPROVED">{fmtDateTime(r.acknowledgedAt)}</Badge> : r.readAt ? <Badge value="PENDING">Read</Badge> : <Badge value="TODO">Not read</Badge>}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="flex justify-end">
        <Btn variant="outline" label="Close" onClick={closeModal} />
      </div>
    </div>
  );
}

export default function Announcements() {
  const { can, user } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const [params] = useSearchParams();
  const focusId = params.get("id");
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useQuery(`/announcements${qs({ page, pageSize: 10 })}`);

  useEffect(() => {
    if (focusId && data) document.getElementById(`ann-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusId, data]);

  const acknowledge = async (a) => {
    try {
      await api.post(`/announcements/${a.id}/acknowledge`, { acknowledge: true });
      reload();
    } catch (e) {
      toast.error(e);
    }
  };
  const remove = async (a) => {
    if (!(await confirmAction({ message: `Delete "${a.title}"?`, acceptLabel: "Delete", danger: true }))) return;
    try {
      await api.delete(`/announcements/${a.id}`);
      reload();
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <Page>
      <PageHeader
        title="Announcements"
        subtitle="Company and department news"
        actions={can("announcements.create", "announcements.manage") && <Btn icon="material-symbols:add-rounded" label="New Announcement" onClick={() => openModal(ComposeModal, { sizeClass: "w-[95%] md:w-[640px]", onSaved: reload })} />}
      />
      <ErrorNote error={error} onRetry={reload} />
      {!loading && data?.items.length === 0 && (
        <Panel>
          <Empty icon="mdi:bullhorn-outline" text="No announcements yet." />
        </Panel>
      )}
      {(data?.items ?? []).map((a) => {
        const mine = a.author.id === user.id;
        return (
          <Panel key={a.id} className={focusId === a.id ? "ring-2 ring-[#0088D1]" : ""}>
            <div id={`ann-${a.id}`} className="flex gap-3">
              <Avatar person={a.author.employee} size={40} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {a.isPinned && <Icon icon="mdi:pin" className="text-[#0088D1]" />}
                  <h2 className="text-[16px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{a.title}</h2>
                  {a.audienceType !== "ALL" && <Badge tone="info">{a.audienceType === "TEAM" ? "Team" : a.audienceType === "DEPARTMENT" ? "Department" : "Selected people"}</Badge>}
                </div>
                <p className="text-[11px] text-[#8E8E9C]">
                  {a.author.employee ? fullName(a.author.employee) : "Admin"} · {timeAgo(a.publishedAt)}
                </p>
                <p className="text-[14px] text-[#333] dark:text-[#E5E5F5] whitespace-pre-wrap mt-3">{a.body}</p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {a.requiresAcknowledgement &&
                    (a.acknowledgedAt ? (
                      <Badge value="APPROVED">Acknowledged {timeAgo(a.acknowledgedAt)}</Badge>
                    ) : (
                      !mine && <Btn size="sm" icon="mdi:check" label="Acknowledge" onClick={() => acknowledge(a)} />
                    ))}
                  {(mine || can("announcements.manage")) && (
                    <>
                      {a.requiresAcknowledgement && (
                        <Btn size="sm" variant="ghost" label={`${a._count.acknowledgements} acknowledged`} onClick={() => openModal(AckList, { sizeClass: "w-[95%] md:w-[520px]", announcement: a })} />
                      )}
                      <Btn size="sm" variant="ghost" icon="mdi:trash-can-outline" label="Delete" onClick={() => remove(a)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        );
      })}
      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Btn size="sm" variant="outline" label="Newer" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} />
          <Btn size="sm" variant="outline" label="Older" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} />
        </div>
      )}
    </Page>
  );
}
