# Cấu trúc hệ thống Football Championship

Tài liệu này giải thích chi tiết vai trò của từng thành phần và thư mục trong hệ thống **Football Championship System**, bao gồm cả hai phần chính là Backend và Frontend.

Kiến trúc tổng thể của dự án được phân tách rõ ràng (Decoupled Architecture), với Backend đóng vai trò cung cấp API (RESTful) và Frontend đóng vai trò là giao diện người dùng.

---

## 1. BACKEND (FastAPI / Python)

Thư mục `backend/` chứa mã nguồn của máy chủ API. Hệ thống được thiết kế theo mô hình **Layered Architecture** (Kiến trúc phân lớp), giúp tách biệt logic xử lý, truy xuất cơ sở dữ liệu và giao tiếp API.

Toàn bộ mã nguồn chính nằm trong thư mục `backend/app/`.

### Các thư mục và thành phần cốt lõi:

*   **`app/core/` (Cốt lõi & Cấu hình):**
    *   Chứa các thiết lập (settings) chung của toàn bộ ứng dụng (lấy từ biến môi trường `.env`).
    *   Chứa logic khởi tạo kết nối cơ sở dữ liệu (`database.py`).
    *   Chứa các cấu hình bảo mật (`security.py`), ví dụ như thuật toán băm (hashing) mật khẩu và xử lý JWT Token.

*   **`app/models/` (Cơ sở dữ liệu - SQLAlchemy):**
    *   Chứa các Class định nghĩa cấu trúc bảng trong cơ sở dữ liệu (Database Schema).
    *   Sử dụng SQLAlchemy ORM để ánh xạ các đối tượng Python với các bảng thực tế (ví dụ: `User`, `Team`, `Player`, `Match`,...).

*   **`app/schemas/` (Xác thực dữ liệu - Pydantic):**
    *   Chứa các Pydantic Models dùng để xác thực (validate) dữ liệu đầu vào (Request) và định dạng dữ liệu đầu ra (Response) của API.
    *   Đảm bảo rằng dữ liệu client gửi lên là đúng định dạng trước khi xử lý. (Ví dụ: `UserCreate`, `TeamResponse`,...).

*   **`app/repositories/` (Tầng truy xuất dữ liệu):**
    *   Đóng vai trò là cầu nối trực tiếp với cơ sở dữ liệu.
    *   Chứa các hàm thực hiện các truy vấn cơ bản (CRUD: Create, Read, Update, Delete) bằng SQLAlchemy. Lớp này không chứa business logic phức tạp.

*   **`app/services/` (Tầng Business Logic):**
    *   Đây là "bộ não" của Backend. Tầng này sẽ gọi đến các repositories để lấy hoặc lưu dữ liệu, sau đó thực hiện các tính toán, kiểm tra nghiệp vụ (business rules).
    *   Ví dụ: Trong `auth.py` thuộc services, khi người dùng đăng ký, service sẽ kiểm tra xem email đã tồn tại chưa, sau đó băm mật khẩu rồi mới gọi repository để lưu vào DB.

*   **`app/routers/` (Tầng API Endpoints):**
    *   Chứa các định nghĩa API (các đường dẫn URL như `GET /teams`, `POST /players`).
    *   Tiếp nhận HTTP request từ Frontend, gọi đến các `services` tương ứng để xử lý, và trả về HTTP response (kèm theo dữ liệu đã được định dạng bởi `schemas`).

*   **`app/utils/` (Công cụ hỗ trợ):**
    *   Chứa các hàm tiện ích dùng chung (helper functions) không thuộc về một nghiệp vụ cụ thể nào, ví dụ như hàm gửi email (`email.py`).

*   **`app/main.py` (Entry point):**
    *   File chạy chính của ứng dụng FastAPI. Nơi khởi tạo ứng dụng, cấu hình CORS, và khai báo (include) tất cả các routers.

---

## 2. FRONTEND (React / Vite / TypeScript)

