// ==========================================
// Buổi 1: TypeScript nâng cao
// Generic, Utility Types, Type Guard
// ==========================================

// --- Enum & Literal Types ---
export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const FilterStatus = {
  ALL: "all",
  INCOMPLETE: "incomplete",
  OVERDUE: "overdue",
  COMPLETED: "completed",
} as const;

export type FilterStatus = (typeof FilterStatus)[keyof typeof FilterStatus];

// --- Interface chính ---
export interface Assignment {
  id: string;
  subject: string;
  title: string;
  deadline: string; // ISO date string
  priority: Priority;
  completed: boolean;
}

// --- Utility Types ---
// Dùng Omit để tạo type cho form (không cần id và completed)
export type AssignmentFormData = Omit<Assignment, "id" | "completed">;

// Dùng Partial cho việc update
export type AssignmentUpdate = Partial<Omit<Assignment, "id">>;

// Dùng Pick để lấy một số trường
export type AssignmentSummary = Pick<Assignment, "id" | "title" | "completed">;

// Dùng Record cho mapping priority -> label
export type PriorityLabels = Record<Priority, string>;

// --- Generic Types ---
// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic cho list response
export type ListResponse<T> = ApiResponse<T[]>;

// --- Type Guards ---
// Type guard kiểm tra object có phải Assignment không
export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== "object" || obj === null) return false;
  const record = obj as Record<string, unknown>;
  const deadline =
    typeof record.deadline === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.deadline) &&
    !Number.isNaN(Date.parse(`${record.deadline}T00:00:00.000Z`)) &&
    new Date(`${record.deadline}T00:00:00.000Z`)
      .toISOString()
      .startsWith(record.deadline);

  return (
    typeof record.id === "string" &&
    typeof record.subject === "string" &&
    typeof record.title === "string" &&
    deadline &&
    typeof record.priority === "string" &&
    Object.values(Priority).includes(record.priority as Priority) &&
    typeof record.completed === "boolean"
  );
}

// Type guard kiểm tra mảng Assignment
export function isAssignmentArray(arr: unknown): arr is Assignment[] {
  return Array.isArray(arr) && arr.every(isAssignment);
}

// Type guard cho priority
export function isPriority(value: unknown): value is Priority {
  return (
    typeof value === "string" &&
    Object.values(Priority).includes(value as Priority)
  );
}

// --- Constant mappings ---
export const PRIORITY_LABELS: PriorityLabels = {
  [Priority.LOW]: "Thấp",
  [Priority.MEDIUM]: "Trung bình",
  [Priority.HIGH]: "Cao",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: "#52c41a",
  [Priority.MEDIUM]: "#faad14",
  [Priority.HIGH]: "#f5222d",
};

export const FILTER_LABELS: Record<FilterStatus, string> = {
  [FilterStatus.ALL]: "Tất cả",
  [FilterStatus.INCOMPLETE]: "Chưa hoàn thành",
  [FilterStatus.OVERDUE]: "Quá hạn",
  [FilterStatus.COMPLETED]: "Đã hoàn thành",
};
