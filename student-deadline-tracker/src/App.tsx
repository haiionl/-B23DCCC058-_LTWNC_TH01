import { useEffect, useState } from "react";
import { AssignmentCard } from "./components/AssignmentCard";
import { AssignmentForm } from "./components/AssignmentForm";
import { FILTER_OPTIONS, Filter } from "./components/AssignmentFilter";
import { FilterStatus } from "./types";
import type { FilterStatus as FilterStatusType } from "./types";
import { useAssignments } from "./features/assignments/useAssignments";

const summaryItems = [
  { filter: FilterStatus.ALL, label: "Tổng bài tập", icon: "▤", tone: "violet" },
  {
    filter: FilterStatus.INCOMPLETE,
    label: "Chưa hoàn thành",
    icon: "◷",
    tone: "blue",
  },
  { filter: FilterStatus.OVERDUE, label: "Quá hạn", icon: "!", tone: "orange" },
  {
    filter: FilterStatus.COMPLETED,
    label: "Đã hoàn thành",
    icon: "✓",
    tone: "green",
  },
] as const;

function App() {
  const [activeFilter, setActiveFilter] = useState<FilterStatusType>(
    FilterStatus.ALL,
  );
  const {
    assignments,
    allAssignments,
    counts,
    status,
    error,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
    loadAssignments,
    today,
  } = useAssignments(activeFilter);

  useEffect(() => {
    if (status === "idle") void loadAssignments();
  }, [loadAssignments, status]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a aria-label="Deadline Buddy - Trang chủ" className="brand" href="#">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <rect
                x="4"
                y="7"
                width="28"
                height="25"
                rx="7"
                fill="currentColor"
              />
              <path
                d="M11 4v7m14-7v7M4 14h28"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <path
                d="m12 22 4 4 8-8"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </span>
          <span>
            <strong>deadline</strong>
            <span className="brand-light">buddy</span>
          </span>
        </a>
        <div className="topbar-note">
          <span className="online-dot" />
          Không bỏ lỡ deadline nào nữa
        </div>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">KHÔNG GIAN HỌC TẬP CỦA BẠN</p>
          <h1>
            Chào bạn! <span aria-hidden="true">👋</span>
          </h1>
          <p className="welcome-copy">
            Giữ mọi deadline trong tầm mắt, hoàn thành từng việc một.
          </p>
        </div>
        <div className="today-card">
          <span className="today-icon" aria-hidden="true">
            ✦
          </span>
          <span>
            <span className="today-label">HÔM NAY</span>
            <strong>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </strong>
          </span>
        </div>
      </section>

      <section aria-label="Tổng quan bài tập" className="summary-grid">
        {summaryItems.map((item) => (
          <article className="summary-card" key={item.filter}>
            <span className={`summary-icon ${item.tone}`} aria-hidden="true">
              {item.icon}
            </span>
            <span className="summary-text">
              <span>{item.label}</span>
              <strong>{counts[item.filter]}</strong>
            </span>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section aria-labelledby="form-title" className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">BẮT ĐẦU LÊN KẾ HOẠCH</p>
              <h2 id="form-title">Thêm bài tập</h2>
            </div>
            <span className="heading-illustration" aria-hidden="true">
              ✎
            </span>
          </div>
          <p className="panel-description">
            Ghi lại deadline mới để bạn luôn chủ động.
          </p>
          <AssignmentForm minDate={today} onAdd={addAssignment} />
          <div className="form-tip">
            <span aria-hidden="true">✦</span>
            Mẹo nhỏ: Ưu tiên việc quan trọng trước nhé!
          </div>
        </section>

        <section aria-labelledby="assignments-title" className="panel list-panel">
          <div className="list-heading">
            <div>
              <p className="eyebrow">THEO DÕI TIẾN ĐỘ</p>
              <h2 id="assignments-title">Bài tập của bạn</h2>
            </div>
            <span className="assignment-total">{allAssignments.length} bài tập</span>
          </div>

          <Filter.Root
            activeFilter={activeFilter}
            counts={counts}
            onFilterChange={setActiveFilter}
          >
            {FILTER_OPTIONS.map((filter) => (
              <Filter.Tab key={filter} value={filter} />
            ))}
          </Filter.Root>

          {status === "failed" && (
            <div className="error-message" role="alert">
              <span>{error}</span>
              <button
                className="retry-button"
                onClick={() => void loadAssignments()}
                type="button"
              >
                Thử lại
              </button>
            </div>
          )}

          {status === "loading" && allAssignments.length === 0 ? (
            <div aria-live="polite" className="loading-state">
              <span className="spinner" />
              <p>Đang tải danh sách bài tập...</p>
            </div>
          ) : assignments.length > 0 ? (
            <div aria-live="polite" className="assignment-list">
              {assignments.map((assignment) => (
                <AssignmentCard
                  assignment={assignment}
                  key={assignment.id}
                  onDelete={deleteAssignment}
                  onToggle={toggleAssignment}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">✦</span>
              <h3>
                {allAssignments.length === 0
                  ? "Chưa có bài tập nào"
                  : "Không có bài tập phù hợp"}
              </h3>
              <p>
                {allAssignments.length === 0
                  ? "Thêm deadline đầu tiên của bạn ở biểu mẫu bên cạnh nhé."
                  : "Hãy thử chọn một bộ lọc khác."}
              </p>
            </div>
          )}
        </section>
      </div>

      <footer className="footer">
        <span>deadline buddy</span>
        <span>Học tập nhẹ nhàng, deadline trong tầm tay.</span>
      </footer>
    </main>
  );
}

export default App;
