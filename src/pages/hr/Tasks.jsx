import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { api, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { TaskDetailModal, TaskFormModal } from "@/components/hr/TaskModals";
import { PRIORITIES, STATUSES } from "@/components/hr/taskConstants";
import { Avatar, Badge, Btn, ErrorNote, Page, PageHeader, Panel, SearchInput, Select, StatCard, Table, Tabs } from "@/components/hr/ui";
import { fmtDate, fullName, humanize, useQuery, useDebounce } from "@/components/hr/utils";

const COLUMN_TINT = { TODO: "#A9C2B3", IN_PROGRESS: "#0EA5E9", REVIEW: "#F59E0B", DONE: "#10B981" };
const isOverdue = (t) => t.dueDate && t.status !== "DONE" && new Date(t.dueDate) < new Date();

function TaskCard({ task, onOpen }) {
  const doneSubs = task.subtasks.filter((s) => s.done).length;
  return (
    <div onClick={() => onOpen(task)} className="bg-white dark:bg-[#0D0D0D] rounded-lg p-3 border border-[#6F7C7426] hover:shadow-md cursor-pointer space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3] leading-snug">{task.title}</p>
        <Badge value={task.priority} />
      </div>
      {task.project && <p className="text-[11px] text-[#09BF64] truncate">{task.project.name}</p>}
      <div className="flex items-center justify-between text-[11px] text-[#8E8E9C]">
        <span className={`flex items-center gap-1 ${isOverdue(task) ? "text-[#E5483A] font-semibold" : ""}`}>
          {task.dueDate && (
            <>
              <Icon icon="mdi:calendar-outline" /> {fmtDate(task.dueDate)}
            </>
          )}
        </span>
        <span className="flex items-center gap-2">
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Icon icon="mdi:checkbox-marked-outline" /> {doneSubs}/{task.subtasks.length}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="flex items-center gap-0.5">
              <Icon icon="mdi:comment-outline" /> {task._count.comments}
            </span>
          )}
          {task.assignee && <Avatar person={task.assignee} size={22} />}
        </span>
      </div>
    </div>
  );
}

