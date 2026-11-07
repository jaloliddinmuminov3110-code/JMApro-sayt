/**
 * JMAPRO.UZ - Saytdan kelgan murojaatlarni Google Sheets jadvaliga yozuvchi skript.
 * Muallif: Jaloliddin Mo'minov
 */

function doPost(e) {
  try {
    // Joriy faol jadval varag'ini olish
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Formadan yuborilgan ma'lumotlarni qabul qilish
    var p = e.parameter;
    var fullName = p.fullName || "Noma'lum";
    var contactInfo = p.contactInfo || "Ko'rsatilmagan";
    var subject = p.subject || "Umumiy";
    var message = p.message || "";
    var date = p.date || new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
    
    // Agar varaq bo'sh bo'lsa (yoki birinchi qator bo'sh bo'lsa), sarlavhalarni avtomatik qo'yish
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Sana va vaqt", "F.I.Sh", "Email / Telegram", "Murojaat mavzusi", "Xabar matni"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#1d4ed8").setFontColor("#ffffff");
    }
    
    // Yangi qator sifatida yozish
    sheet.appendRow([date, fullName, contactInfo, subject, message]);
    
    // Muvaffaqiyatli javob qaytarish
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
