import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FilterStatus } from "../../types";
import type { AssignmentFormData, FilterStatus as FilterStatusType } from "../../types";
import {
  assignmentAdded,
  assignmentDeleted,
  assignmentToggled,
  fetchAssignments,
} from "./assignmentSlice";
import { getDateInputValue, matchesFilter } from "./assignmentUtils";

export function useAssignments(filter: FilterStatusType) {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.assignments);

  const visibleAssignments = useMemo(
    () => items.filter((assignment) => matchesFilter(assignment, filter)),
    [items, filter],
  );

  const counts = useMemo(
    () => ({
      [FilterStatus.ALL]: items.length,
      [FilterStatus.INCOMPLETE]: items.filter((item) => !item.completed).length,
      [FilterStatus.OVERDUE]: items.filter((item) =>
        matchesFilter(item, FilterStatus.OVERDUE),
      ).length,
      [FilterStatus.COMPLETED]: items.filter((item) => item.completed).length,
    }),
    [items],
  );

  const addAssignment = useCallback(
    (data: AssignmentFormData) => {
      dispatch(
        assignmentAdded({
          ...data,
          subject: data.subject.trim(),
          title: data.title.trim(),
          id: crypto.randomUUID(),
          completed: false,
        }),
      );
    },
    [dispatch],
  );

  const toggleAssignment = useCallback(
    (id: string) => dispatch(assignmentToggled(id)),
    [dispatch],
  );

  const deleteAssignment = useCallback(
    (id: string) => dispatch(assignmentDeleted(id)),
    [dispatch],
  );

  const loadAssignments = useCallback(
    () => dispatch(fetchAssignments()),
    [dispatch],
  );

  return {
    assignments: visibleAssignments,
    allAssignments: items,
    counts,
    status,
    error,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
    loadAssignments,
    today: getDateInputValue(),
  };
}