/** TASK-08: Kanban view; dragging a card changes its status. */
function Board({ tasks, onMove, onOpen }) {
  return (
    <DragDropContext
      onDragEnd={({ draggableId, destination, source }) => {
        if (destination && destination.droppableId !== source.droppableId) onMove(draggableId, destination.droppableId);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {STATUSES.map((status) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-lg p-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-[#09BF6414]" : "bg-[#F4F6F9] dark:bg-[#141414]"}`}
                >
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className="flex items-center gap-2 text-[12px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
                      <span className="w-2 h-2 rounded-full" style={{ background: COLUMN_TINT[status] }} />
                      {humanize(status)}
                    </span>
                    <span className="text-[11px] text-[#8E8E9C]">{col.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.map((t, i) => (
                      <Draggable draggableId={t.id} index={i} key={t.id}>
                        {(p) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                            <TaskCard task={t} onOpen={onOpen} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default function Tasks() {
  const { can } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const view = params.get("view") ?? "mine";
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem("tasks.layout") ?? "board";
    } catch {
      return "board";
    }
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim());
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [overdue, setOverdue] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    try {
      localStorage.setItem("tasks.layout", layout);
    } catch {
      /* storage unavailable */
    }
  }, [layout]);
  useEffect(() => setPage(1), [view, debouncedSearch, priority, status, overdue, layout]);

  // The board shows up to 200 cards; the list view pages through everything.
  const query = { view, search: debouncedSearch, priority, status: layout === "list" ? status : "", overdue: overdue ? "true" : "", page: layout === "board" ? 1 : page, pageSize: layout === "board" ? 200 : 20 };
  const list = useQuery(`/tasks${qs(query)}`);
  const stats = useQuery(`/tasks/stats${view === "mine" ? "?view=mine" : ""}`);
  const reload = () => (list.reload(), stats.reload());
  const [items, setItems] = useState([]);
  useEffect(() => setItems(list.data?.items ?? []), [list.data]);

  const openTask = (t) => openModal(TaskDetailModal, { sizeClass: "w-[95%] md:w-[720px]", taskId: t.id ?? t, onChanged: reload, openModal });
  // Deep link from notifications: /task?id=...
  useEffect(() => {
    const id = params.get("id");
    if (id) {
      openTask(id);
      params.delete("id");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = async (id, newStatus) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, status: newStatus } : t))); // optimistic
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
    } catch (e) {
      toast.error(e);
    }
    reload();
  };

  const s = stats.data;
  const tabs = [
    { key: "mine", label: "Assigned to me" },
    { key: "created", label: "Created by me" },
    { key: "visible", label: can("tasks.view_all") ? "All tasks" : can("tasks.view_team") ? "Team tasks" : "All I can see" },
  ];
  const columns = [
    { header: "Task", body: (t) => <div className="max-w-[320px]"><p className="font-semibold text-[#0F2418] dark:text-[#EFFBF3] truncate">{t.title}</p>{t.project && <p className="text-[11px] text-[#09BF64]">{t.project.name}</p>}</div> },
    { header: "Assignee", body: (t) => (t.assignee ? <span className="flex items-center gap-2"><Avatar person={t.assignee} size={24} />{fullName(t.assignee)}</span> : "—") },
    { header: "Priority", body: (t) => <Badge value={t.priority} /> },
    { header: "Status", body: (t) => <Badge value={t.status} /> },
    { header: "Due", body: (t) => <span className={isOverdue(t) ? "text-[#E5483A] font-semibold" : ""}>{fmtDate(t.dueDate)}</span> },
    { header: "Checklist", body: (t) => (t.subtasks.length ? `${t.subtasks.filter((x) => x.done).length}/${t.subtasks.length}` : "—") },
  ];

  return (
    <Page>
      <PageHeader
        title="Tasks"
        subtitle="Assign, track and complete work"
        actions={can("tasks.create") && <Btn icon="material-symbols:add-rounded" label="New Task" onClick={() => openModal(TaskFormModal, { sizeClass: "w-[95%] md:w-[620px]", onSaved: reload })} />}
      />
      {s && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total" value={s.total} icon="mdi:clipboard-list-outline" />
          <StatCard label="To do" value={s.byStatus.TODO ?? 0} icon="mdi:checkbox-blank-outline" tone="neutral" />
          <StatCard label="In progress" value={s.byStatus.IN_PROGRESS ?? 0} icon="mdi:progress-clock" tone="info" />
          <StatCard label="Done" value={s.byStatus.DONE ?? 0} icon="mdi:check-circle-outline" tone="success" />
          <StatCard label="Overdue" value={s.overdue} icon="mdi:alert-circle-outline" tone="danger" onClick={() => setOverdue((o) => !o)} hint={overdue ? "Filter on — click to clear" : "Click to filter"} />
        </div>
      )}
      <Panel>
        <Tabs tabs={tabs} active={view} onChange={(v) => setParams({ view: v })} />
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between pt-4">
          <div className="flex rounded-md overflow-hidden border border-[#09BF64] w-fit">
            {[
              ["board", "mdi:view-column-outline", "Board"],
              ["list", "mdi:format-list-bulleted", "List"],
            ].map(([k, icon, label]) => (
              <button key={k} onClick={() => setLayout(k)} className={`flex items-center gap-1 px-3 h-9 text-[12px] font-semibold ${layout === k ? "bg-[#09BF64] text-white" : "text-[#09BF64]"}`}>
                <Icon icon={icon} /> {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search tasks…" />
            <Select className="md:w-[150px] h-9" value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="All priorities" options={PRIORITIES.map((p) => ({ value: p, label: humanize(p) }))} />
            {layout === "list" && <Select className="md:w-[150px] h-9" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All statuses" options={STATUSES.map((p) => ({ value: p, label: humanize(p) }))} />}
          </div>
        </div>
        <div className="pt-4">
          <ErrorNote error={list.error} onRetry={list.reload} />
          {layout === "board" ? (
            list.data && <Board tasks={items} onMove={move} onOpen={openTask} />
          ) : (
            <Table columns={columns} rows={list.data?.items} loading={list.loading} page={page} totalPages={list.data?.totalPages} onPageChange={setPage} onRowClick={openTask} emptyText="No tasks match your filters." />
          )}
        </div>
      </Panel>
    </Page>
  );
}
