// ==========================================
// API giả lập — trả về danh sách bài tập mẫu
// ==========================================
import { Priority, isAssignmentArray } from "../../types";
import type { Assignment } from "../../types";
import type { ApiResponse } from "../../types";

function dateFromToday(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const mockAssignments: unknown = [
  {
    id: "1",
    subject: "Lập trình Web nâng cao",
    title: "Bài tập Redux Toolkit",
    deadline: dateFromToday(2),
    priority: Priority.HIGH,
    completed: false,
  },
  {
    id: "2",
    subject: "Cơ sở dữ liệu",
    title: "Thiết kế ERD cho hệ thống quản lý",
    deadline: dateFromToday(5),
    priority: Priority.MEDIUM,
    completed: false,
  },
  {
    id: "3",
    subject: "Trí tuệ nhân tạo",
    title: "Cài đặt thuật toán A*",
    deadline: dateFromToday(-3),
    priority: Priority.HIGH,
    completed: true,
  },
  {
    id: "4",
    subject: "Lập trình Web nâng cao",
    title: "Báo cáo Design Pattern",
    deadline: dateFromToday(7),
    priority: Priority.LOW,
    completed: false,
  },
  {
    id: "5",
    subject: "Mạng máy tính",
    title: "Lab Wireshark - Phân tích gói tin",
    deadline: dateFromToday(-1),
    priority: Priority.MEDIUM,
    completed: false,
  },
  {
    id: "6",
    subject: "Toán rời rạc",
    title: "Bài tập đồ thị chương 5",
    deadline: dateFromToday(12),
    priority: Priority.LOW,
    completed: false,
  },
];

// Hàm giả lập fetch API — trả về Promise, delay 800ms
export const fetchAssignmentsAPI = (): Promise<ApiResponse<Assignment[]>> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isAssignmentArray(mockAssignments)) {
        reject(new Error("Dữ liệu bài tập mẫu không hợp lệ."));
        return;
      }

      resolve({
        data: mockAssignments,
        status: 200,
        message: "Lấy danh sách bài tập thành công",
      });
    }, 500);
  });
