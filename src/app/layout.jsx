import './globals.css';
import '../App.css';

export const metadata = {
  title: 'Wearwell - Nền Tảng Định Hình Phong Cách & Sức Khỏe AI',
  description: 'Wearwell - Trợ lý AI Stylist phối đồ thông minh từ tủ đồ cá nhân và AI PT & Nutritionist thiết kế thực đơn thuần Việt, lịch tập luyện chuẩn thể hình trong tích tắc.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
