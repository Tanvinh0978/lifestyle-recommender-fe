import React from 'react';

export default function Footer({ setActiveTab, onOpenAdModal, user }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-brand-header" onClick={() => setActiveTab && setActiveTab('dashboard')}>
            <div className="footer-brand-badge">
              <span>✨</span>
            </div>
            <div className="footer-brand-titles">
              <span className="footer-brand-name">WEARWELL</span>
              <span className="footer-brand-slogan">AI Stylist & Smart Living</span>
            </div>
          </div>
          <p className="footer-desc">
            Nền tảng cố vấn thời trang số và quản trị lối sống thông minh ứng dụng Trí tuệ Nhân tạo. 
            Cá nhân hóa trang phục theo tủ đồ thực tế, thời tiết tức thì và mục tiêu thể hình của bạn.
          </p>
          <div className="footer-system-status">
            <span className="status-dot"></span>
            <span>Hệ thống AI Gemini & Dịch vụ hoạt động ổn định</span>
          </div>
        </div>

        {/* Column 1: Tính năng */}
        <div className="footer-links-col">
          <h4 className="footer-heading">Tính năng cốt lõi</h4>
          <ul className="footer-list">
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('stylist')}>
                🪄 AI Stylist phối đồ thông minh
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('wardrobe')}>
                👗 Tủ đồ số cá nhân
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('nutrition-fitness')}>
                🥗 Thực đơn & Lịch tập PT
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('dashboard')}>
                ⛅ Gợi ý trang phục theo thời tiết
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('profile')}>
                📊 Tính toán BMI, BMR & Nước uống
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Hội viên & Hỗ trợ */}
        <div className="footer-links-col">
          <h4 className="footer-heading">Hội viên & Gói cước</h4>
          <ul className="footer-list">
            <li>
              <button type="button" className="highlight-link" onClick={() => setActiveTab && setActiveTab('pricing')}>
                👑 Gói PRO VIP không giới hạn (49k)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onOpenAdModal && onOpenAdModal()}>
                📺 Xem quảng cáo nhận thêm lượt AI
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab && setActiveTab('profile')}>
                👤 Hồ sơ cá nhân & Thể trạng
              </button>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Dữ liệu cá nhân và hình ảnh tủ đồ của bạn được bảo mật tuyệt đối theo tiêu chuẩn mã hóa.'); }}>
                🛡️ Chính sách bảo mật dữ liệu
              </a>
            </li>
            <li>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Wearwell cung cấp các gợi ý phong cách sống thông minh dựa trên thông tin người dùng cung cấp.'); }}>
                📋 Điều khoản dịch vụ
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Dự án & Đội ngũ */}
        <div className="footer-links-col">
          <h4 className="footer-heading">Dự án Wearwell</h4>
          <p className="footer-contact-info">
            <strong>Dự án Khởi nghiệp:</strong> EXE101 Project<br />
            <strong>Đội ngũ:</strong> Wearwell Innovators<br />
            <strong>Liên hệ:</strong> support@wearwell.ai<br />
            <strong>Phiên bản:</strong> v2.4 PRO Edition
          </p>
          <div className="footer-social-row">
            <span className="social-badge" title="Facebook">FB</span>
            <span className="social-badge" title="Instagram">IG</span>
            <span className="social-badge" title="TikTok">TT</span>
            <span className="social-badge" title="GitHub">GH</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>WEARWELL AI</strong>. Tất cả các quyền được bảo lưu.
          </p>
          <p className="footer-disclaimer">
            Gợi ý trang phục và dinh dưỡng được tối ưu hóa tự động bằng AI nhằm nâng tầm phong cách sống mỗi ngày.
          </p>
        </div>
      </div>
    </footer>
  );
}
