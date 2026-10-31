import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, wardrobeCount, onOpenAuth, onLogout }) {
  const isPro = user?.plan === 'PRO';
  const remainingAI = isPro ? 'Vô hạn' : `${Math.max(0, 3 - (user?.aiUsageCount || 0))}/3`;

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP / TABLET TOP HEADER BAR           */}
      {/* ========================================== */}
      <header className="app-top-header">
        <div className="header-inner">
          {/* Logo & Brand Identity */}
          <div className="brand-group" onClick={() => setActiveTab('dashboard')}>
            <div className="brand-badge-icon">
              <span>✨</span>
            </div>
            <div className="brand-titles">
              <span className="brand-main-title">WEARWELL</span>
              <span className="brand-sub-title">AI Stylist & Smart Living</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-menu">
            <button
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span>Tổng quan</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'wardrobe' ? 'active' : ''}`}
              onClick={() => setActiveTab('wardrobe')}
            >
              <span className="nav-icon">👗</span>
              <span>Tủ đồ số</span>
              <span className="nav-counter-tag">{wardrobeCount}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'stylist' ? 'active' : ''}`}
              onClick={() => setActiveTab('stylist')}
            >
              <span className="nav-icon">🪄</span>
              <span>Stylist AI</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'nutrition-fitness' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition-fitness')}
            >
              <span className="nav-icon">🥗</span>
              <span>Ăn uống & PT</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span>Hồ sơ & BMI</span>
            </button>

            <button
              className={`nav-tab-btn vip-link ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <span className="nav-icon">👑</span>
              <span>Gói PRO VIP</span>
              <span className="badge-promo-tag">49k</span>
            </button>
          </nav>

          {/* User Account & Quota Widget */}
          <div className="header-right-actions">
            {user ? (
              <div className="user-status-pill">
                {isPro ? (
                  <span className="plan-badge-pro">👑 PRO VIP</span>
                ) : (
                  <span className="plan-badge-free">FREE</span>
                )}

                <div className="ai-quota-counter" title="Số lượt gọi AI còn lại hôm nay">
                  <span className="lightning-icon">⚡</span>
                  <span>{remainingAI}</span>
                </div>

                <div
                  className="user-avatar-pill"
                  onClick={() => setActiveTab('profile')}
                  title="Xem và chỉnh sửa hồ sơ sức khỏe"
                >
                  <div className="user-avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-display-name">{user.name}</span>
                </div>

                {!isPro && (
                  <button
                    className="btn-quick-upgrade"
                    onClick={() => setActiveTab('pricing')}
                  >
                    Nâng PRO
                  </button>
                )}

                <button
                  className="btn-header-logout"
                  onClick={onLogout}
                  title="Đăng xuất"
                >
                  🚪
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <button className="btn-login-outline" onClick={onOpenAuth}>
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE FLOATING BOTTOM DOCK NAVIGATION     */}
      {/* ========================================== */}
      <nav className="mobile-floating-nav-dock">
        <div className="dock-container">
          <button
            className={`dock-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="dock-icon">auto_awesome_mosaic</span>
            <span className="dock-label">Tổng quan</span>
          </button>

          <button
            className={`dock-tab-item ${activeTab === 'wardrobe' ? 'active' : ''}`}
            onClick={() => setActiveTab('wardrobe')}
          >
            <span className="dock-icon">checkroom</span>
            <span className="dock-label">Tủ đồ</span>
          </button>

          <button
            className={`dock-tab-item ${activeTab === 'stylist' ? 'active' : ''}`}
            onClick={() => setActiveTab('stylist')}
          >
            <div className="dock-icon-wrapper">
              <span className="dock-icon">magic_button</span>
              <span className="dock-glow-dot"></span>
            </div>
            <span className="dock-label">Stylist AI</span>
          </button>

          <button
            className={`dock-tab-item ${activeTab === 'nutrition-fitness' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition-fitness')}
          >
            <span className="dock-icon">vital_signs</span>
            <span className="dock-label">Sức khỏe</span>
          </button>

          <button
            className={`dock-tab-item ${activeTab === 'profile' || activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="dock-icon">workspace_premium</span>
            <span className="dock-label">Hồ sơ VIP</span>
          </button>
        </div>
      </nav>
    </>
  );
}
