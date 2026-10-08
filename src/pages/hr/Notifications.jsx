import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, qs } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Btn, Empty, ErrorNote, Page, PageHeader, Panel, Tabs } from "@/components/hr/ui";
import { humanize, timeAgo, useQuery } from "@/components/hr/utils";

/** NOT-01 notification center + NOT-05 preferences. */
export default function Notifications() {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const list = useQuery(tab === "prefs" ? null : `/notifications${qs({ page, pageSize: 20, unread: tab === "unread" ? "true" : undefined })}`);
  const prefs = useQuery(tab === "prefs" ? "/notifications/preferences" : null);

  const open = async (n) => {
    if (!n.readAt) await api.post("/notifications/read", { ids: [n.id] }).catch(() => {});
    if (n.link) navigate(n.link);
    else list.reload();
  };
  const markAll = async () => {
    await api.post("/notifications/read", {});
    list.reload();
  };
  const savePref = async (p, change) => {
    const next = prefs.data.map((x) => (x.type === p.type ? { ...x, ...change } : x));
    try {
      await api.put("/notifications/preferences", { preferences: next.map(({ type, inApp, email }) => ({ type, inApp, email })) });
      prefs.reload();
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <Page>
      <PageHeader title="Notifications" actions={tab !== "prefs" && list.data?.unread > 0 && <Btn variant="outline" label="Mark all as read" onClick={markAll} />} />
      <Panel>
        <Tabs
          tabs={[{ key: "all", label: "All" }, { key: "unread", label: "Unread", count: list.data?.unread }, { key: "prefs", label: "Preferences" }]}
          active={tab}
          onChange={(t) => (setTab(t), setPage(1))}
        />
        <div className="pt-3">
          {tab !== "prefs" ? (
            <>
              <ErrorNote error={list.error} onRetry={list.reload} />
              {!list.loading && list.data?.items.length === 0 && <Empty icon="mdi:bell-check-outline" text="You're all caught up." />}
              <ul className="divide-y divide-[#6E7A8626]">
                {(list.data?.items ?? []).map((n) => (
                  <li key={n.id} onClick={() => open(n)} className="flex items-start gap-3 py-3 cursor-pointer hover:bg-[#0088D10A] px-2 rounded">
                    <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.readAt ? "bg-transparent" : "bg-[#0088D1]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] ${n.readAt ? "text-[#6E7A86]" : "text-[#0B1B33] dark:text-[#EEF8FD] font-semibold"}`}>{n.title}</p>
                      {n.body && <p className="text-[13px] text-[#6E7A86] dark:text-[#A9BACB]">{n.body}</p>}
                    </div>
                    <span className="text-[11px] text-[#8E8E9C] whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                  </li>
                ))}
              </ul>
              {list.data?.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-3">
                  <Btn size="sm" variant="outline" label="Newer" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} />
                  <Btn size="sm" variant="outline" label="Older" disabled={page >= list.data.totalPages} onClick={() => setPage((p) => p + 1)} />
                </div>
              )}
            </>
          ) : (
            <>
              <ErrorNote error={prefs.error} onRetry={prefs.reload} />
              <p className="text-[12px] text-[#6E7A86] mb-3">Approval and HR notifications are always delivered in-app. Email delivery will apply once email is configured.</p>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[12px] text-[#8E8E9C]">
                    <th className="py-2">Notification</th>
                    <th>In-app</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {(prefs.data ?? []).map((p) => (
                    <tr key={p.type} className="border-t border-[#6E7A8626]">
                      <td className="py-2 text-[#0B1B33] dark:text-[#EEF8FD]">{humanize(p.type)}</td>
                      <td>
                        <input type="checkbox" className="accent-[#0088D1]" checked={p.inApp} disabled={p.critical} onChange={(e) => savePref(p, { inApp: e.target.checked })} />
                      </td>
                      <td>
                        <input type="checkbox" className="accent-[#0088D1]" checked={p.email} onChange={(e) => savePref(p, { email: e.target.checked })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </Panel>
    </Page>
  );
}
