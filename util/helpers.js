export default class Helpers {
  static generateOrderId() {
    // Lấy ngày giờ hiện tại
    const currentDate = new Date();

    // Tạo phần ngày tháng năm
    const datePart = `${(currentDate.getFullYear() % 100)
      .toString()
      .padStart(2, "0")}${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}`;

    // Tạo chuỗi ngẫu nhiên và đảm bảo duy nhất bằng cách kết hợp Date.now()
    const randomPart = (
      Math.random().toString(36).substr(2, 5) + Date.now().toString(36)
    )
      .toUpperCase()
      .substr(0, 7);

    // Kết hợp phần ngày tháng năm và phần ngẫu nhiên để tạo Order ID
    const orderId = `${datePart}-${randomPart}`;

    return orderId;
  }

  static formatNumber(number) {
    if (number < 1000) {
      return number.toString().padStart(3, "0");
    } else {
      const a = Math.floor(number / 1000);
      const b = Math.floor((number % 1000) / 100);
      return `${a},${b}k`;
    }
  }
}
