import React, { useState, useEffect } from 'react';
import { PLANS, paymentService } from '../services/paymentService.js';

export default function PricingView({
  user,
  onUpgradeSuccess,
  onTriggerToast
}) {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentState, setPaymentState] = useState('PENDING'); // 'PENDING' | 'VERIFYING' | 'SUCCESS' | 'FAILED'
  const [verificationError, setVerificationError] = useState(null);
  const [verifiedTransactionId, setVerifiedTransactionId] = useState(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60);

  const isPro = user?.plan === 'PRO';

  // Countdown timer for QR payment
  useEffect(() => {
    let timer;
    if (isQrModalOpen && paymentState === 'PENDING' && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            setPaymentState('FAILED');
            setVerificationError('Đơn hàng đã hết hạn sau 15 phút. Vui lòng tạo mã QR thanh toán mới.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQrModalOpen, paymentState, timeLeftSeconds]);

  const handleOpenPayment = () => {
    const order = paymentService.createPaymentOrder(user);
    setPaymentOrder(order);
    setPaymentState('PENDING');
    setVerificationError(null);
    setTimeLeftSeconds(15 * 60);
    setIsQrModalOpen(true);
  };

  const handleVerifyPayment = async (forceOutcome = null) => {
    setPaymentState('VERIFYING');
    setVerificationError(null);

    try {
      // Tuân thủ quy tắc: Gọi service xác minh qua máy chủ / chữ ký số
      const result = await paymentService.verifyPaymentWithServer(
        paymentOrder.orderId,
        user?.email,
        forceOutcome
      );

      if (result.verified) {
        setVerifiedTransactionId(result.transactionId);
        setPaymentState('SUCCESS');
        onUpgradeSuccess?.();
        onTriggerToast?.('🎉 Xác thực thành công! Bạn đã được nâng cấp lên Gói PRO VIP toàn diện.');
      } else {
        setPaymentState('FAILED');
        setVerificationError(result.error || 'Chưa tìm thấy giao dịch ngân hàng khớp lệnh. Vui lòng kiểm tra lại!');
      }
    } catch {
      setPaymentState('FAILED');
      setVerificationError('Lỗi kết nối tới máy chủ xác thực ngân hàng. Vui lòng thử lại!');
    }
  };

  const formatCountdown = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pricing-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HEADER                                                 */}
      {/* ========================================================= */}
      <div className="pricing-header-center">
        <span className="pricing-mini-badge">BẢNG GIÁ DỊCH VỤ MINH BẠCH</span>
        <h1 className="pricing-title">
          Đầu tư cho phong cách & sức khỏe đỉnh cao
        </h1>
        <p className="pricing-desc">
          Bắt đầu miễn phí hoặc nâng cấp gói PRO VIP chỉ với <strong>49.000 VNĐ/tháng</strong> (~1.600đ/ngày) để mở khóa toàn bộ sức mạnh của AI Stylist & PT.
        </p>

        {/* Toggle Billing cycle */}
        <div className="billing-cycle-switch">
          <button
            className={`cycle-btn ${selectedBillingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setSelectedBillingCycle('monthly')}
          >
            Thanh toán theo tháng
          </button>
          <button
            className={`cycle-btn ${selectedBillingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setSelectedBillingCycle('yearly')}
          >
            Theo năm (Tiết kiệm 20%)
            <span className="badge-discount-tag">-20%</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PRICING COMPARISON CARDS                               */}
      {/* ========================================================= */}
      <div className="pricing-cards-grid">
        {/* FREE TIER CARD */}
        <div className={`pricing-card-glass ${!isPro ? 'current-plan' : ''}`}>
          <div className="plan-card-header">
            <span className="plan-badge-type">Gói Cơ Bản</span>
            <h3 className="plan-name">{PLANS.FREE.name}</h3>
            <div className="plan-price-row">
              <span className="plan-amount">0₫</span>
              <span className="plan-period">/ trọn đời</span>
            </div>
            <p className="plan-brief">Dành cho người mới làm quen với việc theo dõi vóc dáng và phong cách cá nhân.</p>
          </div>

          <div className="plan-divider"></div>

          <ul className="plan-features-list">
            {PLANS.FREE.features.map((feat, idx) => (
              <li key={idx} className={`feature-item ${feat.included ? 'included' : 'excluded'}`}>
                <span className="feature-icon">{feat.included ? '✓' : '✕'}</span>
                <span className="feature-text">{feat.text}</span>
              </li>
            ))}
          </ul>

          <div className="plan-card-footer">
            {!isPro ? (
              <button className="btn-plan-action current" disabled>
                Gói hiện tại của bạn
              </button>
            ) : (
              <button className="btn-plan-action outline" disabled>
                Bản miễn phí
              </button>
            )}
          </div>
        </div>

        {/* PRO VIP CARD */}
        <div className={`pricing-card-glass pro-featured ${isPro ? 'current-plan' : ''}`}>
          <div className="pro-popular-ribbon">👑 ĐƯỢC ƯA CHUỘNG NHẤT</div>
          <div className="plan-card-header">
            <span className="plan-badge-type vip">PRO VIP TỐI THƯỢNG</span>
            <h3 className="plan-name">{PLANS.PRO.name}</h3>
            <div className="plan-price-row">
              <span className="plan-amount">
                {selectedBillingCycle === 'monthly' ? '49.000₫' : '39.000₫'}
              </span>
              <span className="plan-period">/ tháng</span>
            </div>
            <p className="plan-brief">
              Mở khóa không giới hạn tủ đồ và gọi AI Stylist & Nutritionist siêu tốc mọi lúc mọi nơi.
            </p>
          </div>

          <div className="plan-divider"></div>

          <ul className="plan-features-list">
            {PLANS.PRO.features.map((feat, idx) => (
              <li key={idx} className={`feature-item ${feat.highlight ? 'highlight' : ''}`}>
                <span className="feature-icon check-glow">✓</span>
                <span className="feature-text">{feat.text}</span>
              </li>
            ))}
          </ul>

          <div className="plan-card-footer">
            {isPro ? (
              <button className="btn-plan-action current-vip" disabled>
                👑 Đang sử dụng Gói PRO VIP
              </button>
            ) : (
              <button
                className="btn-plan-action upgrade-glow"
                onClick={handleOpenPayment}
              >
                <span>⚡ Nâng cấp PRO VIP (49.000₫)</span>
                <div className="shimmer-sweep"></div>
              </button>
            )}
            <span className="secure-payment-note">🔒 Quét VietQR chuyển khoản tự động 24/7</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TRUST BADGES & FAQ                                     */}
      {/* ========================================================= */}
      <div className="pricing-trust-section">
        <div className="trust-item">
          <span className="trust-icon">⚡</span>
          <h4>Kích hoạt tự động tức thì</h4>
          <p>Hệ thống tự động kích hoạt tài khoản PRO ngay sau khi nhận tiền qua VietQR.</p>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🛡️</span>
          <h4>Bảo mật thông tin 100%</h4>
          <p>Không lưu thông tin thẻ tín dụng, giao dịch trực tiếp qua App ngân hàng an toàn.</p>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔄</span>
          <h4>Hỗ trợ 24/7 & Hủy linh hoạt</h4>
          <p>Bạn không bị trói buộc hợp đồng, có thể gia hạn hoặc dừng bất cứ lúc nào.</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. VIETQR PAYMENT CHECKOUT MODAL                          */}
      {/* ========================================================= */}
      {isQrModalOpen && paymentOrder && (
        <div className="modal-backdrop-glass" onClick={() => setIsQrModalOpen(false)}>
          <div className="modal-dialog-qr-checkout" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-with-badge">
                <span className="crown-mini">👑</span>
                <h3>Thanh toán Gói PRO VIP qua VietQR</h3>
              </div>
              <button className="modal-close-x" onClick={() => setIsQrModalOpen(false)}>✕</button>
            </div>

            {/* STATE: PENDING (Chờ quét mã) */}
            {paymentState === 'PENDING' && (
              <div className="qr-checkout-body">
                <div className="qr-countdown-strip">
                  <span>⏱️ Mã QR hết hạn sau: <strong>{formatCountdown(timeLeftSeconds)}</strong></span>
                </div>

                <div className="qr-image-card">
                  <img
                    src={paymentOrder.qrUrl}
                    alt="VietQR Chuyển khoản"
                    className="vietqr-code-img"
                  />
                  <div className="qr-instruction-badge">
                    Mở App Ngân hàng bất kỳ (MB, VCB, Tech, MoMo...) và Quét mã QR
                  </div>
                </div>

                <div className="transfer-details-box">
                  <div className="transfer-detail-row">
                    <span className="lbl">Ngân hàng:</span>
                    <strong className="val">{paymentOrder.bankName}</strong>
                  </div>
                  <div className="transfer-detail-row">
                    <span className="lbl">Số tài khoản:</span>
                    <strong className="val text-primary copyable">
                      {paymentOrder.accountNumber}
                    </strong>
                  </div>
                  <div className="transfer-detail-row">
                    <span className="lbl">Chủ tài khoản:</span>
                    <strong className="val">{paymentOrder.accountName}</strong>
                  </div>
                  <div className="transfer-detail-row">
                    <span className="lbl">Số tiền:</span>
                    <strong className="val price-highlight">{paymentOrder.amountFormatted}</strong>
                  </div>
                  <div className="transfer-detail-row">
                    <span className="lbl">Nội dung chuyển tiền:</span>
                    <strong className="val memo-code">{paymentOrder.memo}</strong>
                  </div>
                </div>

                {/* Nút xác nhận chuyển khoản */}
                <div className="qr-action-buttons">
                  <button
                    className="btn-confirm-transferred"
                    onClick={() => handleVerifyPayment()}
                  >
                    <span>✓ Tôi đã chuyển khoản - Xác thực ngay</span>
                  </button>

                  {/* Kịch bản mô phỏng kiểm tra tính bảo mật */}
                  <div className="test-verification-options">
                    <span className="test-title">Chế độ thử nghiệm kiến trúc xác minh:</span>
                    <div className="test-buttons-row">
                      <button
                        type="button"
                        className="btn-test-outcome success"
                        onClick={() => handleVerifyPayment('success')}
                      >
                        Thử kịch bản: Thành công (Server Verified)
                      </button>
                      <button
                        type="button"
                        className="btn-test-outcome failure"
                        onClick={() => handleVerifyPayment('failure')}
                      >
                        Thử kịch bản: Thất bại (Chưa khớp lệnh)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STATE: VERIFYING (Đang gọi API kiểm tra) */}
            {paymentState === 'VERIFYING' && (
              <div className="verifying-state-box">
                <div className="spinner-large">🔄</div>
                <h4>Đang liên hệ cổng thanh toán ngân hàng...</h4>
                <p>Hệ thống đang đối soát mã giao dịch <strong>{paymentOrder.orderId}</strong> với sao kê ngân hàng. Quá trình mất khoảng vài giây.</p>
              </div>
            )}

            {/* STATE: SUCCESS (Đã xác minh bởi máy chủ) */}
            {paymentState === 'SUCCESS' && (
              <div className="success-state-box animate-scale-up">
                <div className="success-icon-badge">🎉</div>
                <h3>Xác thực thanh toán thành công!</h3>
                <p className="success-sub">
                  Chào mừng bạn đến với cộng đồng người dùng <strong>WEARWELL PRO VIP</strong>!
                </p>

                <div className="transaction-receipt-box">
                  <div className="receipt-row">
                    <span>Mã giao dịch xác minh:</span>
                    <strong>{verifiedTransactionId}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Gói đăng ký:</span>
                    <strong>PRO VIP 1 Tháng</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Số tiền xác nhận:</span>
                    <strong className="green-text">49.000 VNĐ</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Quyền lợi:</span>
                    <strong>Tủ đồ vô hạn & Groq AI không giới hạn</strong>
                  </div>
                </div>

                <button
                  className="btn-start-using-pro"
                  onClick={() => setIsQrModalOpen(false)}
                >
                  🚀 Bắt đầu trải nghiệm PRO VIP ngay
                </button>
              </div>
            )}

            {/* STATE: FAILED (Giao dịch không thành công hoặc lỗi) */}
            {paymentState === 'FAILED' && (
              <div className="failed-state-box animate-shake">
                <div className="failed-icon-badge">⚠️</div>
                <h3>Chưa thể xác minh giao dịch</h3>
                <p className="failed-sub">
                  {verificationError || 'Hệ thống chưa tìm thấy khoản chuyển 49.000đ khớp với nội dung giao dịch.'}
                </p>

                <div className="troubleshoot-tips">
                  <h5>Gợi ý xử lý:</h5>
                  <ul>
                    <li>Kiểm tra xem bạn đã nhập đúng nội dung chuyển khoản: <code>{paymentOrder.memo}</code> chưa.</li>
                    <li>Đôi khi hệ thống Napas ngân hàng bị trễ từ 1-2 phút.</li>
                  </ul>
                </div>

                <div className="failed-buttons-row">
                  <button
                    className="btn-retry-verification"
                    onClick={() => handleVerifyPayment()}
                  >
                    🔄 Thử xác minh lại
                  </button>
                  <button
                    className="btn-back-to-qr"
                    onClick={() => setPaymentState('PENDING')}
                  >
                    Quay lại mã QR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
