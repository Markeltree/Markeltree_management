import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useRealtimeContext } from "@/context/RealtimeContext";
import { usePolling, useRealtime } from "@/hooks/useRealtime";
import { Avatar, Badge, Btn, Empty, ErrorNote, Field, Input, ModalForm, Select } from "@/components/hr/ui";
import { confirmAction, fullName, LOOKUP_TTL, useDebounce, useQuery } from "@/components/hr/utils";

const TYPING_SEND_MS = 3000; // throttle outgoing typing signals
const TYPING_SHOW_MS = 4000; // how long a typing indicator stays visible
const POLL_MS = 5000; // message refresh when realtime is unavailable

// ── helpers ──────────────────────────────────────────────────────

const personOf = (user) => user?.employee ?? null;
const nameOf = (user) => (user?.employee ? fullName(user.employee) : "Unknown user");

function conversationTitle(c, meId) {
  if (c.type === "DIRECT") {
    const other = c.members.find((m) => m.userId !== meId);
    return other ? nameOf(other.user) : "Just you";
  }
  return c.type === "CHANNEL" ? `# ${c.name}` : c.name;
}

function conversationAvatarPerson(c, meId) {
  if (c.type === "DIRECT") return personOf(c.members.find((m) => m.userId !== meId)?.user);
  return { firstName: c.type === "CHANNEL" ? "#" : c.name?.[0] ?? "G", lastName: "" };
}

const timeShort = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
};

