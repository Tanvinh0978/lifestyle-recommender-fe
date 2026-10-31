import React, { useState } from 'react';
import { VIETNAM_CITIES } from '../services/cityWeatherService.js';

export default function LoginView({ onLogin, onDemoLogin, onBackToHome, onTriggerToast }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Nữ');
  const [height, setHeight] = useState(163);
  const [weight, setWeight] = useState(51);
  const [healthGoal, setHealthGoal] = useState('fat_loss');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      onTriggerToast?.('Vui lòng nhập địa chỉ email!', 'warning');
      return;
    }

    const finalName = name.trim() || (isRegisterMode ? 'Người dùng mới' : email.split('@')[0]);

    onLogin(finalName, email.trim(), {
      city: city.trim() || 'Hà Nội',
      gender,
      height: Number(height),
      weight: Number(weight),
      healthGoal
    });
  };

  const handleDemoClick = () => {
    onDemoLogin();
  };

  return (
    <div className="login-page-container animate-fade-in">
      {/* Top Back Navigation Bar */}
      <div className="login-top-bar">
        <button
          type="button"
          className="btn-back-home"
          onClick={onBackToHome}
        >
          <span className="arrow-icon">←</span>
          <span>Về trang chủ Wearwell</span>
        </button>

        <div className="login-brand-tag">
          <span className="sparkle-icon">✨</span>
          <span>WEARWELL AI</span>
        </div>
      </div>

      <div className="login-layout-grid">
        {/* ========================================================= */}
        {/* LEFT COLUMN: BRAND HERO & HIGHLIGHTS                      */}
        {/* ========================================================= */}
        <div className="login-hero-card-glass">
          <div className="hero-brand-header">
            <div className="brand-logo-circle">
              <span>✨</span>
            </div>
            <div>
              <h1 className="hero-brand-name">WEARWELL</h1>
              <p className="hero-brand-tagline">AI Personal Stylist & Smart Living</p>
            </div>
          </div>

          <div className="hero-headline-group">
            <h2 className="hero-main-title">
              Định hình phong cách & thể trạng chuẩn đẹp mỗi ngày.
            </h2>
            <p className="hero-sub-description">
              Trợ lý AI phân tích tủ đồ thật, thời tiết thực tế và chỉ số TDEE cá nhân để đưa ra bản phối trang phục cùng thực đơn 4 bữa thuần Việt tối ưu nhất.
            </p>
          </div>

          {/* Feature Value Props */}
          <div className="hero-value-props">
            <div className="value-prop-item">
              <div className="value-icon-box purple">🪄</div>
              <div className="value-text">
                <h4>AI Stylist phối đồ thông minh</h4>
                <p>Tận dụng tối đa các món sẵn có trong tủ đồ, gợi ý điểm hài hòa chuẩn thời trang.</p>
              </div>
            </div>

            <div className="value-prop-item">
              <div className="value-icon-box green">🥗</div>
              <div className="value-text">
                <h4>Dinh dưỡng & Bài tập tại nhà</h4>
                <p>Thực đơn 4 bữa chuẩn vị Việt bám sát calo và giáo án rèn luyện không cần tạ.</p>
              </div>
            </div>

            <div className="value-prop-item">
              <div className="value-icon-box blue">👗</div>
              <div className="value-text">
                <h4>Số hóa tủ đồ trong 1 chạm</h4>
                <p>Lưu trữ hình ảnh trang phục không giới hạn với tài khoản PRO VIP.</p>
              </div>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div className="hero-testimonial-quote">
            <p className="quote-body">
              “Nhờ Wearwell, mình không còn phải đứng phân vân nửa tiếng trước tủ đồ mỗi sáng. AI gợi ý vừa đúng gu lại vừa khớp thời tiết hôm nay!”
            </p>
            <div className="quote-author">
              <div className="author-avatar">ML</div>
              <div>
                <strong>Mai Linh</strong>
                <span>• Thành viên VIP PRO</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LOGIN / REGISTER CARD                       */}
        {/* ========================================================= */}
        <div className="login-form-card-glass">
          {/* Tabs Switcher */}
          <div className="login-tabs-header">
            <button
              type="button"
              className={`login-tab-btn ${!isRegisterMode ? 'active' : ''}`}
              onClick={() => setIsRegisterMode(false)}
            >
              <span>Đăng nhập</span>
            </button>
            <button
              type="button"
              className={`login-tab-btn ${isRegisterMode ? 'active' : ''}`}
              onClick={() => setIsRegisterMode(true)}
            >
              <span>Tạo tài khoản mới</span>
            </button>
          </div>

          <div className="login-form-content">
            <div className="form-header-title">
              <h3>{isRegisterMode ? 'Bắt đầu hành trình cùng Wearwell' : 'Chào mừng bạn quay trở lại'}</h3>
              <p>
                {isRegisterMode
                  ? 'Thiết lập hồ sơ thể trạng để AI cá nhân hóa trang phục và thực đơn chính xác nhất.'
                  : 'Đăng nhập để đồng bộ tủ đồ số và lịch sử phối trang phục của bạn.'}
              </p>
            </div>

            {/* Quick 1-Click Demo Login Banner */}
            <div className="quick-demo-login-box">
              <div className="demo-left-side">
                <span className="demo-lightning-icon">⚡</span>
                <div>
                  <strong>Trải nghiệm nhanh (Khuyến nghị)</strong>
                  <p>Vào ngay với tài khoản mẫu (Mai Linh, 51kg, tủ đồ 6 món)</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-quick-demo-action"
                onClick={handleDemoClick}
              >
                Vào ngay →
              </button>
            </div>

            <div className="login-separator-line">
              <span>HOẶC TIẾP TỤC VỚI EMAIL</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-actual-form">
              {isRegisterMode && (
                <div className="auth-input-group">
                  <label className="auth-input-label">
                    <span>Họ và tên</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="auth-text-field"
                    placeholder="Ví dụ: Nguyễn Mai Linh"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-input-label">
                  <span>Địa chỉ Email</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  className="auth-text-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <div className="label-with-aside">
                  <label className="auth-input-label">
                    <span>Mật khẩu</span>
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      className="link-forgot-pass"
                      onClick={() => onTriggerToast?.('Hệ thống đang ở chế độ đăng nhập không mật khẩu (Passwordless). Bạn có thể đăng nhập trực tiếp!', 'info')}
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="auth-text-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span className="input-helper-tip">
                  💡 Bạn có thể để trống mật khẩu khi trải nghiệm phiên bản hiện tại.
                </span>
              </div>

              {/* Extra Register Fields (Body Metrics) */}
              {isRegisterMode && (
                <div className="register-body-metrics-group animate-fade-in">
                  <div className="metrics-form-row">
                    <div className="auth-input-group">
                      <label className="auth-input-label">Giới tính</label>
                      <select
                        className="auth-select-field"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                      >
                        <option value="Nữ">Nữ</option>
                        <option value="Nam">Nam</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-input-label">Chiều cao (cm)</label>
                      <input
                        type="number"
                        min="120"
                        max="220"
                        className="auth-text-field"
                        value={height}
                        onChange={e => setHeight(Number(e.target.value))}
                      />
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-input-label">Cân nặng (kg)</label>
                      <input
                        type="number"
                        min="30"
                        max="180"
                        className="auth-text-field"
                        value={weight}
                        onChange={e => setWeight(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-input-label">Tỉnh / Thành phố đang ở (Dự báo thời tiết)</label>
                    <input
                      type="text"
                      list="login-cities-list"
                      className="auth-text-field"
                      placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required
                    />
                    <datalist id="login-cities-list">
                      {VIETNAM_CITIES.map(c => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-input-label">Mục tiêu sức khỏe & vóc dáng</label>
                    <select
                      className="auth-select-field"
                      value={healthGoal}
                      onChange={e => setHealthGoal(e.target.value)}
                    >
                      <option value="fat_loss">🔥 Giảm mỡ & Siết dáng (Thâm hụt calo)</option>
                      <option value="muscle_gain">💪 Tăng cơ nạc (Giàu Protein)</option>
                      <option value="maintain">⚖️ Duy trì thể trạng & Sống khỏe (Healthy)</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-login-submit-gradient">
                <span>{isRegisterMode ? 'Tạo tài khoản & Bắt đầu ngay' : 'Đăng nhập vào Wearwell'}</span>
                <span className="btn-arrow-icon">→</span>
                <div className="shimmer-sweep"></div>
              </button>
            </form>

            <div className="login-footer-switch">
              {isRegisterMode ? (
                <p>
                  Đã có tài khoản Wearwell?{' '}
                  <button
                    type="button"
                    className="link-switch-mode"
                    onClick={() => setIsRegisterMode(false)}
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              ) : (
                <p>
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    className="link-switch-mode"
                    onClick={() => setIsRegisterMode(true)}
                  >
                    Tạo tài khoản mới miễn phí
                  </button>
                </p>
              )}
            </div>

            <div className="login-privacy-notice">
              <span>🔒 Dữ liệu cá nhân và hình ảnh tủ đồ của bạn được mã hóa và bảo mật an toàn.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
