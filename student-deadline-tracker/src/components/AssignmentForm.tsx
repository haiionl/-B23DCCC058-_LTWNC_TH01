import { useState, type FormEvent } from "react";
import { PRIORITY_LABELS, Priority } from "../types";
import type { AssignmentFormData, Priority as PriorityType } from "../types";

interface AssignmentFormProps {
  minDate: string;
  onAdd: (assignment: AssignmentFormData) => void;
}

export function AssignmentForm({ minDate, onAdd }: AssignmentFormProps) {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(minDate);
  const [priority, setPriority] = useState<PriorityType>(Priority.MEDIUM);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !title.trim()) {
      setError("Vui lòng nhập môn học và tên bài tập.");
      return;
    }

    onAdd({ subject, title, deadline, priority });
    setSubject("");
    setTitle("");
    setDeadline(minDate);
    setPriority(Priority.MEDIUM);
    setError(null);
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Môn học</span>
        <input
          autoComplete="off"
          maxLength={80}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Ví dụ: Lập trình Web"
          required
          value={subject}
        />
      </label>

      <label className="field">
        <span>Tên bài tập</span>
        <input
          autoComplete="off"
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Bạn cần hoàn thành việc gì?"
          required
          value={title}
        />
      </label>

      <div className="form-row">
        <label className="field">
          <span>Hạn nộp</span>
          <input
            min={minDate}
            onChange={(event) => setDeadline(event.target.value)}
            required
            type="date"
            value={deadline}
          />
        </label>

        <label className="field">
          <span>Độ ưu tiên</span>
          <select
            onChange={(event) => setPriority(event.target.value as PriorityType)}
            value={priority}
          >
            {Object.values(Priority).map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button button-primary form-submit" type="submit">
        <span aria-hidden="true">＋</span>
        Thêm bài tập
      </button>
    </form>
  );
}