const dayLabel = (iso) => {
  const d = new Date(iso);
  const t = new Date();
  if (d.toDateString() === t.toDateString()) return "Today";
  t.setDate(t.getDate() - 1);
  if (d.toDateString() === t.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

// ── modals ───────────────────────────────────────────────────────

function PeoplePicker({ people, selected, onToggle, multi = true, excludeIds = [] }) {
  const [q, setQ] = useState("");
  const list = people.filter((p) => p.userId && !excludeIds.includes(p.userId) && fullName(p).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-2">
      <Input placeholder="Search people…" value={q} onChange={(e) => setQ(e.target.value)} className="h-9" autoFocus />
      <ul className="max-h-[300px] overflow-y-auto divide-y divide-[#6F7C7426] border border-[#6F7C7426] rounded-lg">
        {list.length === 0 && <li className="p-3 text-[13px] text-[#8E8E9C]">No one found.</li>}
        {list.map((p) => (
          <li key={p.userId}>
            <button type="button" onClick={() => onToggle(p.userId)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#09BF640D] text-left">
              {multi && <input type="checkbox" readOnly checked={selected.includes(p.userId)} className="accent-[#09BF64]" />}
              <Avatar person={p} size={30} />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3] truncate">{fullName(p)}</span>
                <span className="block text-[11px] text-[#8E8E9C] truncate">{p.designation}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewDirectModal({ meId, onOpen, closeModal }) {
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const toast = useToast();
  const start = async (userId) => {
    try {
      const r = await api.post("/chat/direct", { userId });
      onOpen(r.id);
      closeModal();
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="pr-8">
        <h2 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">New message</h2>
        <p className="text-[12px] text-[#6F7C74]">Choose a colleague to chat with.</p>
      </div>
      <PeoplePicker people={people ?? []} selected={[]} multi={false} excludeIds={[meId]} onToggle={start} />
    </div>
  );
}

function NewGroupModal({ meId, onOpen, closeModal }) {
  const { can } = useAuth();
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const [name, setName] = useState("");
  const [type, setType] = useState("GROUP");
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const toggle = (id) => setMembers((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  const submit = async () => {
    if (!members.length) return setError(new Error("Add at least one member."));
    setSaving(true);
    setError(null);
    try {
      const r = await api.post("/chat/conversations", { type, name, memberIds: members });
      onOpen(r.id);
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title="New group" onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel={`Create (${members.length + 1} people)`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Name" required className="md:col-span-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="e.g. Platform team" />
        </Field>
        {can("chat.manage") && (
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value)} options={[{ value: "GROUP", label: "Group" }, { value: "CHANNEL", label: "Channel" }]} />
          </Field>
        )}
      </div>
      <PeoplePicker people={people ?? []} selected={members} onToggle={toggle} excludeIds={[meId]} />
    </ModalForm>
  );
}

function MembersModal({ conversation, meId, onLeft, closeModal }) {
  const { can } = useAuth();
  const toast = useToast();
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const [adding, setAdding] = useState([]);
  const me = conversation.members.find((m) => m.userId === meId);
  const isAdmin = me?.isAdmin || can("chat.manage");
  const memberIds = conversation.members.map((m) => m.userId);

  const update = async (body, ok) => {
    try {
      await api.put(`/chat/conversations/${conversation.id}/members`, body);
      toast.success(ok);
      closeModal();
    } catch (e) {
      toast.error(e);
    }
  };
  const leave = async () => {
    if (!(await confirmAction({ message: `Leave "${conversation.name}"?`, acceptLabel: "Leave", danger: true }))) return;
    try {
      await api.post(`/chat/conversations/${conversation.id}/leave`);
      onLeft();
      closeModal();
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-h-[80vh]">
      <div className="pr-8">
        <h2 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{conversation.name}</h2>
        <p className="text-[12px] text-[#6F7C74]">{conversation.members.length} members</p>
      </div>
      <ul className="overflow-y-auto divide-y divide-[#6F7C7426] max-h-[260px]">
        {conversation.members.map((m) => (
          <li key={m.userId} className="flex items-center gap-3 py-2">
            <Avatar person={personOf(m.user)} size={30} />
            <span className="flex-1 text-[13px] text-[#0F2418] dark:text-[#EFFBF3]">
              {nameOf(m.user)} {m.userId === meId && <span className="text-[#8E8E9C]">(you)</span>}
            </span>
            {m.isAdmin && <Badge tone="primary">Admin</Badge>}
            {isAdmin && m.userId !== meId && (
              <button className="text-[#FF695B] text-[12px] hover:underline" onClick={() => update({ remove: [m.userId] }, `${nameOf(m.user)} removed.`)}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <>
          <h3 className="text-[13px] font-bold text-[#09BF64]">Add people</h3>
          <PeoplePicker people={people ?? []} selected={adding} excludeIds={memberIds} onToggle={(id) => setAdding((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))} />
        </>
      )}
      <div className="flex justify-between pt-1">
        <Btn variant="ghost" icon="mdi:exit-to-app" label="Leave group" onClick={leave} />
        {isAdmin && <Btn label={`Add ${adding.length || ""}`.trim()} disabled={!adding.length} onClick={() => update({ add: adding }, "Members added.")} />}
      </div>
    </div>
  );
}

// ── thread ───────────────────────────────────────────────────────

function Message({ m, mine, showAuthor, onEdit, onDelete, seen }) {
  const deleted = !!m.deletedAt;
  return (
    <div className={`group flex gap-2 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && <div className="w-8 shrink-0">{showAuthor && <Avatar person={personOf(m.sender)} size={32} />}</div>}
      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
        {showAuthor && !mine && <span className="text-[11px] text-[#6F7C74] mb-0.5 ml-1">{nameOf(m.sender)}</span>}
        <div className="flex items-center gap-1">
          {mine && !deleted && !m.pending && (
            <span className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button title="Edit" onClick={() => onEdit(m)} className="text-[#8E8E9C] hover:text-[#09BF64]">
                <Icon icon="tabler:edit" width={14} />
              </button>
              <button title="Delete" onClick={() => onDelete(m)} className="text-[#8E8E9C] hover:text-[#FF695B]">
                <Icon icon="mdi:trash-can-outline" width={14} />
              </button>
            </span>
          )}
          <div
            className={`rounded-2xl px-3 py-2 text-[14px] whitespace-pre-wrap break-words ${
              deleted
                ? "italic text-[#8E8E9C] bg-transparent border border-[#6F7C7440]"
                : mine
                  ? "bg-[#09BF64] text-white rounded-br-sm"
                  : "bg-white dark:bg-[#1F1F1F] text-[#0F2418] dark:text-[#EFFBF3] rounded-bl-sm"
            } ${m.pending ? "opacity-60" : ""} ${m.failed ? "ring-1 ring-[#FF695B]" : ""}`}
          >
            {deleted ? "This message was deleted" : m.body}
          </div>
        </div>
        <span className="text-[10px] text-[#8E8E9C] mt-0.5 mx-1">
          {m.failed ? "Not sent" : m.pending ? "Sending…" : new Date(m.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          {m.editedAt && !deleted && " · edited"}
          {seen && " · Seen"}
        </span>
      </div>
    </div>
  );
}

function Thread({ conversation, meId, connected, onBack, onLeft }) {
  const toast = useToast();
  const { openModal } = useModal();
  const id = conversation.id;
  const [messages, setMessages] = useState([]);
  const [readState, setReadState] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [mentions, setMentions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [editing, setEditing] = useState(null);
  const [typing, setTyping] = useState({}); // userId -> expiresAt
  const scroller = useRef(null);
  const stickToBottom = useRef(true);
  const lastTypingSent = useRef(0);
  const inputRef = useRef(null);

  const markRead = useCallback(() => {
    if (document.visibilityState === "visible") api.post(`/chat/conversations/${id}/read`, {}, { invalidate: false }).then(() => {}, () => {});
  }, [id]);

  const loadLatest = useCallback(async () => {
    try {
      const r = await api.get(`/chat/conversations/${id}/messages?limit=50`, { cache: false });
      setMessages((prev) => {
        // Keep older pages and unsent local messages; replace the latest window.
        const latestIds = new Set(r.items.map((m) => m.id));
        const oldest = r.items[0]?.createdAt;
        const older = prev.filter((m) => !m.pending && !latestIds.has(m.id) && oldest && m.createdAt < oldest);
        const local = prev.filter((m) => m.pending || m.failed);
        return [...older, ...r.items, ...local];
      });
      setReadState(r.readState);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    setHasMore(false);
    setEditing(null);
    setText("");
    stickToBottom.current = true;
    api
      .get(`/chat/conversations/${id}/messages?limit=50`, { cache: false })
      .then((r) => {
        setMessages(r.items);
        setReadState(r.readState);
        setHasMore(r.hasMore);
      })
      .catch(setError)
      .finally(() => setLoading(false));
    markRead();
    inputRef.current?.focus();
  }, [id, markRead]);

  usePolling(() => (loadLatest(), markRead()), POLL_MS, !connected);

  useRealtime(async (event, p) => {
    if (event !== "chat" || p?.conversationId !== id) return;
    if (p.kind === "typing") {
      setTyping((t) => ({ ...t, [p.userId]: Date.now() + TYPING_SHOW_MS }));
      return;
    }
    if (p.kind === "read") {
      setReadState((rs) => rs.map((r) => (r.userId === p.userId ? { ...r, lastReadAt: new Date().toISOString() } : r)));
      return;
    }
    if (p.kind === "conversation") return;
    if (!p.messageId) return;
    try {
      const m = await api.get(`/chat/messages/${p.messageId}`, { cache: false });
      setMessages((prev) => {
        const i = prev.findIndex((x) => x.id === m.id);
        if (i >= 0) return prev.map((x) => (x.id === m.id ? m : x));
        return [...prev.filter((x) => !(x.pending && x.body === m.body && m.senderId === meId)), m];
      });
      if (p.kind === "message" && m.senderId !== meId) {
        setTyping((t) => ({ ...t, [m.senderId]: 0 }));
        markRead();
      }
    } catch {
      /* message may have been deleted meanwhile */
    }
  });

  // Expire typing indicators.
  useEffect(() => {
    const t = setInterval(() => setTyping((ty) => Object.fromEntries(Object.entries(ty).filter(([, exp]) => exp > Date.now()))), 1000);
    return () => clearInterval(t);
  }, []);

  // Keep the view pinned to the newest message unless the user scrolled up.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onScroll = () => {
    const el = scroller.current;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const loadOlder = async () => {
    if (!messages.length) return;
    setLoadingOlder(true);
    const el = scroller.current;
    const prevHeight = el.scrollHeight;
    try {
      const firstReal = messages.find((m) => !m.pending);
      const r = await api.get(`/chat/conversations/${id}/messages?limit=50&before=${encodeURIComponent(firstReal.createdAt)}`, { cache: false });
      stickToBottom.current = false;
      setMessages((prev) => [...r.items.filter((m) => !prev.some((x) => x.id === m.id)), ...prev]);
      setHasMore(r.hasMore);
      requestAnimationFrame(() => (el.scrollTop = el.scrollHeight - prevHeight));
    } catch (e) {
      toast.error(e);
    } finally {
      setLoadingOlder(false);
    }
  };

  const members = conversation.members.filter((m) => m.userId !== meId);
  const mentionOptions = mentionQuery === null ? [] : members.filter((m) => nameOf(m.user).toLowerCase().includes(mentionQuery.toLowerCase())).slice(0, 6);

  const onChange = (e) => {
    const value = e.target.value;
    setText(value);
    const before = value.slice(0, e.target.selectionStart);
    const match = /(^|\s)@([\w]*)$/.exec(before);
    setMentionQuery(conversation.type !== "DIRECT" && match ? match[2] : null);
    if (!editing && value && Date.now() - lastTypingSent.current > TYPING_SEND_MS) {
      lastTypingSent.current = Date.now();
      api.post(`/chat/conversations/${id}/typing`, {}, { invalidate: false }).then(() => {}, () => {});
    }
  };

  const pickMention = (m) => {
    const name = nameOf(m.user);
    setText((t) => t.replace(/(^|\s)@[\w]*$/, `$1@${name} `));
    setMentions((ms) => [...new Set([...ms, m.userId])]);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    if (editing) {
      try {
        const updated = await api.patch(`/chat/messages/${editing.id}`, { body });
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setEditing(null);
        setText("");
      } catch (e) {
        toast.error(e);
      }
      return;
    }
    // Only keep mentions whose names are still in the text.
    const activeMentions = mentions.filter((uid) => body.includes(`@${nameOf(members.find((m) => m.userId === uid)?.user)}`));
    const temp = { id: `tmp-${Date.now()}`, body, senderId: meId, createdAt: new Date().toISOString(), pending: true, sender: null };
    stickToBottom.current = true;
    setMessages((prev) => [...prev, temp]);
    setText("");
    setMentions([]);
    try {
      const saved = await api.post(`/chat/conversations/${id}/messages`, { body, mentions: activeMentions });
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== temp.id);
        return withoutTemp.some((m) => m.id === saved.id) ? withoutTemp : [...withoutTemp, saved];
      });
    } catch (e) {
      setMessages((prev) => prev.map((m) => (m.id === temp.id ? { ...m, pending: false, failed: true } : m)));
      toast.error(e);
    }
  };

  const remove = async (m) => {
    if (!(await confirmAction({ message: "Delete this message for everyone?", acceptLabel: "Delete", danger: true }))) return;
    try {
      await api.delete(`/chat/messages/${m.id}`);
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, deletedAt: new Date().toISOString(), body: null } : x)));
    } catch (e) {
      toast.error(e);
    }
  };

  // "Seen" on my latest message in a DM once the other person has read past it.
  const lastMine = [...messages].reverse().find((m) => m.senderId === meId && !m.pending && !m.failed);
  const seenId =
    conversation.type === "DIRECT" && lastMine && readState.some((r) => r.lastReadAt && new Date(r.lastReadAt) >= new Date(lastMine.createdAt)) ? lastMine.id : null;
  const typingNames = Object.keys(typing)
    .map((uid) => members.find((m) => m.userId === uid))
    .filter(Boolean)
    .map((m) => nameOf(m.user).split(" ")[0]);

  const header =
    conversation.type === "DIRECT"
      ? personOf(members[0]?.user)?.designation
      : `${conversation.members.length} members`;

  return (
    <div className="flex flex-col flex-1 h-full min-w-0">
      <div className="flex items-center gap-3 px-4 h-[64px] border-b border-[#6F7C7426] bg-white dark:bg-black shrink-0">
        <button className="md:hidden text-[#09BF64]" onClick={onBack} aria-label="Back to conversations">
          <Icon icon="mdi:arrow-left" width={22} />
        </button>
        <Avatar person={conversationAvatarPerson(conversation, meId)} size={38} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[#0F2418] dark:text-[#EFFBF3] truncate">{conversationTitle(conversation, meId)}</p>
          <p className="text-[12px] text-[#8E8E9C] truncate">{typingNames.length ? <span className="text-[#09BF64]">{typingNames.join(", ")} typing…</span> : header}</p>
        </div>
        {conversation.type !== "DIRECT" && (
          <Btn size="sm" variant="ghost" icon="mdi:account-multiple-outline" label="Members" onClick={() => openModal(MembersModal, { sizeClass: "w-[95%] md:w-[520px]", conversation, meId, onLeft })} />
        )}
      </div>

      <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-gray-50 dark:bg-[#141414]">
        <ErrorNote error={error} onRetry={loadLatest} />
        {hasMore && (
          <div className="flex justify-center pb-2">
            <Btn size="sm" variant="ghost" label="Load older messages" loading={loadingOlder} onClick={loadOlder} />
          </div>
        )}
        {loading && <p className="text-center text-[13px] text-[#8E8E9C] py-6">Loading messages…</p>}
        {!loading && messages.length === 0 && <Empty icon="mdi:message-outline" text="No messages yet. Say hello!" />}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
          const showAuthor = conversation.type !== "DIRECT" && (newDay || prev?.senderId !== m.senderId);
          return (
            <div key={m.id}>
              {newDay && (
                <div className="flex justify-center my-3">
                  <span className="text-[11px] text-[#8E8E9C] bg-white dark:bg-black px-3 py-0.5 rounded-full">{dayLabel(m.createdAt)}</span>
                </div>
              )}
              <div className={prev?.senderId === m.senderId && !newDay ? "mt-0.5" : "mt-2"}>
                <Message
                  m={m}
                  mine={m.senderId === meId}
                  showAuthor={showAuthor}
                  seen={m.id === seenId}
                  onEdit={(msg) => {
                    setEditing(msg);
                    setText(msg.body);
                    inputRef.current?.focus();
                  }}
                  onDelete={remove}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative border-t border-[#6F7C7426] bg-white dark:bg-black p-3 shrink-0">
        {mentionOptions.length > 0 && (
          <ul className="absolute bottom-full left-3 mb-1 w-64 bg-white dark:bg-[#0D0D0D] border border-[#6F7C7440] rounded-lg shadow-lg overflow-hidden z-10">
            {mentionOptions.map((m) => (
              <li key={m.userId}>
                <button type="button" onMouseDown={(e) => (e.preventDefault(), pickMention(m))} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#09BF6414] text-left text-[13px]">
                  <Avatar person={personOf(m.user)} size={24} /> {nameOf(m.user)}
                </button>
              </li>
            ))}
          </ul>
        )}
        {editing && (
          <div className="flex items-center justify-between text-[12px] text-[#09BF64] mb-2">
            <span>Editing message</span>
            <button onClick={() => (setEditing(null), setText(""))} className="hover:underline">
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (mentionOptions.length) pickMention(mentionOptions[0]);
                else send();
              }
              if (e.key === "Escape") {
                setMentionQuery(null);
                if (editing) (setEditing(null), setText(""));
              }
            }}
            rows={1}
            maxLength={5000}
            placeholder={conversation.type === "DIRECT" ? "Write a message…" : "Write a message… (@ to mention)"}
            className="flex-1 resize-none max-h-[140px] text-[14px] px-3 py-2.5 border border-[#6F7C7440] rounded-xl bg-white dark:bg-[#0D0D0D] text-[#0F2418] dark:text-[#EFFBF3] focus:outline-none focus:ring-1 focus:ring-[#A6E8C1]"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(140, e.target.scrollHeight)}px`;
            }}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            aria-label={editing ? "Save" : "Send"}
            className="h-[42px] w-[42px] shrink-0 rounded-xl bg-[#09BF64] text-white flex items-center justify-center disabled:opacity-40"
          >
            <Icon icon={editing ? "mdi:check" : "mdi:send"} width={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────

export default function Chat() {
  const { user, can } = useAuth();
  const meId = user.id;
  const { openModal } = useModal();
  const { connected } = useRealtimeContext();
  const [params, setParams] = useSearchParams();
  const activeId = params.get("c");
  const [filter, setFilter] = useState("");
  const q = useDebounce(filter.trim());
  const conversations = useQuery("/chat/conversations");
  const search = useQuery(q.length >= 2 ? `/chat/search?q=${encodeURIComponent(q)}` : null);
  const { data: settings } = useQuery("/admin/settings", { ttl: LOOKUP_TTL });

  usePolling(conversations.reload, POLL_MS * 2, !connected);

  const open = useCallback((id) => setParams(id ? { c: id } : {}), [setParams]);
  const list = useMemo(() => conversations.data ?? [], [conversations.data]);
  const active = list.find((c) => c.id === activeId);
  const filtered = useMemo(
    () => (q ? list.filter((c) => conversationTitle(c, meId).toLowerCase().includes(q.toLowerCase())) : list),
    [list, q, meId]
  );
  const canCreateGroup = can("chat.create_group", "chat.manage") || settings?.["chat.employeesCanCreateGroups"];

  return (
    <div className="flex h-full bg-white dark:bg-black">
      <aside className={`${activeId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[320px] lg:w-[360px] border-r border-[#6F7C7426] shrink-0`}>
        <div className="flex items-center justify-between px-4 h-[64px] border-b border-[#6F7C7426]">
          <h1 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3] flex items-center gap-2">
            Chat
            <span title={connected ? "Live" : "Reconnecting — messages refresh every few seconds"} className={`w-2 h-2 rounded-full ${connected ? "bg-[#10B981]" : "bg-[#F59E0B]"}`} />
          </h1>
          <div className="flex gap-2">
            {canCreateGroup && (
              <button title="New group" onClick={() => openModal(NewGroupModal, { sizeClass: "w-[95%] md:w-[560px]", meId, onOpen: open })} className="w-9 h-9 rounded-xl bg-[#09BF641A] text-[#09BF64] flex items-center justify-center">
                <Icon icon="mdi:account-multiple-plus-outline" width={20} />
              </button>
            )}
            <button title="New message" onClick={() => openModal(NewDirectModal, { sizeClass: "w-[95%] md:w-[460px]", meId, onOpen: open })} className="w-9 h-9 rounded-xl bg-[#09BF64] text-white flex items-center justify-center">
              <Icon icon="mdi:pencil-plus-outline" width={20} />
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="relative">
            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#09BF64] text-xl" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search chats and messages…"
              className="w-full h-9 pl-10 pr-3 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ErrorNote error={conversations.error} onRetry={conversations.reload} />
          {conversations.loading && !list.length && <p className="text-center text-[13px] text-[#8E8E9C] py-6">Loading…</p>}
          {!conversations.loading && list.length === 0 && <Empty icon="mdi:chat-outline" text="No conversations yet. Start one with the pencil button." />}
          <ul>
            {filtered.map((c) => {
              const last = c.lastMessage;
              const lastText = last ? (last.deletedAt ? "Message deleted" : `${last.senderId === meId ? "You: " : c.type !== "DIRECT" ? `${nameOf(last.sender).split(" ")[0]}: ` : ""}${last.body}`) : "No messages yet";
              return (
                <li key={c.id}>
                  <button
                    onClick={() => open(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${c.id === activeId ? "bg-[#09BF6414]" : "hover:bg-[#F4F6F9] dark:hover:bg-[#141414]"}`}
                  >
                    <Avatar person={conversationAvatarPerson(c, meId)} size={42} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-[14px] truncate ${c.unread ? "font-bold text-[#0F2418] dark:text-white" : "font-semibold text-[#0F2418] dark:text-[#EFFBF3]"}`}>{conversationTitle(c, meId)}</span>
                        <span className="text-[11px] text-[#8E8E9C] shrink-0">{timeShort(last?.createdAt ?? c.updatedAt)}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-[12px] truncate ${c.unread ? "text-[#0F2418] dark:text-[#EFFBF3]" : "text-[#8E8E9C]"}`}>{lastText}</span>
                        {c.unread > 0 && <span className="bg-[#09BF64] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shrink-0">{c.unread > 99 ? "99+" : c.unread}</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {q.length >= 2 && (
            <div className="border-t border-[#6F7C7426] mt-2">
              <h3 className="text-[11px] font-semibold uppercase text-[#8E8E9C] px-4 pt-3 pb-1">Messages</h3>
              {search.loading && <p className="px-4 text-[12px] text-[#8E8E9C]">Searching…</p>}
              {search.data?.length === 0 && <p className="px-4 pb-3 text-[12px] text-[#8E8E9C]">No messages found.</p>}
              <ul>
                {(search.data ?? []).map((m) => {
                  const conv = list.find((c) => c.id === m.conversationId);
                  return (
                    <li key={m.id}>
                      <button onClick={() => open(m.conversationId)} className="w-full px-4 py-2 text-left hover:bg-[#F4F6F9] dark:hover:bg-[#141414]">
                        <span className="block text-[12px] font-semibold text-[#0F2418] dark:text-[#EFFBF3] truncate">
                          {conv ? conversationTitle(conv, meId) : m.conversation.name ?? "Direct message"} · {nameOf(m.sender)}
                        </span>
                        <span className="block text-[12px] text-[#6F7C74] truncate">{m.body}</span>
                        <span className="block text-[10px] text-[#8E8E9C]">{timeShort(m.createdAt)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className={`${activeId ? "flex" : "hidden md:flex"} flex-1 min-w-0`}>
        {active ? (
          <Thread key={active.id} conversation={active} meId={meId} connected={connected} onBack={() => open(null)} onLeft={() => open(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8E8E9C] gap-3 bg-gray-50 dark:bg-[#141414]">
            <Icon icon="mdi:chat-processing-outline" width={56} className="text-[#09BF64]" />
            <p className="text-[14px]">{activeId && conversations.loading ? "Loading conversation…" : "Select a conversation or start a new one."}</p>
          </div>
        )}
      </main>
    </div>
  );
}
