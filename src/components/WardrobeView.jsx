import React, { useState } from 'react';
import { WARDROBE_CATEGORIES, POPULAR_COLORS, CURATED_PRESETS } from '../services/wardrobeService.js';
import { communityOutfitService, OUTFIT_CONTEXTS } from '../services/communityOutfitService.js';

export default function WardrobeView({
  wardrobe,
  user,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onNavigatePricing,
  onTriggerToast,
  onSyncCloud,
  onNavigateCommunity
}) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Áo');
  const [formColor, setFormColor] = useState('Trắng');
  const [formNotes, setFormNotes] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const isPro = user?.plan === 'PRO';
  const currentCount = wardrobe.length;
  const isLimitReached = !isPro && currentCount >= 8;

  // Mix & Match (Tự phối đồ từ tủ cá nhân & đăng cộng đồng)
  const [isMixModalOpen, setIsMixModalOpen] = useState(false);
  const [mixItems, setMixItems] = useState([]);
  const [mixContext, setMixContext] = useState(OUTFIT_CONTEXTS[0]);
  const [mixTitle, setMixTitle] = useState('');
  const [mixScoreResult, setMixScoreResult] = useState(null);
  const [isMixScoring, setIsMixScoring] = useState(false);

  const handleOpenMixModal = (preselectedItem = null) => {
    if (preselectedItem) {
      setMixItems([preselectedItem]);
    } else if (mixItems.length === 0 && wardrobe.length > 0) {
      // Tự chọn 2 món đầu tiên để người dùng thấy ngay layout
      setMixItems(wardrobe.slice(0, 2));
    }
    setMixScoreResult(null);
    setIsMixModalOpen(true);
  };

  const handleToggleMixItem = (item) => {
    const isSelected = mixItems.some(i => i.id === item.id);
    if (isSelected) {
      setMixItems(mixItems.filter(i => i.id !== item.id));
      setMixScoreResult(null);
    } else {
      if (mixItems.length >= 4) {
        onTriggerToast?.('Tối đa chọn 4 món đồ cho 1 bộ phối!', 'warning');
        return;
      }
      setMixItems([...mixItems, item]);
      setMixScoreResult(null);
    }
  };

  const handleRunMixScore = () => {
    if (mixItems.length === 0) {
      onTriggerToast?.('Vui lòng chọn ít nhất 1 món đồ từ tủ đồ của bạn!', 'warning');
      return;
    }
    setIsMixScoring(true);
    setTimeout(() => {
      const res = communityOutfitService.scoreOutfit({
        items: mixItems,
        contextLabel: mixContext.label,
        userNotes: mixTitle
      });
      setMixScoreResult(res);
      setIsMixScoring(false);
      onTriggerToast?.(`✨ AI Stylist đã chấm xong: ${res.score}/10!`, 'success');
    }, 700);
  };

  const handlePublishMixPost = () => {
    if (mixItems.length === 0) {
      onTriggerToast?.('Vui lòng chọn món đồ trước khi đăng!', 'warning');
      return;
    }

    const finalScoreResult = mixScoreResult || communityOutfitService.scoreOutfit({
      items: mixItems,
      contextLabel: mixContext.label,
      userNotes: mixTitle
    });

    const firstImg = mixItems[0]?.imageUrl || mixItems[0]?.image_url || CURATED_PRESETS[0].imageUrl;

    communityOutfitService.createPost({
      authorName: user?.name || 'Nguyễn Văn An',
      authorEmail: user?.email || 'an.nguyen@gmail.com',
      isPro: user?.plan === 'PRO',
      title: mixTitle.trim() || `Set phối đồ ${mixContext.label} từ tủ cá nhân`,
      context: `${mixContext.icon} ${mixContext.label}`,
      imageUrl: firstImg,
      outfitItems: mixItems,
      score: finalScoreResult.score,
      breakdown: finalScoreResult.breakdown,
      aiReview: finalScoreResult.aiReview,
      aiTip: finalScoreResult.aiTip
    });

    setIsMixModalOpen(false);
    onTriggerToast?.('🎉 Đã đăng bộ đồ lên Cộng đồng thành công! Đang chuyển đến Bảng tin...', 'success');
    if (onNavigateCommunity) {
      setTimeout(() => onNavigateCommunity(), 650);
    }
  };

  // Filter items
  const filteredItems = wardrobe.filter(item => {
    const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleOpenAddModal = () => {
    if (isLimitReached) {
      onTriggerToast?.('🔒 Tủ đồ bản FREE đã đạt giới hạn 8 món. Nâng cấp VIP để mở khóa không giới hạn!', 'warning');
      onNavigatePricing?.();
      return;
    }
    setEditingItem(null);
    setFormName('');
    setFormCategory('Áo');
    setFormColor('Trắng');
    setFormNotes('');
    setFormImageUrl(CURATED_PRESETS[0].imageUrl);
    setImagePreview(CURATED_PRESETS[0].imageUrl);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormColor(item.color);
    setFormNotes(item.notes || '');
    setFormImageUrl(item.imageUrl || '');
    setImagePreview(item.imageUrl || '');
    setIsModalOpen(true);
  };

  const compressImageFile = (file, maxDimension = 640, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          // Nén tối ưu định dạng JPEG chất lượng cao, dung lượng chỉ ~25-40KB
          // Giải quyết triệt để lỗi QuotaExceededError trên LocalStorage
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải lên tệp định dạng hình ảnh (PNG, JPG, WEBP)!');
      return;
    }

    try {
      const compressedBase64 = await compressImageFile(file, 640, 0.75);
      setFormImageUrl(compressedBase64);
      setImagePreview(compressedBase64);
    } catch (err) {
      console.warn('Lỗi nén ảnh, sử dụng fallback FileReader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        setFormImageUrl(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickPresetImage = (url) => {
    setFormImageUrl(url);
    setImagePreview(url);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Vui lòng nhập tên món trang phục!');
      return;
    }

    try {
      if (editingItem) {
        onUpdateItem(editingItem.id, {
          name: formName.trim(),
          category: formCategory,
          color: formColor,
          notes: formNotes.trim(),
          imageUrl: formImageUrl || editingItem.imageUrl
        });
        onTriggerToast?.('✅ Đã cập nhật thông tin trang phục!');
      } else {
        onAddItem({
          name: formName.trim(),
          category: formCategory,
          color: formColor,
          notes: formNotes.trim(),
          imageUrl: formImageUrl || CURATED_PRESETS[0].imageUrl
        });
        onTriggerToast?.('✨ Đã thêm món đồ mới vào tủ đồ!');
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteItem(deleteConfirmId);
      setDeleteConfirmId(null);
      onTriggerToast?.('🗑️ Đã xóa món đồ khỏi tủ đồ số.');
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      if (onSyncCloud) {
        const items = await onSyncCloud();
        onTriggerToast?.(`☁️ Đồng bộ Cloud thành công! Đã tải ${items?.length || 0} món đồ cho tài khoản ${user?.email || ''}`);
      }
    } catch {
      onTriggerToast?.('Lỗi kết nối máy chủ Cloud, vui lòng thử lại sau giây lát.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="wardrobe-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HEADER & QUOTA STATUS                                  */}
      {/* ========================================================= */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Tủ đồ số cá nhân</h1>
          <p className="page-sub-title">
            Quản lý trang phục thông minh, phân loại theo danh mục và màu sắc để AI Stylist phối đồ chuẩn xác.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-sync-cloud-action"
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Đồng bộ tủ đồ giữa các thiết bị qua máy chủ Cloud"
          >
            <span>{isSyncing ? 'Đang đồng bộ...' : '☁️ Đồng bộ Cloud'}</span>
          </button>

          <button
            type="button"
            className="btn-mix-match-action"
            onClick={() => handleOpenMixModal()}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1.25rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.2s ease'
            }}
            title="Tự phối đồ từ các món trong tủ và đăng lên cộng đồng để nhận đánh giá, bình luận"
          >
            <span>✨ Tự Phối Đồ & Đăng</span>
          </button>

          <button
            className="btn-add-item-primary"
            onClick={handleOpenAddModal}
          >
            <span className="plus-icon">+</span>
            <span>Thêm món đồ mới</span>
          </button>
        </div>
      </div>

      {/* Quota indicator card */}
      <div className="wardrobe-quota-card-glass">
        <div className="quota-text-side">
          <div className="quota-status-badge">
            {isPro ? (
              <span className="badge-vip-pill">👑 VIP: KHÔNG GIỚI HẠN MÓN ĐỒ</span>
            ) : (
              <span className="badge-free-pill">
                FREE TIER: {currentCount} / 8 MÓN
              </span>
            )}
          </div>
          <p className="quota-hint">
            {isPro
              ? 'Tài khoản VIP cho phép bạn tải lên và lưu trữ không giới hạn tủ đồ thời trang.'
              : currentCount >= 8
              ? 'Bạn đã sử dụng hết 8/8 suất chứa đồ miễn phí. Nâng cấp VIP để không bỏ lỡ bất kỳ bộ cánh nào!'
              : `Bạn còn ${8 - currentCount} vị trí lưu trữ trang phục miễn phí hôm nay.`}
          </p>
        </div>

        {!isPro && (
          <div className="quota-upgrade-side">
            <div className="wardrobe-progress-bar-wrap">
              <div
                className={`wardrobe-progress-fill ${isLimitReached ? 'full' : ''}`}
                style={{ width: `${Math.min(100, (currentCount / 8) * 100)}%` }}
              ></div>
            </div>
            <button
              className="btn-upgrade-mini"
              onClick={onNavigatePricing}
            >
              Mở khóa Không giới hạn (49k)
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. SEARCH & FILTERS BAR                                   */}
      {/* ========================================================= */}
      <div className="wardrobe-filters-section">
        {/* Search Input */}
        <div className="search-box-glass">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên món đồ, chất liệu, ghi chú..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-chips-scroll">
          {WARDROBE_CATEGORIES.map(cat => {
            const count = cat.id === 'Tất cả' 
              ? wardrobe.length 
              : wardrobe.filter(i => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`category-filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="chip-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. WARDROBE ITEMS GRID                                    */}
      {/* ========================================================= */}
      {filteredItems.length === 0 ? (
        <div className="empty-wardrobe-state-glass">
          <div className="empty-icon-box">👗</div>
          <h3>Không tìm thấy món đồ phù hợp</h3>
          <p>Hãy thử thay đổi bộ lọc hoặc thêm món đồ trang phục mới vào tủ đồ của bạn.</p>
          <button className="btn-add-item-primary" onClick={handleOpenAddModal}>
            + Thêm món đồ mới
          </button>
        </div>
      ) : (
        <div className="wardrobe-cards-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="wardrobe-item-card-glass">
              <div className="item-image-container">
                <img
                  src={item.imageUrl || CURATED_PRESETS[0].imageUrl}
                  alt={item.name}
                  className="item-img"
                  loading="lazy"
                />
                <span className="item-category-badge">{item.category}</span>
                <div className="item-actions-hover">
                  <button
                    className="action-circle-btn mix"
                    onClick={() => handleOpenMixModal(item)}
                    title="Chọn món này để bắt đầu tự phối đồ"
                  >
                    ✨
                  </button>
                  <button
                    className="action-circle-btn edit"
                    onClick={() => handleOpenEditModal(item)}
                    title="Chỉnh sửa món đồ"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-circle-btn delete"
                    onClick={() => setDeleteConfirmId(item.id)}
                    title="Xóa món đồ"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="item-info-content">
                <div className="item-title-row">
                  <h4 className="item-name" title={item.name}>{item.name}</h4>
                </div>

                <div className="item-meta-row">
                  <span className="item-color-tag">
                    <span
                      className="color-tiny-dot"
                      style={{
                        backgroundColor: POPULAR_COLORS.find(c => c.name === item.color)?.hex || '#888'
                      }}
                    ></span>
                    {item.color}
                  </span>
                </div>

                {item.notes ? (
                  <p className="item-notes-text" title={item.notes}>{item.notes}</p>
                ) : (
                  <p className="item-notes-placeholder">Chưa có ghi chú chất liệu</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL: ADD / EDIT WARDROBE ITEM                        */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="modal-backdrop-glass" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>{editingItem ? 'Chỉnh sửa món đồ' : 'Thêm món đồ vào tủ'}</h3>
              <button className="modal-close-x" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form-body">
              {/* Image Preview & Upload */}
              <div className="form-group-image">
                <label className="form-label">Hình ảnh trang phục</label>
                <div className="image-uploader-wrapper">
                  <div className="preview-square">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="uploaded-preview-img" />
                    ) : (
                      <div className="preview-empty">Chưa có ảnh</div>
                    )}
                  </div>

                  <div className="upload-controls">
                    <label className="btn-file-upload">
                      <span>📁 Tải ảnh từ máy tính (PNG, JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={handleImageFileUpload}
                      />
                    </label>
                    <span className="or-text">Hoặc chọn nhanh ảnh mẫu có sẵn:</span>
                    <div className="preset-photos-scroll">
                      {CURATED_PRESETS.map((p, idx) => (
                        <img
                          key={idx}
                          src={p.imageUrl}
                          alt={p.name}
                          className={`preset-thumb ${imagePreview === p.imageUrl ? 'active' : ''}`}
                          onClick={() => handlePickPresetImage(p.imageUrl)}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tên món đồ */}
              <div className="form-field">
                <label className="form-label">Tên trang phục <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="Ví dụ: Sơ mi lụa tơ tằm, Quần âu ống suông..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Phân loại & Màu sắc (Nhập tự do kết hợp gợi ý datalist) */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label className="form-label">Phân loại trang phục <span className="req">*</span></label>
                  <select
                    className="form-select-input"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    required
                  >
                    <option value="Áo">👕 Áo (Tops, Sơ mi, Phông, Polo, Blazer...)</option>
                    <option value="Quần/Váy">👖 Quần & Váy (Bottoms, Jeans, Quần âu, Chân váy...)</option>
                    <option value="Giày dép">👟 Giày dép (Sneakers, Loafers, Giày tây, Cao gót...)</option>
                    <option value="Phụ kiện">🕶️ Phụ kiện (Túi xách, Đồng hồ, Thắt lưng, Mũ, Kính...)</option>
                    <option value="Áo khoác">🧥 Áo khoác (Cardigan, Trench coat, Jacket, Phao...)</option>
                    <option value="Váy liền thân">👗 Váy liền thân (Đầm dạ hội, Đầm xòe, Maxi...)</option>
                  </select>
                  <span className="field-hint-micro">💡 Chọn danh mục để AI Stylist phân loại trang phục chuẩn xác</span>
                </div>

                <div className="form-field">
                  <label className="form-label">Màu sắc chủ đạo <span className="req">*</span></label>
                  <input
                    type="text"
                    list="wardrobe-colors-list"
                    className="form-text-input"
                    placeholder="Ví dụ: Trắng, Đen, Be sữa, Tím pastel..."
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    required
                  />
                  <datalist id="wardrobe-colors-list">
                    {POPULAR_COLORS.map(c => (
                      <option key={c.name} value={c.name} />
                    ))}
                  </datalist>
                  <span className="field-hint-micro">💡 Tự do nhập màu sắc theo ý bạn</span>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="form-field">
                <label className="form-label">Ghi chú chất liệu / Dịp phù hợp</label>
                <textarea
                  className="form-textarea-input"
                  rows="2"
                  placeholder="Ví dụ: Lụa thoáng mát, cạp cao tôn dáng, hợp đi làm và đi cà phê..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer-buttons">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-modal-submit">
                  {editingItem ? 'Lưu thay đổi' : 'Thêm vào tủ đồ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CONFIRM DELETE MODAL                                   */}
      {/* ========================================================= */}
      {deleteConfirmId && (
        <div className="modal-backdrop-glass" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-dialog-confirm" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon-box">🗑️</div>
            <h3>Xác nhận xóa món đồ?</h3>
            <p>Món đồ này sẽ bị xóa khỏi tủ đồ số cá nhân của bạn và không thể khôi phục lại.</p>
            <div className="confirm-buttons-row">
              <button
                className="btn-modal-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                Giữ lại
              </button>
              <button
                className="btn-modal-delete-danger"
                onClick={handleConfirmDelete}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* 6. MODAL: STUDIO TỰ PHỐI ĐỒ CÁ NHÂN & ĐĂNG CỘNG ĐỒNG     */}
      {/* ========================================================= */}
      {isMixModalOpen && (
        <div className="modal-backdrop-blur" onClick={() => setIsMixModalOpen(false)}>
          <div className="rater-modal-box" onClick={e => e.stopPropagation()}>
            <div className="rater-modal-header">
              <div className="header-titles">
                <span className="modal-super-title">STUDIO TỰ PHỐI ĐỒ CÁ NHÂN</span>
                <h2 className="modal-title">Tự Phối Đồ & Đăng Lên Cộng Đồng</h2>
              </div>
              <button
                className="btn-close-modal"
                onClick={() => setIsMixModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="rater-modal-body">
              {/* 1. Chọn Hoàn Cảnh */}
              <div className="rater-form-section">
                <label className="section-label">1. Hoàn cảnh mặc đồ:</label>
                <div className="contexts-selector-grid">
                  {OUTFIT_CONTEXTS.map((ctx) => (
                    <button
                      key={ctx.id}
                      type="button"
                      className={`context-btn-chip ${mixContext.id === ctx.id ? 'active' : ''}`}
                      onClick={() => setMixContext(ctx)}
                    >
                      <span className="ctx-icon">{ctx.icon}</span>
                      <span>{ctx.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn các món từ Tủ đồ */}
              <div className="rater-form-section">
                <div className="label-with-hint">
                  <label className="section-label">2. Chọn món đồ từ Tủ đồ số của bạn ({mixItems.length}/4 món):</label>
                  <span className="section-hint">Tối đa 4 món cho 1 outfit</span>
                </div>

                {/* Banners thông báo nếu đang chọn đầm liền thân */}
                {mixItems.some(i => {
                  const cat = (i.category || '').toLowerCase();
                  const nm = (i.name || '').toLowerCase();
                  return cat === 'váy liền thân' || cat.includes('đầm') || cat.includes('liền') || cat.includes('maxi') || cat.includes('jumpsuit') || nm.includes('đầm') || nm.includes('váy liền');
                }) && (
                  <div className="mix-one-piece-helper-banner animate-fade-in">
                    <span className="helper-icon">👗</span>
                    <div className="helper-content">
                      <strong>Đã chọn Váy liền thân / Đầm:</strong> Thiết kế dáng liền tự động không cần phối thêm Quần/Váy. Bạn chỉ cần chọn thêm Giày dép & Phụ kiện là đủ điều kiện đạt điểm tối đa!
                    </div>
                  </div>
                )}

                {wardrobe.length === 0 ? (
                  <p className="item-notes-placeholder">Tủ đồ trống. Hãy thêm món đồ trước khi phối!</p>
                ) : (
                  <div className="wardrobe-picker-grid">
                    {wardrobe.map((item) => {
                      const isPicked = mixItems.some((i) => i.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`wardrobe-pick-card ${isPicked ? 'picked' : ''}`}
                          onClick={() => handleToggleMixItem(item)}
                        >
                          <img
                            src={item.imageUrl || item.image_url}
                            alt={item.name}
                            className="pick-item-img"
                          />
                          <div className="pick-item-info">
                            <span className="pick-item-name">{item.name}</span>
                            <span className="pick-item-cat">{item.category} • {item.color}</span>
                          </div>
                          {isPicked && <span className="check-badge">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Tiêu đề / Lời tựa */}
              <div className="rater-form-section">
                <label className="section-label">3. Lời tựa / Chia sẻ của bạn về bộ đồ này:</label>
                <input
                  type="text"
                  className="input-text-dark"
                  placeholder="Ví dụ: Set đồ tự phối đi cafe phố cổ sáng Chủ Nhật, mọi người thấy có hợp không?..."
                  value={mixTitle}
                  onChange={(e) => setMixTitle(e.target.value)}
                />
              </div>

              {/* Nút Xem Gợi ý AI Stylist */}
              <div className="rater-action-center">
                <button
                  type="button"
                  className="btn-trigger-ai-score"
                  onClick={handleRunMixScore}
                  disabled={isMixScoring || mixItems.length === 0}
                >
                  {isMixScoring ? (
                    <span>⏳ AI Stylist đang phân tích độ hòa hợp...</span>
                  ) : (
                    <span>✨ Tham khảo tư vấn từ AI Stylist</span>
                  )}
                </button>
              </div>

              {/* Lời khuyên Stylist (không hiển thị điểm số rating cứng nhắc) */}
              {mixScoreResult && (
                <div className="score-result-card animate-fade-in">
                  <div className="score-heading-text">
                    <h4>💡 Nhận xét từ Stylist AI:</h4>
                    <p>{mixScoreResult.aiReview}</p>
                  </div>

                  <div className="ai-tip-box-highlight">
                    <strong>✨ Mẹo nâng tầm phối đồ:</strong> {mixScoreResult.aiTip}
                  </div>
                </div>
              )}

              {/* Nút Đăng lên Cộng đồng */}
              <div className="publish-confirm-footer" style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-publish-to-community"
                  onClick={handlePublishMixPost}
                  disabled={mixItems.length === 0}
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                >
                  📢 Đăng Lên Cộng Đồng (Nhận Thả Tim ❤️ & Bình Luận)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
