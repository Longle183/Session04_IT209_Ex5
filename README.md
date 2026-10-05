# Báo Cáo Bài Tập 5: Khôi Phục Trạng Thái và Đảo Ngược Commit (Reset vs Revert)

- **Môn học**: DevOps / Git Version Control
- **Mã bài tập**: Session 04 - Exercise 5 (ex5)
- **Công nghệ dự án**: HTML5 & Vanilla JavaScript
- **Học viên**: Longle183
- **Repository**: [https://github.com/Longle183/Session04_IT209_Ex5](https://github.com/Longle183/Session04_IT209_Ex5)

---

## 1. Mục tiêu bài tập

1. Thực hành **`git reset`** để khôi phục lịch sử cục bộ khi commit sai chưa đẩy lên remote.
2. Thực hành **`git revert`** để đảo ngược thay đổi một cách an toàn trên nhánh chung (đã push lên remote).
3. Phân biệt rõ sự khác nhau giữa hai cơ chế trong ngữ cảnh làm việc cá nhân và làm việc nhóm.

---

## 2. Bối cảnh dự án

Dự án là ứng dụng quản lý công việc **TaskFlow** (HTML + Vanilla JS) gồm các tính năng:
- Thêm / xóa nhiệm vụ
- Lọc theo trạng thái (đang làm / đã xong)
- Tìm kiếm theo từ khóa
- Sắp xếp theo thứ tự mới nhất / cũ nhất

Trong quá trình phát triển, lập trình viên tạo ra **2 commit chứa lỗi** để thực hành hai kỹ thuật sửa lỗi khác nhau.

---

## 3. Trường hợp 1: Git Reset (Sửa lỗi cục bộ — Chưa push)

### Tình huống
Commit `feat: add experimental task sorting algorithm (buggy)` chứa hàm `sortTasksBuggy()` sử dụng biến `undefinedVariable` gây crash ứng dụng. Commit này **chưa được push lên remote**.

### Yêu cầu
Lùi HEAD về commit trước, giữ lại mã nguồn ở Working Directory dạng **Unstaged** để viết lại — không được làm mất code (không dùng `--hard`).

### Thực hiện

**Bước 1:** Xem lịch sử trước khi reset
```bash
git log --oneline -n 5
```
```
d0bafa0 feat: add experimental task sorting algorithm (buggy)
a07ec09 feat: add filter and search functionality
68eff2a feat: initialize task management web app with HTML and JS
```

**Bước 2:** Thực hiện `git reset --mixed` (mặc định)
```bash
git reset HEAD~1
```
```
Unstaged changes after reset:
M	app.js
```

**Bước 3:** Kiểm tra trạng thái
```bash
git status
```
```
On branch main
Changes not staged for commit:
        modified:   app.js

no changes added to commit
```

> ✅ **Kết quả:** HEAD lùi lại 1 commit. File `app.js` nằm trong Working Directory dạng **Modified (Unstaged)**. Mã nguồn được giữ nguyên để viết lại — không mất code.

**Bước 4:** Viết lại hàm sắp xếp đúng rồi commit lại
```bash
git add app.js
git commit -m "fix: rewrite sortTasks with correct logic after reset"
```
```
[main 2bab311] fix: rewrite sortTasks with correct logic after reset
 1 file changed, 16 insertions(+), 3 deletions(-))
```

---

## 4. Trường hợp 2: Git Revert (Sửa lỗi công cộng — Đã push)

### Tình huống
Commit `feat: update delete function (critical bug - deletes all tasks)` chứa lỗi nghiêm trọng: hàm `deleteTask()` xóa toàn bộ danh sách thay vì chỉ xóa task được chọn. Commit này **đã được push lên remote** và đồng đội có thể đã pull về.

### Yêu cầu
Không được dùng `reset` (sẽ phá lịch sử chung). Phải tạo **một commit mới** đảo ngược thay đổi để đẩy lên remote an toàn.

### Thực hiện

**Bước 1:** Xác nhận commit lỗi đã có trên remote
```bash
git log --oneline -n 4
```
```
aad26b3 feat: update delete function (critical bug - deletes all tasks)
2bab311 fix: rewrite sortTasks with correct logic after reset
a07ec09 feat: add filter and search functionality
68eff2a feat: initialize task management web app with HTML and JS
```

**Bước 2:** Thực hiện `git revert`
```bash
git revert HEAD --no-edit
```
```
[main 7cd81dc] Revert "feat: update delete function (critical bug - deletes all tasks)"
 Date: Tue Oct 6 00:03:29 2026 +0700
 1 file changed, 5 insertions(+), 4 deletions(-)
```

**Bước 3:** Đẩy commit Revert lên remote
```bash
git push origin main
```
```
To https://github.com/Longle183/Session04_IT209_Ex5
   aad26b3..7cd81dc  main -> main
```

**Bước 4:** Kiểm tra lịch sử commit
```bash
git log --oneline -n 6
```
```
7cd81dc Revert "feat: update delete function (critical bug - deletes all tasks)"  ← REVERT MỚI
aad26b3 feat: update delete function (critical bug - deletes all tasks)            ← commit lỗi (vẫn còn)
2bab311 fix: rewrite sortTasks with correct logic after reset                      ← fix sau reset
a07ec09 feat: add filter and search functionality
68eff2a feat: initialize task management web app with HTML and JS
```

> ✅ **Kết quả:** Commit `7cd81dc` với tiêu đề **`Revert "..."`** xuất hiện đầu nhánh. Lịch sử cũ được bảo toàn hoàn toàn. Đã push lên remote thành công mà không cần `force push`.

---

## 5. Ảnh chụp lịch sử commit — Minh chứng Revert thành công

Xem trực quan tại file [`git_log_preview.html`](./git_log_preview.html) trong repository.

```
$ git log --oneline -n 6

7cd81dc  Revert "feat: update delete function (critical bug - deletes all tasks)"  [REVERT ✓]
aad26b3  feat: update delete function (critical bug - deletes all tasks)            [BUG]
2bab311  fix: rewrite sortTasks with correct logic after reset                      [FIX]
a07ec09  feat: add filter and search functionality
68eff2a  feat: initialize task management web app with HTML and JS
```

---

## 6. So sánh Git Reset vs Git Revert

| Tiêu chí | `git reset` | `git revert` |
|---|---|---|
| **Cơ chế** | Di chuyển con trỏ HEAD về commit cũ | Tạo **commit mới** đảo ngược thay đổi |
| **Lịch sử commit** | Bị xóa / thay đổi | Được bảo toàn hoàn toàn |
| **Tác động remote** | Không nên dùng nếu đã push (cần `--force`) | An toàn, push bình thường |
| **Phù hợp khi nào** | Commit chưa push, làm việc cá nhân | Commit đã push, làm việc nhóm |
| **Rủi ro với nhóm** | ❌ Cao — phá lịch sử chung | ✅ Thấp — không ảnh hưởng đồng đội |
| **Các chế độ** | `--soft`, `--mixed` (mặc định), `--hard` | Luôn tạo commit nghịch đảo |
| **Khả năng rollback** | Cần dùng `git reflog` để phục hồi | Dễ: revert lại commit Revert |

---

## 7. Phân biệt khi làm việc cá nhân vs làm việc nhóm

### 🧑‍💻 Làm việc cá nhân (local)
**Dùng `git reset`** khi commit sai **chưa push** lên remote:
- Nhanh chóng, không tạo thêm commit thừa
- Chọn mức độ giữ file: `--soft` (staged) / `--mixed` (unstaged) / `--hard` (xóa hẳn)
- Hoàn toàn an toàn vì chỉ ảnh hưởng máy bản thân

```bash
git reset HEAD~1           # mixed: giữ code dạng unstaged
git reset --soft HEAD~1    # soft: giữ code dạng staged
git reset --hard HEAD~1    # hard: XÓA code (nguy hiểm!)
```

### 👥 Làm việc nhóm (shared branch)
**Dùng `git revert`** khi commit lỗi **đã push** lên nhánh chung:
- Không phá lịch sử, đồng đội không bị ảnh hưởng
- Tạo commit rõ ràng ghi lại lý do và thời điểm đảo ngược
- Push lên remote ngay bằng `git push` thông thường — không cần `--force`

```bash
git revert HEAD             # revert commit mới nhất
git revert <commit-hash>    # revert một commit cụ thể
```

> ⚠️ **Lưu ý quan trọng:** Tuyệt đối **không dùng `git reset --hard` hoặc `git push --force`** trên nhánh `main`/`master` chung. Hành động này sẽ xóa lịch sử của mọi thành viên, gây mất code và xung đột nghiêm trọng.

---

## 8. Kết quả kiểm tra

| Kiểm tra | Lệnh | Kết quả |
|---|---|---|
| Case 1 — Reset | `git status` sau reset | `modified: app.js` (Unstaged) ✅ |
| Case 2 — Revert | `git log --oneline -n 5` | Commit `Revert "..."` đứng đầu nhánh ✅ |

Cả hai trường hợp đều đáp ứng đúng yêu cầu và ràng buộc của bài tập.
