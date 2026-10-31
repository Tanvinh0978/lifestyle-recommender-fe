import React, { useState } from 'react';
import { WARDROBE_CATEGORIES, POPULAR_COLORS, CURATED_PRESETS } from '../services/wardrobeService.js';

export default function WardrobeView({
  wardrobe,
  user,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onNavigatePricing,
  onTriggerToast
}) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedColor, setSelectedColor] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter items
  const filteredItems = wardrobe.filter(item => {
    const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchColor = selectedColor === 'Tất cả' || item.color === selectedColor;
    const matchSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchColor && matchSearch;
  });

  const handleOpenAddModal = () => {
    if (isLimitReached) {
      onTriggerToast?.('🔒 Tủ đồ bản FREE đã đạt giới hạn 8 món. Nâng cấp PRO VIP để mở khóa vô hạn!', 'warning');
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

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải lên tệp định dạng hình ảnh (PNG, JPG, WEBP)!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 8MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setFormImageUrl(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
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

        <button
          className="btn-add-item-primary"
          onClick={handleOpenAddModal}
        >
          <span className="plus-icon">+</span>
          <span>Thêm món đồ mới</span>
        </button>
      </div>

      {/* Quota indicator card */}
      <div className="wardrobe-quota-card-glass">
        <div className="quota-text-side">
          <div className="quota-status-badge">
            {isPro ? (
              <span className="badge-vip-pill">👑 PRO VIP: VÔ HẠN MÓN ĐỒ</span>
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
              ? 'Bạn đã sử dụng hết 8/8 suất chứa đồ miễn phí. Nâng cấp PRO VIP để không bỏ lỡ bất kỳ bộ cánh nào!'
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
              Mở khóa Vô hạn (49k)
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

        {/* Color Filters */}
        <div className="color-filters-row">
          <span className="color-filter-label">Màu sắc:</span>
          <button
            className={`color-filter-pill ${selectedColor === 'Tất cả' ? 'active' : ''}`}
            onClick={() => setSelectedColor('Tất cả')}
          >
            Tất cả màu
          </button>
          {POPULAR_COLORS.map(c => (
            <button
              key={c.name}
              className={`color-filter-dot-btn ${selectedColor === c.name ? 'active' : ''}`}
              onClick={() => setSelectedColor(selectedColor === c.name ? 'Tất cả' : c.name)}
              title={c.name}
            >
              <span
                className="color-dot"
                style={{
                  backgroundColor: c.hex,
                  border: c.border ? '1px solid #ccc' : 'none'
                }}
              ></span>
              <span className="color-name-text">{c.name}</span>
            </button>
          ))}
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
                  <input
                    type="text"
                    list="wardrobe-categories-list"
                    className="form-text-input"
                    placeholder="Ví dụ: Áo, Quần âu, Váy dạ hội, Giày..."
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    required
                  />
                  <datalist id="wardrobe-categories-list">
                    <option value="Áo" />
                    <option value="Quần/Váy" />
                    <option value="Giày dép" />
                    <option value="Phụ kiện" />
                    <option value="Áo khoác" />
                    <option value="Váy liền thân" />
                  </datalist>
                  <span className="field-hint-micro">💡 Bạn có thể tự gõ loại trang phục bất kỳ</span>
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
    </div>
  );
}
