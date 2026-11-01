import React, { useState } from 'react';
import { STYLIST_OCCASIONS, STYLIST_WEATHERS } from '../services/aiService.js';
import ProAIChatBox from './ProAIChatBox.jsx';

export default function StylistView({
  user,
  wardrobe,
  onGenerateOutfit,
  outfitResult,
  isLoading,
  onNavigatePricing,
  onOpenAdModal,
  remainingAds = 3,
  onTriggerToast
}) {
  const [selectedOccasion, setSelectedOccasion] = useState(STYLIST_OCCASIONS[0]);
  const [selectedWeather, setSelectedWeather] = useState(STYLIST_WEATHERS[1]); // Dịu mát
  const [prioritizeWardrobe, setPrioritizeWardrobe] = useState(true);
  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState('config'); // 'config' | 'chatbox'

  const isPro = user?.plan === 'PRO';
  const remainingQuota = isPro ? Infinity : Math.max(0, (3 + (user?.adRewardCount || 0)) - (user?.aiUsageCount || 0));

  const handleGenerateClick = () => {
    if (!isPro && remainingQuota <= 0) {
      if (remainingAds > 0) {
        onTriggerToast?.('📺 Bạn đã dùng hết lượt khởi đầu! Hãy xem 1 quảng cáo ngắn để nhận thêm lượt miễn phí.', 'info');
        onOpenAdModal?.();
      } else {
        onTriggerToast?.('🔒 Bạn đã đạt tối đa 3 lượt quảng cáo hôm nay! Nâng cấp PRO VIP để phối đồ không giới hạn.', 'warning');
        onNavigatePricing?.();
      }
      return;
    }

    onGenerateOutfit({
      occasion: selectedOccasion,
      weather: selectedWeather,
      prioritizeWardrobe,
      wardrobeItems: wardrobe,
      userGender: user?.gender || 'Nữ'
    });
  };

  const handleSaveLook = () => {
    setIsOutfitSaved(!isOutfitSaved);
    if (!isOutfitSaved) {
      onTriggerToast?.('🌟 Đã lưu outfit vào Bộ Sưu Tập Cá Nhân!');
    }
  };

  const handleShareLook = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onTriggerToast?.('📋 Đã sao chép liên kết Lookbook vào bộ nhớ tạm!');
    } else {
      onTriggerToast?.('✨ Đã tạo liên kết chia sẻ Lookbook!');
    }
  };

  return (
    <div className="stylist-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HEADER                                                 */}
      {/* ========================================================= */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Stylist AI Phối đồ</h1>
          <p className="page-sub-title">
            Trợ lý thời trang cá nhân AI phân tích vóc dáng, thời tiết tại <strong>{user?.city || 'Hà Nội'}</strong> để tạo nên bản phối hài hòa nhất từ chính tủ đồ của bạn.
          </p>
        </div>

        <div className="header-status-actions">
          <div className="quota-pill-status">
            <span className="lightning-icon">⚡</span>
            <span>Hạn mức hôm nay: <strong>{isPro ? 'Không giới hạn (PRO VIP)' : `Còn ${remainingQuota} lượt`}</strong></span>
          </div>

          {!isPro && remainingAds > 0 && (
            <button
              type="button"
              className="btn-watch-ad-pill"
              onClick={onOpenAdModal}
              title="Xem quảng cáo 5s nhận thêm 1 lượt AI"
            >
              <span>📺</span>
              <span>Xem QC (+1 lượt)</span>
            </button>
          )}
        </div>
      </div>

      {/* VIP Mode Switcher (Chỉ hiển thị khi là thành viên PRO VIP) */}
      {isPro && (
        <div className="vip-tabs-switcher">
          <button
            type="button"
            className={`vip-tab-toggle-btn ${activeTabMode === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('config')}
          >
            <span>🪄 Phối đồ tự động</span>
          </button>
          <button
            type="button"
            className={`vip-tab-toggle-btn ${activeTabMode === 'chatbox' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('chatbox')}
          >
            <span className="sparkle-gold">👑</span>
            <span>Chatbox AI Stylist Trực Tiếp</span>
          </button>
        </div>
      )}

      {/* HIỂN THỊ CHATBOX KHI CHỌN MODE CHATBOX Ở BẢN PRO */}
      {isPro && activeTabMode === 'chatbox' ? (
        <ProAIChatBox user={user} wardrobe={wardrobe} onTriggerToast={onTriggerToast} initialContext="fashion" />
      ) : (
        <>
          {/* ========================================================= */}
          {/* 2. CONFIGURATOR CARD (OCCASIONS, WEATHER, TOGGLE)         */}
          {/* ========================================================= */}
          <div className="stylist-config-card-glass">
        <div className="config-header">
          <div className="config-title-group">
            <span className="config-icon">🪄</span>
            <div>
              <h3>Cấu hình trang phục thông minh</h3>
              <p>Tùy biến nhanh theo thời tiết thực tế và dịp bạn sẽ tham dự</p>
            </div>
          </div>

          {!isPro && (
            <button
              className="btn-link-upgrade"
              onClick={onNavigatePricing}
            >
              Mở khóa không giới hạn lượt AI →
            </button>
          )}
        </div>

        {/* Occasion Chips */}
        <div className="config-section-group">
          <label className="section-label-row">
            <span className="label-icon">💼</span>
            <span>Dịp xuất hiện:</span>
            <span className="selected-value-tag">{selectedOccasion.label}</span>
          </label>
          <div className="chips-horizontal-scroll">
            {STYLIST_OCCASIONS.map(occ => {
              const isActive = selectedOccasion.id === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  className={`stylist-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedOccasion(occ)}
                >
                  <span className="chip-icon">{occ.icon}</span>
                  <span className="chip-name">{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather Chips */}
        <div className="config-section-group">
          <label className="section-label-row">
            <span className="label-icon">🌤️</span>
            <span>Thời tiết hiện tại:</span>
            <span className="selected-value-tag">{selectedWeather.label}</span>
          </label>
          <div className="grid-weathers-3col">
            {STYLIST_WEATHERS.map(w => {
              const isActive = selectedWeather.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  className={`weather-card-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedWeather(w)}
                >
                  <span className="weather-chip-icon">{w.icon}</span>
                  <span className="weather-chip-name">{w.label}</span>
                  <span className="weather-chip-sub">{w.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Prioritize Wardrobe */}
        <div className="wardrobe-priority-toggle-row">
          <div className="toggle-text-side">
            <span className="toggle-main-title">Ưu tiên tủ đồ cá nhân</span>
            <span className="toggle-sub-desc">
              Tối đa hóa các món đồ bạn đã thêm vào ứng dụng ({wardrobe.length} món sẵn có)
            </span>
          </div>

          <label className="switch-control">
            <input
              type="checkbox"
              checked={prioritizeWardrobe}
              onChange={(e) => setPrioritizeWardrobe(e.target.checked)}
            />
            <span className="slider-round"></span>
          </label>
        </div>

        {/* Action Button CTA */}
        <button
          className="btn-generate-outfit-cta"
          onClick={handleGenerateClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="btn-loading-content">
              <span className="spinner-icon">🔄</span>
              <span>Đang phân tích tủ đồ & phối phong cách...</span>
            </div>
          ) : (
            <div className="btn-normal-content">
              <span className="sparkle-symbol">✨</span>
              <span>Phối đồ thông minh ngay</span>
              <div className="shimmer-sweep"></div>
            </div>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3. SKELETON LOADER                                        */}
      {/* ========================================================= */}
      {isLoading && (
        <div className="outfit-skeleton-card-glass animate-pulse">
          <div className="skeleton-line-header"></div>
          <div className="skeleton-grid-slots">
            <div className="skeleton-slot-box"></div>
            <div className="skeleton-slot-box"></div>
            <div className="skeleton-slot-box"></div>
            <div className="skeleton-slot-box"></div>
          </div>
          <div className="skeleton-line-advice"></div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. OUTFIT RESULT LOOKBOOK CARD                            */}
      {/* ========================================================= */}
      {!isLoading && outfitResult && (
        <article className="outfit-result-article-glass animate-fade-in-up">
          {/* Header & Match Score */}
          <div className="result-header-row">
            <div>
              <div className="result-badges-row">
                <span className="tag-lookbook-id">AI LOOKBOOK #249</span>
                {outfitResult.isSimulated && (
                  <span className="tag-simulated-badge">
                    ⚡ {outfitResult.source}
                  </span>
                )}
              </div>
              <h2 className="outfit-result-title">{outfitResult.title}</h2>
              <p className="outfit-result-occasion">
                Thiết kế riêng cho <strong>{outfitResult.occasion}</strong> • Thời tiết <strong>{outfitResult.weather}</strong>
              </p>
            </div>

            <div className="harmony-score-box">
              <div className="score-ring">
                <svg viewBox="0 0 36 36" className="score-svg">
                  <path
                    className="score-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="score-fill"
                    strokeDasharray={`${outfitResult.harmonyScore || 96}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="score-number">{outfitResult.harmonyScore || 96}</span>
              </div>
              <span className="score-label">Điểm hài hòa</span>
            </div>
          </div>

          {/* Outfit Slots List */}
          <div className="outfit-slots-container">
            <h3 className="slots-heading">Danh sách món đồ trong bản phối:</h3>
            <div className="slots-grid-cards">
              {Array.isArray(outfitResult.items) && outfitResult.items.map((slotItem, idx) => (
                <div key={idx} className="slot-item-card-glass">
                  <div className="slot-thumb-wrap">
                    <img
                      src={slotItem.imageUrl}
                      alt={slotItem.name}
                      className="slot-img"
                    />
                    <span className="slot-category-tag">{slotItem.slot}</span>
                  </div>

                  <div className="slot-details">
                    <h4 className="slot-item-name">{slotItem.name}</h4>
                    <span className="slot-color-tag">Tone màu: {slotItem.color}</span>
                    <p className="slot-note-text">{slotItem.note}</p>
                  </div>

                  <div className="slot-status-side">
                    {slotItem.isOwned ? (
                      <span className="badge-owned-pill">
                        <span className="check-dot">✓</span> Đã sở hữu
                      </span>
                    ) : (
                      <span className="badge-suggestion-pill">
                        <span>✨</span> Gợi ý phối mới
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Item Shopping Suggestion */}
          {outfitResult.missingSuggestion && (
            <div className="missing-item-banner-glass">
              <div className="missing-left-side">
                <span className="missing-tag">MÓN ĐỒ CÒN THIẾU ĐỂ HOÀN THIỆN</span>
                <h4 className="missing-name">{outfitResult.missingSuggestion.name}</h4>
                <p className="missing-reason">{outfitResult.missingSuggestion.reason}</p>
              </div>

              <div className="missing-right-side">
                <div className="price-tag-group">
                  <span className="price-label">Giá tham khảo:</span>
                  <span className="price-value">{outfitResult.missingSuggestion.estimatedPrice || '189.000₫'}</span>
                </div>
                <button
                  className="btn-shopee-link"
                  onClick={() => window.open('https://shopee.vn', '_blank')}
                >
                  <span>Tìm tại {outfitResult.missingSuggestion.storeSuggestion || 'Shopee Mall'}</span>
                  <span className="external-icon">↗</span>
                </button>
              </div>
            </div>
          )}

          {/* Stylist Advice Callout */}
          <div className="stylist-advice-box-glass">
            <div className="stylist-avatar-icon">💡</div>
            <div className="stylist-advice-text">
              <span className="stylist-advice-title">Lời khuyên từ Stylist AI</span>
              <p className="stylist-quote">{outfitResult.stylingAdvice || outfitResult.stylingTip}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="outfit-actions-footer">
            <button
              className={`btn-action-pill ${isOutfitSaved ? 'active' : ''}`}
              onClick={handleSaveLook}
            >
              <span>{isOutfitSaved ? '❤️ Đã lưu set đồ' : '🤍 Lưu set đồ này'}</span>
            </button>
            <button
              className="btn-action-pill"
              onClick={handleShareLook}
            >
              <span>🔗 Chia sẻ Lookbook</span>
            </button>
            <button
              className="btn-action-pill re-generate"
              onClick={handleGenerateClick}
            >
              <span>🔄 Thử phối bản khác</span>
            </button>
          </div>
        </article>
      )}
      </>
      )}
    </div>
  );
}
