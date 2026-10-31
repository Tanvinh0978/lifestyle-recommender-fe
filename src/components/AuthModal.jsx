import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin, onDemoLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Nữ');
  const [height, setHeight] = useState(163);
  const [weight, setWeight] = useState(51);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên của bạn!');
      return;
    }
    if (!email.trim()) {
      alert('Vui lòng nhập địa chỉ email!');
      return;
    }

    onLogin(name.trim(), email.trim(), {
      gender,
      height: Number(height),
      weight: Number(weight)
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-glass" onClick={onClose}>
      <div className="modal-dialog-auth-glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="auth-brand-badge">
            <span className="sparkle">✨</span>
            <span>WEARWELL</span>
          </div>
          <button className="modal-close-x" onClick={onClose}>✕</button>
        </div>

        <div className="auth-modal-content">
          <h2 className="auth-title">
            {isRegisterMode ? 'Tạo tài khoản mới' : 'Chào mừng bạn trở lại'}
          </h2>
          <p className="auth-sub">
            Trợ lý AI phong cách và sức khỏe cá nhân hóa hàng đầu dành cho bạn.
          </p>

          {/* Quick Demo Login Option */}
          <div className="demo-login-banner">
            <div className="demo-info">
              <span className="lightning">⚡</span>
              <div>
                <strong>Trải nghiệm nhanh (Khuyến nghị)</strong>
                <p>Đăng nhập ngay với tài khoản mẫu thiết lập sẵn chỉ số</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-demo-quick-login"
              onClick={() => {
                onDemoLogin();
                onClose();
              }}
            >
              Vào ngay →
            </button>
          </div>

          <div className="auth-divider">
            <span>Hoặc điền thông tin</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-body">
            <div className="form-field">
              <label className="field-label">Họ và tên của bạn</label>
              <input
                type="text"
                className="field-input"
                placeholder="Ví dụ: Nguyễn Mai Linh"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">Địa chỉ email</label>
              <input
                type="email"
                className="field-input"
                placeholder="mailinh@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {isRegisterMode && (
              <>
                <div className="form-row-2col">
                  <div className="form-field">
                    <label className="field-label">Giới tính</label>
                    <select
                      className="field-select"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Chiều cao (cm)</label>
                    <input
                      type="number"
                      min="120"
                      max="220"
                      className="field-input"
                      value={height}
                      onChange={e => setHeight(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Cân nặng (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    className="field-input"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-auth-submit-gradient">
              <span>{isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập ngay'}</span>
              <div className="shimmer-sweep"></div>
            </button>
          </form>

          <div className="auth-toggle-mode">
            {isRegisterMode ? (
              <p>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  className="link-toggle"
                  onClick={() => setIsRegisterMode(false)}
                >
                  Đăng nhập
                </button>
              </p>
            ) : (
              <p>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  className="link-toggle"
                  onClick={() => setIsRegisterMode(true)}
                >
                  Tạo tài khoản mới
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
