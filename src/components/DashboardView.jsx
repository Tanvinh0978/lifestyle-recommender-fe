import React, { useState } from 'react';
import { getCityWeather } from '../services/cityWeatherService.js';

export default function DashboardView({
  user,
  wardrobeCount,
  onNavigate,
  onAddWater,
  waterConsumed,
  waterTarget = 2200,
  dailyCalorieTarget = 1820,
  caloriesConsumed = 1450,
  onOpenAdModal,
  remainingAds = 3,
  onTriggerToast
}) {
  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [isOutfitLiked, setIsOutfitLiked] = useState(false);

  const cityWeather = getCityWeather(user?.city || 'Hà Nội');

  const isPro = user?.plan === 'PRO';
  const aiUsed = user?.aiUsageCount || 0;
  const wardrobeMax = isPro ? 'Vô hạn' : 8;

  const waterProgress = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));
  const calorieProgress = Math.min(100, Math.round((caloriesConsumed / dailyCalorieTarget) * 100));
  const wardrobeProgress = isPro ? 100 : Math.min(100, Math.round((wardrobeCount / 8) * 100));

  const handleSaveLookbook = () => {
    setIsOutfitSaved(!isOutfitSaved);
    if (!isOutfitSaved) {
      onTriggerToast?.('🌟 Đã lưu outfit hôm nay vào Lịch Phong Cách tuần này!');
    }
  };

  const handleToggleLike = () => {
    setIsOutfitLiked(!isOutfitLiked);
    if (!isOutfitLiked) {
      onTriggerToast?.('❤️ Đã thêm bản phối Casual Chic vào danh sách Yêu Thích!');
    }
  };

  return (
    <div className="dashboard-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. GREETING & WEATHER WIDGET                             */}
      {/* ========================================================= */}
      <section className="dashboard-greeting-section">
        <div className="greeting-header-row">
          <div className="greeting-text-group">
            <h1 className="greeting-title">
              Chào mừng đến Wearwell
              <span className="sparkle-icon">✨</span>
            </h1>
            <p className="greeting-subtitle">
              {cityWeather.desc} tại <strong>{user?.city || 'Hà Nội'}</strong> — hoàn hảo cho một ngày tràn đầy cảm hứng và năng lượng tích cực!
            </p>
          </div>

          <div className="weather-pill-badge" onClick={() => onNavigate('profile')} title="Bấm để đổi thành phố nơi bạn ở">
            <span className="weather-icon">{cityWeather.icon}</span>
            <div className="weather-text">
              <span className="weather-temp">{cityWeather.name} {cityWeather.temp}</span>
              <span className="weather-desc">{cityWeather.weather} (Đổi vị trí ✎)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FREEMIUM QUOTA / PRO VIP BANNER                       */}
      {/* ========================================================= */}
      {!isPro ? (
        <section className="quota-banner-glass">
          <div className="quota-ambient-glow"></div>
          <div className="quota-banner-content">
            <div className="quota-header-row">
              <div className="quota-badge-group">
                <span className="tag-free-member">FREE MEMBER</span>
                <span className="quota-title">Hạn mức thông minh hôm nay</span>
              </div>
              <span className="tag-today-pill">Cập nhật 00:00 hàng ngày</span>
            </div>

            <div className="quota-metrics-row">
              <div className="quota-info-item">
                <div className="quota-labels">
                  <span>Lượt gọi Stylist & Fitness AI:</span>
                  <strong>{aiUsed} / {3 + (user?.adRewardCount || 0)} lượt ({remainingAds} lượt QC còn lại)</strong>
                </div>
                <div className="progress-track-mini">
                  <div
                    className="progress-fill-purple"
                    style={{ width: `${Math.min(100, (aiUsed / (3 + (user?.adRewardCount || 0))) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="quota-info-item">
                <div className="quota-labels">
                  <span>Kho trang phục tủ đồ:</span>
                  <strong>{wardrobeCount} / 8 món FREE</strong>
                </div>
                <div className="progress-track-mini">
                  <div
                    className={`progress-fill-purple ${wardrobeCount >= 8 ? 'danger' : ''}`}
                    style={{ width: `${wardrobeProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="banner-dual-actions">
              <button
                className="btn-banner-upgrade-pro"
                onClick={() => onNavigate('pricing')}
              >
                <div className="btn-upgrade-left">
                  <span className="crown-icon">👑</span>
                  <span className="btn-upgrade-text">
                    Nâng cấp PRO VIP chỉ 49.000đ/tháng
                  </span>
                </div>
                <div className="btn-upgrade-right">
                  <span>Mở khóa không giới hạn</span>
                  <span className="arrow-icon">→</span>
                </div>
                <div className="shimmer-effect"></div>
              </button>

              {remainingAds > 0 && (
                <button
                  type="button"
                  className="btn-banner-watch-ad"
                  onClick={onOpenAdModal}
                  title="Xem quảng cáo ngắn 5s nhận thêm 1 lượt AI"
                >
                  <span>📺 Xem quảng cáo (+1 lượt AI miễn phí)</span>
                </button>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="pro-active-banner-glass">
          <div className="pro-banner-inner">
            <div className="pro-badge-group">
              <span className="crown-vip">👑</span>
              <div>
                <h4>Tài khoản PRO VIP đang kích hoạt</h4>
                <p>Bạn đang sử dụng không giới hạn lượt AI, tủ đồ số vô hạn và các phân tích chuyên sâu.</p>
              </div>
            </div>
            <span className="status-active-pill">Đang hoạt động</span>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 3. KPI METRICS CARDS (CALO, NƯỚC, TẬP LUYỆN, TỦ ĐỒ)     */}
      {/* ========================================================= */}
      <section className="kpi-cards-grid">
        {/* Calo nạp vào */}
        <div className="kpi-card-glass">
          <div className="kpi-card-header">
            <span className="kpi-label">Calo nạp vào</span>
            <div className="kpi-icon-pill green">
              <span>🔥</span>
            </div>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-numbers">
              <span className="kpi-primary-val">{caloriesConsumed.toLocaleString()}</span>
              <span className="kpi-unit">/ {dailyCalorieTarget.toLocaleString()} kcal</span>
            </div>
            <div className="kpi-ring-wrapper">
              <svg className="kpi-svg-ring" viewBox="0 0 36 36">
                <path
                  className="ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                />
                <path
                  className="ring-progress green"
                  strokeDasharray={`${calorieProgress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="ring-center-text">{calorieProgress}%</span>
            </div>
          </div>
          <div className="kpi-status-tag green">
            <span>📈 Đạt nhịp tối ưu</span>
          </div>
        </div>

        {/* Nước uống */}
        <div className="kpi-card-glass">
          <div className="kpi-card-header">
            <span className="kpi-label">Nước uống</span>
            <button
              className="btn-add-water-quick"
              onClick={onAddWater}
              title="Nhấn để cộng thêm 250ml nước"
            >
              <span>+ 250ml</span>
            </button>
          </div>
          <div className="kpi-card-body-stacked">
            <div className="kpi-numbers">
              <span className="kpi-primary-val">{(waterConsumed / 1000).toFixed(1)}</span>
              <span className="kpi-unit">/ {(waterTarget / 1000).toFixed(1)} Lít</span>
            </div>
            <div className="progress-track-card">
              <div
                className="progress-fill-blue"
                style={{ width: `${waterProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="kpi-status-tag blue">
            <span>💧 {waterProgress >= 100 ? 'Đã đủ lượng nước ngày' : 'Cần thêm ~2 cốc'}</span>
          </div>
        </div>

        {/* Tập luyện */}
        <div className="kpi-card-glass">
          <div className="kpi-card-header">
            <span className="kpi-label">Tập luyện</span>
            <div className="kpi-icon-pill purple">
              <span>💪</span>
            </div>
          </div>
          <div className="kpi-card-body-stacked">
            <div className="kpi-numbers">
              <span className="kpi-primary-val">{user?.workoutMinutesCompleted || 25}</span>
              <span className="kpi-unit">/ 35 phút</span>
            </div>
            <div className="kpi-sub-desc">Cardio & Giãn cơ buổi sáng</div>
            <div className="progress-track-card">
              <div
                className="progress-fill-purple"
                style={{ width: '71%' }}
              ></div>
            </div>
          </div>
          <div className="kpi-status-tag purple">
            <span>⏱️ Hoàn thành 71%</span>
          </div>
        </div>

        {/* Tủ đồ số */}
        <div className="kpi-card-glass">
          <div className="kpi-card-header">
            <span className="kpi-label">Tủ đồ số cá nhân</span>
            <div className={`kpi-icon-pill ${wardrobeCount >= 8 && !isPro ? 'orange' : 'purple'}`}>
              <span>👗</span>
            </div>
          </div>
          <div className="kpi-card-body-stacked">
            <div className="kpi-numbers">
              <span className="kpi-primary-val">{wardrobeCount}</span>
              <span className="kpi-unit">/ {wardrobeMax} món</span>
            </div>
            <div className="progress-track-card">
              <div
                className={`progress-fill-purple ${wardrobeCount >= 8 && !isPro ? 'orange' : ''}`}
                style={{ width: `${wardrobeProgress}%` }}
              ></div>
            </div>
          </div>
          <div className={`kpi-status-tag ${wardrobeCount >= 8 && !isPro ? 'orange' : 'green'}`}>
            {isPro ? (
              <span>✨ Không giới hạn</span>
            ) : wardrobeCount >= 8 ? (
              <span>⚠️ Đã đầy kho FREE</span>
            ) : (
              <span>👗 Còn {8 - wardrobeCount} chỗ trống</span>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FEATURED DAILY OUTFIT LOOKBOOK (AI CURATED)            */}
      {/* ========================================================= */}
      <section className="dashboard-outfit-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <span className="section-icon">🪄</span>
            <h2>Gợi ý Outfit hôm nay</h2>
          </div>
          <span className="badge-match-rate">98% Hợp thời tiết & vóc dáng</span>
        </div>

        <div className="outfit-featured-card-glass">
          <div className="outfit-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
              alt="Gợi ý outfit thanh lịch hôm nay"
              className="outfit-featured-img"
            />
            <div className="outfit-image-overlay"></div>
            <div className="outfit-overlay-details">
              <div className="outfit-overlay-text">
                <span className="tag-ai-curated">Stylist AI Curated</span>
                <h3 className="outfit-name-overlay">Casual Chic: Công sở & Cà phê chiều</h3>
              </div>
              <button
                className={`btn-favorite-circle ${isOutfitLiked ? 'liked' : ''}`}
                onClick={handleToggleLike}
                title="Yêu thích phối đồ này"
              >
                <span>{isOutfitLiked ? '❤️' : '🤍'}</span>
              </button>
            </div>
          </div>

          <div className="outfit-composition-content">
            <div className="composition-header">
              <span className="checkroom-icon">👕</span>
              <span>
                Phối từ <strong>2 món trong tủ đồ</strong> + 1 gợi ý hoàn thiện:
              </span>
            </div>

            <div className="composition-chips-list">
              <span className="chip-outfit-item owned">
                <span className="dot green"></span> Sơ mi lụa lavender
              </span>
              <span className="chip-outfit-item owned">
                <span className="dot green"></span> Culottes be sữa
              </span>
              <span className="chip-outfit-item suggestion">
                <span className="dot purple"></span> Loafers kem (+240k)
              </span>
            </div>

            <div className="outfit-action-buttons">
              <button
                className="btn-secondary-pill"
                onClick={() => onNavigate('stylist')}
              >
                <span>👁️</span> Chi tiết phối đồ
              </button>
              <button
                className={`btn-primary-gradient-pill ${isOutfitSaved ? 'saved' : ''}`}
                onClick={handleSaveLookbook}
              >
                <span>📅</span> {isOutfitSaved ? 'Đã lưu lịch tuần' : 'Lưu lịch tuần'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. NUTRITION & HABIT CARD                                 */}
      {/* ========================================================= */}
      <section className="dashboard-nutrition-habits-section">
        <div className="section-title-row">
          <div className="title-with-icon">
            <span className="section-icon">🥗</span>
            <h2>Dinh dưỡng & Thói quen</h2>
          </div>
          <span className="badge-sub-pill">Lịch hôm nay</span>
        </div>

        <div className="nutrition-meal-snapshot-card">
          <div className="meal-thumbnail-box">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"
              alt="Món ăn dinh dưỡng"
              className="meal-thumb-img"
            />
            <span className="meal-tag-time">Trưa</span>
          </div>
          <div className="meal-details">
            <div className="meal-category-row">
              <span className="tag-eatclean">Eat Clean Chuẩn Vị</span>
              <span className="tag-calories-count">520 kcal</span>
            </div>
            <h4 className="meal-title">Cơm lứt ức gà nướng bơ mè</h4>
            <p className="meal-desc">Giàu protein, cân bằng năng lượng bền bỉ cho buổi chiều.</p>
          </div>
          <button
            className="btn-view-nutrition"
            onClick={() => onNavigate('nutrition-fitness')}
          >
            <span>Chi tiết</span>
          </button>
        </div>

        {/* Habit items */}
        <div className="habits-checklist-group">
          <div className="habit-row-item completed">
            <div className="habit-icon-status">✓</div>
            <div className="habit-text">
              <span className="habit-name line-through">Pilates eo thon & Giãn cơ 20 phút</span>
              <span className="habit-time">Đã hoàn thành lúc 07:15 sáng</span>
            </div>
            <span className="habit-energy-tag">+140 kcal</span>
          </div>

          <div className="habit-row-item active">
            <div className="habit-icon-status progress">🚶</div>
            <div className="habit-text">
              <span className="habit-name">Mục tiêu 5.000 bước chân mỗi ngày</span>
              <span className="habit-time">Đang diễn ra: 3.820 / 5.000 bước</span>
            </div>
            <span className="habit-percent-tag">76%</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. QUICK ACTION SHORTCUTS (LỐI TẮT NHANH)                 */}
      {/* ========================================================= */}
      <section className="quick-actions-bar">
        <span className="quick-action-label">Lối tắt nhanh</span>
        <div className="quick-action-buttons-scroll">
          <button
            className="btn-quick-pill"
            onClick={() => onNavigate('wardrobe')}
          >
            <span>📸</span> Thêm đồ vào tủ
          </button>
          <button
            className="btn-quick-pill highlighted"
            onClick={() => onNavigate('stylist')}
          >
            <span>🪄</span> Hỏi Stylist AI
          </button>
          <button
            className="btn-quick-pill"
            onClick={() => onNavigate('nutrition-fitness')}
          >
            <span>🥗</span> Thực đơn hôm nay
          </button>
          <button
            className="btn-quick-pill"
            onClick={() => onNavigate('profile')}
          >
            <span>⚖️</span> Tính BMI & TDEE
          </button>
        </div>
      </section>
    </div>
  );
}
