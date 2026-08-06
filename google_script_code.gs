/**
 * MA NGUON GOOGLE APPS SCRIPT CHO CO NHAN (hoangnhancva86@gmail.com)
 * 
 * HƯỚNG DẪN CÀI ĐẶT 1-CLICK TRÊN GOOGLE DRIVE:
 * 1. Mở một trang Google Sheet mới trên Google Drive của Cô Nhân
 * 2. Đặt tên Sheet là: "BÁO CÁO THỰC HỌC TIẾNG ANH 9 - MRS NHÂN DẮK HÀ"
 * 3. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script
 * 4. Dán toàn bộ mã nguồn bên dưới vào và nhấn Lưu (Save)
 * 5. Nhấn nút "Triển khai" (Deploy) -> "Tạo bản triển khai mới" (New Deployment)
 * 6. Chọn loại: "Ứng dụng web" (Web App)
 *    - Mô tả: Báo cáo học sinh Tiếng Anh 9
 *    - Thực thi dưới dạng: Tôi (email của bạn)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)
 * 7. Nhấn "Triển khai", cấp quyền và Copy URL AppScript dán vào trang Quản Trị Giáo Viên trong App!
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Sheet 1: BÁO CÁO HỌC SINH THỰC HỌC
    var sheet = ss.getSheetByName("DANH_SACH_HOC_SINH");
    if (!sheet) {
      sheet = ss.insertSheet("DANH_SACH_HOC_SINH");
      sheet.appendRow([
        "MÃ HS", "HỌ VÀ TÊN", "LỚP", "TRƯỜNG", "XÃ / THỊ TRẤN",
        "TÊN ĐĂNG NHẬP", "TỔNG GIỜ HỌC (PHÚT)", "SỐ TỪ THUỘC",
        "BÀI TẬP HOÀN THÀNH", "ĐIỂM THI CAO NHẤT", "CẬP NHẬT MỚI NHẤT"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#fef08a");
    }

    var rows = sheet.getDataRange().getValues();
    var rowIndex = -1;

    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] == data.id || rows[i][5] == data.username) {
        rowIndex = i + 1;
        break;
      }
    }

    var rowData = [
      data.id || "",
      data.fullName || "",
      data.className || "",
      data.schoolName || "",
      data.wardCommune || "",
      data.username || "",
      data.totalStudyMinutes || 0,
      data.masteredVocabCount || 0,
      data.completedExercisesCount || 0,
      data.examHighestScore || 0,
      data.lastActiveAt || new Date().toLocaleString("vi-VN")
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
