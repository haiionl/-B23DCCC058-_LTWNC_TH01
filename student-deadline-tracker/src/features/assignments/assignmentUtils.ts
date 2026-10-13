import { FilterStatus } from "../../types";
import type { Assignment, FilterStatus as FilterStatusType } from "../../types";

export function getDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysUntilDeadline(deadline: string, today = new Date()): number {
  const [year, month, day] = deadline.split("-").map(Number);
  const deadlineDate = Date.UTC(year, month - 1, day);
  const currentDate = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Math.round((deadlineDate - currentDate) / 86_400_000);
}

export function isOverdue(assignment: Assignment, today = new Date()): boolean {
  return (
    !assignment.completed && getDaysUntilDeadline(assignment.deadline, today) < 0
  );
}

export function matchesFilter(
  assignment: Assignment,
  filter: FilterStatusType,
  today = new Date(),
): boolean {
  switch (filter) {
    case FilterStatus.INCOMPLETE:
      return !assignment.completed;
    case FilterStatus.OVERDUE:
      return isOverdue(assignment, today);
    case FilterStatus.COMPLETED:
      return assignment.completed;
    case FilterStatus.ALL:
      return true;
  }
}
