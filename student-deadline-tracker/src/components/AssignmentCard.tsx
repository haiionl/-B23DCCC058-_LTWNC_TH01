import {
  PRIORITY_LABELS,
  Priority,
} from "../types";
import type { Assignment } from "../types";
import { getDaysUntilDeadline } from "../features/assignments/assignmentUtils";

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityClass: Record<Priority, string> = {
  [Priority.LOW]: "priority-low",
  [Priority.MEDIUM]: "priority-medium",
  [Priority.HIGH]: "priority-high",
};

function formatDeadline(deadline: string): string {
  const [year, month, day] = deadline.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AssignmentCard({
  assignment,
  onToggle,
  onDelete,
}: AssignmentCardProps) {
  const daysLeft = getDaysUntilDeadline(assignment.deadline);
  const overdue = daysLeft < 0;
  const timeLabel = overdue
    ? `Quá hạn ${Math.abs(daysLeft)} ngày`
    : daysLeft === 0
      ? "Hạn nộp hôm nay"
      : `Còn ${daysLeft} ngày`;

  return (
    <article
      className={`assignment-card${assignment.completed ? " is-completed" : ""}`}
    >
      <button
        aria-label={
          assignment.completed
            ? `Bỏ đánh dấu hoàn thành: ${assignment.title}`
            : `Đánh dấu hoàn thành: ${assignment.title}`
        }
        aria-pressed={assignment.completed}
        className={`completion-toggle${assignment.completed ? " checked" : ""}`}
        onClick={() => onToggle(assignment.id)}
        type="button"
      >
        {assignment.completed && <span aria-hidden="true">✓</span>}
      </button>

      <div className="assignment-content">
        <div className="assignment-heading">
          <span className="subject-name">{assignment.subject}</span>
          <span className={`priority-badge ${priorityClass[assignment.priority]}`}>
            <span className="priority-dot" aria-hidden="true" />
            {PRIORITY_LABELS[assignment.priority]}
          </span>
        </div>
        <h3 className={assignment.completed ? "title-completed" : ""}>
          {assignment.title}
        </h3>
        <div className="assignment-meta">
          <span className="deadline-date">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="4.5"
                width="14"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6.5 2.5v4M13.5 2.5v4M3 8.5h14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
            {formatDeadline(assignment.deadline)}
          </span>
          <span
            className={`deadline-countdown${overdue ? " countdown-overdue" : ""}${daysLeft === 0 ? " countdown-today" : ""}`}
          >
            {timeLabel}
          </span>
        </div>
      </div>

      <button
        aria-label={`Xóa bài tập: ${assignment.title}`}
        className="delete-button"
        onClick={() => onDelete(assignment.id)}
        title="Xóa bài tập"
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 6h12m-10.5 0 .7 10.1a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9L14.5 6M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6m-4 3v4m4-4v4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </article>
  );
}
