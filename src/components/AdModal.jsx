import React, { useState, useEffect } from 'react';

const SAMPLE_ADS = [
  {
    title: 'Bộ sưu tập Thu Đông 2026 - Local Brand Việt',
    sponsor: 'Coolmate / Routine Vietnam',
    tag: 'Thời trang bền vững',
    desc: 'Chất liệu thoáng khí, co giãn 4 chiều tự nhiên, bảo vệ môi trường và tôn dáng tối đa.',
    cta: 'Khám phá ngay',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Eat Clean Chuẩn Vị Việt - Nấu nhanh 15 phút',
    sponsor: 'Healthy Box Daily',
    tag: 'Dinh dưỡng sạch',
    desc: 'Giao nguyên liệu sơ chế tận nơi, tính sẵn Macro & Calo cho từng bữa ăn.',
    cta: 'Nhận ưu đãi 30%',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Thảm tập Yoga & Pilates cao cấp chống trượt',
    sponsor: 'Aura Fitness Gear',
    tag: 'Thể thao tại nhà',
    desc: 'Độ êm ái vượt trội bảo vệ khớp gối, kháng khuẩn và dễ dàng vệ sinh.',
    cta: 'Xem chi tiết',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80'
  }
];

export default function AdModal({ isOpen, onClose, onRewardComplete, remainingAdsToday = 3 }) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [currentAd, setCurrentAd] = useState(SAMPLE_ADS[0]);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(5);
      setCanSkip(false);
      const randomIdx = Math.floor(Math.random() * SAMPLE_ADS.length);
      setCurrentAd(SAMPLE_ADS[randomIdx]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [isOpen, secondsLeft]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    onRewardComplete();
    onClose();
  };

  return (
    <div className="modal-backdrop-glass" onClick={e => e.stopPropagation()}>
      <div className="modal-dialog-ad-card animate-scale-up">
        {/* Header Bar */}
        <div className="ad-modal-header">
          <div className="ad-sponsor-badge">
            <span className="ad-sponsor-icon">📢</span>
            <div>
              <span className="ad-sponsor-label">Tài trợ bởi: <strong>{currentAd.sponsor}</strong></span>
              <span className="ad-remaining-hint">Hôm nay còn {remainingAdsToday} lượt xem nhận quà</span>
            </div>
          </div>

          <div className="ad-timer-countdown">
            {canSkip ? (
              <button className="btn-ad-close" onClick={handleClaimReward} title="Nhận lượt và đóng">
                ✕ Nhận lượt AI
              </button>
            ) : (
              <span className="timer-badge">Đóng sau {secondsLeft}s</span>
            )}
          </div>
        </div>

        {/* Video / Banner Simulated Area */}
        <div className="ad-media-container">
          <img src={currentAd.image} alt={currentAd.title} className="ad-banner-img" />
          <div className="ad-media-overlay">
            <span className="ad-category-pill">{currentAd.tag}</span>
            <div className="ad-sound-indicator">🔊 Quảng cáo có thưởng</div>
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="ad-body-content">
          <h3 className="ad-title">{currentAd.title}</h3>
          <p className="ad-desc">{currentAd.desc}</p>
        </div>

        {/* Footer Actions */}
        <div className="ad-footer-actions">
          <button
            type="button"
            className="btn-ad-cta-link"
            onClick={() => window.open('https://shopee.vn', '_blank')}
          >
            <span>{currentAd.cta}</span>
            <span className="ext-icon">↗</span>
          </button>

          {canSkip ? (
            <button
              type="button"
              className="btn-ad-claim-success"
              onClick={handleClaimReward}
            >
              🎉 Nhận ngay +1 Lượt AI miễn phí
            </button>
          ) : (
            <button type="button" className="btn-ad-waiting" disabled>
              ⏳ Vui lòng xem thêm {secondsLeft}s để nhận lượt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
