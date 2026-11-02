import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, wardrobeCount, onOpenAuth, onLogout }) {
  const isPro = user?.plan === 'PRO';
  const remainingAI = isPro ? 'Không giới hạn' : `${Math.max(0, 3 - (user?.aiUsageCount || 0))}/3`;

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP / TABLET TOP HEADER BAR           */}
      {/* ========================================== */}
      <header className="app-top-header">
        <div className="header-inner">
          {/* Logo & Brand Identity */}
          <div className="brand-group" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo.png" alt="Wearwell Logo" className="brand-logo-img" />
            <div className="brand-titles">
              <span className="brand-main-title">WEARWELL</span>
              <span className="brand-sub-title">Fashion & Wellness</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-menu">
            <button
              className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span>Tổng quan</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'wardrobe' ? 'active' : ''}`}
              onClick={() => setActiveTab('wardrobe')}
            >
              <span>Tủ đồ số</span>
              <span className="nav-counter-tag">{wardrobeCount}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'stylist' ? 'active' : ''}`}
              onClick={() => setActiveTab('stylist')}
            >
              <span>Stylist AI</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'nutrition-fitness' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition-fitness')}
            >
              <span>Ăn uống & PT</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>Hồ sơ & BMI</span>
            </button>

            <button
              className={`nav-tab-btn vip-link ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <span>Gói PRO VIP</span>
              <span className="badge-promo-tag">49k</span>
            </button>
          </nav>

          {/* User Account & Quota Widget */}
          <div className="header-right-actions">
            {user ? (
              <div className="user-status-pill">
                {isPro ? (
                  <span className="plan-badge-pro">PRO VIP</span>
                ) : (
                  <span className="plan-badge-free">FREE</span>
                )}

                <div className="ai-quota-counter" title="Số lượt gọi AI còn lại hôm nay">
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
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