Thư mục `frontend/` chứa ứng dụng giao diện người dùng (Single Page Application). Ứng dụng sử dụng React.js kết hợp với TypeScript để đảm bảo tính chặt chẽ về kiểu dữ liệu.

Mã nguồn chính nằm trong thư mục `frontend/src/`.

### Các thư mục và thành phần cốt lõi:

*   **`src/components/` (Các thành phần UI tái sử dụng):**
    *   Chứa các React components có thể dùng lại ở nhiều nơi khác nhau.
    *   `components/common/`: Chứa các thành phần UI cơ bản như `Button`, `Modal`, `Layout`, Sidebar, Header...
    *   `components/forms/`: Chứa các form điền thông tin (ví dụ: Form thêm đội bóng, Form sửa cầu thủ...).

*   **`src/context/` (Quản lý trạng thái toàn cục):**
    *   Sử dụng React Context API để lưu trữ và chia sẻ các state cần thiết trên toàn bộ ứng dụng mà không phải truyền props qua nhiều lớp.
    *   Ví dụ: `AuthContext.tsx` để lưu thông tin đăng nhập của user, `ThemeContext.tsx` để quản lý giao diện Sáng/Tối.

*   **`src/hooks/` (Custom Hooks):**
    *   Chứa các custom React hooks để đóng gói các logic phức tạp.
    *   Ví dụ: `useDebounce.ts` dùng để trì hoãn việc gọi API khi người dùng đang gõ tìm kiếm.

*   **`src/pages/` (Các trang giao diện):**
    *   Mỗi thư mục hoặc file trong này tương ứng với một trang (màn hình) lớn trong ứng dụng, được gắn với một Route cụ thể.
    *   Ví dụ: `Dashboard.tsx` (Trang chủ), `Teams/` (Quản lý đội bóng), `Players/` (Quản lý cầu thủ), `Login.tsx`, `Register.tsx`...

*   **`src/services/` (Giao tiếp API):**
    *   Chứa các file cấu hình và các hàm dùng để gửi HTTP requests lên Backend (sử dụng thư viện `axios`).
    *   Thư mục này giúp tách biệt logic gọi API ra khỏi các components giao diện. Ví dụ: `teams.ts` sẽ chứa các hàm `getTeams()`, `createTeam()`,...
    *   `api.ts`: Nơi khởi tạo instance axios và cấu hình gắn Token tự động vào header của mỗi request.

*   **`src/types/` (Định nghĩa kiểu TypeScript):**
    *   Chứa các `interface` và `type` TypeScript mô tả cấu trúc của các đối tượng dữ liệu trong Frontend.
    *   Các kiểu này thường được thiết kế để khớp chính xác (map 1-1) với các Pydantic `schemas` trả về từ Backend. Ví dụ: `Team`, `Player`, `User`...

*   **`src/App.tsx` (Điều hướng - Routing):**
    *   File thiết lập các đường dẫn (Routes) của ứng dụng bằng `react-router-dom`. Nó định nghĩa URL nào sẽ render `page` nào, và bảo vệ các routes (chỉ cho phép user đã đăng nhập truy cập).

*   **`src/main.tsx` (Entry point):**
    *   Điểm khởi chạy của React, nơi gắn ứng dụng React vào thẻ HTML gốc.

*   **`src/index.css` (Style toàn cục):**
    *   File CSS chính của dự án, nơi import Tailwind CSS và định nghĩa các style tuỳ chỉnh dùng chung.

---

## Tổng kết Flow Hoạt động:

1. Người dùng thao tác trên màn hình (UI) nằm trong `frontend/src/pages/`.
2. UI gọi các hàm API trong `frontend/src/services/`.
3. Request được gửi đến Backend và được tiếp nhận bởi `backend/app/routers/`.
4. Router gọi `backend/app/services/` để thực hiện nghiệp vụ logic.
5. Service tương tác với Database thông qua `backend/app/repositories/`.
6. Dữ liệu được lấy ra, map qua `backend/app/schemas/` rồi trả về cho Frontend dưới dạng JSON.
7. Frontend nhận JSON, cập nhật state và render lại giao diện.
