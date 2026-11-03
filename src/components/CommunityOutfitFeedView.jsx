'use client';

import React, { useState, useMemo } from 'react';
import {
  communityOutfitService,
  OUTFIT_CONTEXTS
} from '../services/communityOutfitService.js';

export default function CommunityOutfitFeedView({
  user,
  wardrobe = [],
  onNavigateWardrobe,
  onTriggerToast
}) {
  const [posts, setPosts] = useState(() => communityOutfitService.getPosts());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'top' | 'mine' | contextId
  const [isRaterModalOpen, setIsRaterModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: true }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: '' }

  // State cho Form Chấm điểm AI
  const [selectedItems, setSelectedItems] = useState([]); // [item, ...]
  const [selectedContext, setSelectedContext] = useState(OUTFIT_CONTEXTS[0]);
  const [postTitle, setPostTitle] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Toggle Like bài viết
  const handleToggleLike = (postId) => {
    const userEmail = user?.email || 'an.nguyen@gmail.com';
    const result = communityOutfitService.toggleLike(postId, userEmail);
    if (result) {
      setPosts(communityOutfitService.getPosts());
      if (result.hasLiked) {
        onTriggerToast?.('❤️ Đã thả tim bộ phối đồ!', 'info');
      }
    }
  };

  // Mở/Đóng phần bình luận của bài viết
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Gửi bình luận
  const handleSendComment = (postId, e) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const authorName = user?.name || 'Bạn';
    const authorEmail = user?.email || 'an.nguyen@gmail.com';
    const isPro = user?.plan === 'PRO';

    const newComment = communityOutfitService.addComment(postId, {
      authorName,
      authorEmail,
      isPro,
      content: text
    });

    if (newComment) {
      setPosts(communityOutfitService.getPosts());
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      onTriggerToast?.('💬 Đã gửi bình luận của bạn!', 'success');
      // Đảm bảo mở bình luận
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    }
  };

  // Chọn hoặc bỏ chọn món đồ từ tủ đồ khi chấm điểm
  const handleToggleSelectItem = (item) => {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      if (selectedItems.length >= 4) {
        onTriggerToast?.('Tối đa chọn 4 món đồ cho 1 bộ outfit!', 'warning');
        return;
      }
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Chấm điểm với AI
  const handleRunAIScore = () => {
    if (selectedItems.length === 0 && !customImageUrl.trim()) {
      onTriggerToast?.('Vui lòng chọn ít nhất 1 món đồ từ tủ đồ hoặc nhập link ảnh!', 'warning');
      return;
    }

    setIsScoring(true);
    setTimeout(() => {
      const result = communityOutfitService.scoreOutfit({
        items: selectedItems,
        contextLabel: selectedContext.label,
        customImageUrl: customImageUrl.trim()
      });
      setScoreResult(result);
      setIsScoring(false);
      onTriggerToast?.(`✨ AI Stylist đã chấm xong: ${result.score}/10!`, 'success');
    }, 900);
  };

  // Đăng lên Cộng đồng
  const handlePublishPost = () => {
    if (!scoreResult) {
      onTriggerToast?.('Vui lòng bấm chấm điểm trước khi đăng!', 'warning');
      return;
    }

    const finalImage =
      customImageUrl.trim() ||
      selectedItems[0]?.imageUrl ||
      selectedItems[0]?.image_url ||
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';

    communityOutfitService.createPost({
      authorName: user?.name || 'Nguyễn Văn An',
      authorEmail: user?.email || 'an.nguyen@gmail.com',
      isPro: user?.plan === 'PRO',
      title: postTitle.trim() || `Phối đồ ${selectedContext.label}`,
      context: `${selectedContext.icon} ${selectedContext.label}`,
      imageUrl: finalImage,
      outfitItems: selectedItems,
      score: scoreResult.score,
      breakdown: scoreResult.breakdown,
      aiReview: scoreResult.aiReview,
      aiTip: scoreResult.aiTip
    });

    setPosts(communityOutfitService.getPosts());
    setIsRaterModalOpen(false);
    setSelectedItems([]);
    setScoreResult(null);
    setPostTitle('');
    setCustomImageUrl('');
    onTriggerToast?.('🎉 Đã đăng bộ đồ lên Cộng đồng thành công!', 'success');
  };

  // Lọc bài viết
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'top') {
      return [...posts].filter((p) => p.score >= 9.0).sort((a, b) => b.score - a.score);
    }
    if (activeFilter === 'mine') {
      const myEmail = user?.email || 'an.nguyen@gmail.com';
      return posts.filter((p) => p.authorEmail === myEmail);
    }
    if (activeFilter !== 'all') {
      return posts.filter((p) => p.context?.toLowerCase().includes(activeFilter.toLowerCase()));
    }
    return posts;
  }, [posts, activeFilter, user]);

  return (
    <div className="community-view-wrapper">
      {/* 1. Header Banner */}
      <section className="community-hero-banner">
        <div className="community-hero-content">
          <div className="community-badge-pill">
            <span className="sparkle-icon">✨</span>
            <span>TÍNH NĂNG MỚI: AI OUTFIT RATER & COMMUNITY</span>
          </div>
          <h1 className="community-main-title">
            Cộng Đồng Phối Đồ & Chấm Điểm AI
          </h1>
          <p className="community-sub-desc">
            Nhận phân tích tỷ lệ vóc dáng, bảng màu từ AI Stylist và cùng trao đổi, nhận góp ý từ cộng đồng thời trang Wearwell.
          </p>

          <div className="community-hero-actions">
            <button
              className="btn-open-rater-primary"
              onClick={() => {
                setScoreResult(null);
                setIsRaterModalOpen(true);
              }}
            >
              <span className="btn-icon">⚡</span>
              <span>Chấm Điểm Bộ Đồ Của Bạn</span>
            </button>
            <div className="community-stat-counter">
              <span>🔥 {posts.length} Bộ phối đang trao đổi sôi nổi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter & Navigation Pills */}
      <div className="community-filter-bar">
        <button
          className={`filter-pill-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          🌟 Tất cả ({posts.length})
        </button>
        <button
          className={`filter-pill-btn ${activeFilter === 'top' ? 'active' : ''}`}
          onClick={() => setActiveFilter('top')}
        >
          ⭐ Điểm cao (9.0+)
        </button>
        <button
          className={`filter-pill-btn ${activeFilter === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveFilter('mine')}
        >
          👤 Của tôi
        </button>
        {OUTFIT_CONTEXTS.map((ctx) => (
          <button
            key={ctx.id}
            className={`filter-pill-btn ${activeFilter === ctx.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(ctx.id)}
          >
            {ctx.icon} {ctx.label}
          </button>
        ))}
      </div>

      {/* 3. Danh sách Bài Viết Feed */}
      <div className="community-feed-grid">
        {filteredPosts.map((post) => {
          const userEmail = user?.email || 'an.nguyen@gmail.com';
          const isLiked = post.likedBy?.includes(userEmail);
          const isCommentsOpen = Boolean(expandedComments[post.id]);
          const commentsList = post.comments || [];

          return (
            <article key={post.id} className="community-post-card">
              {/* Post Header */}
              <div className="post-header-row">
                <div className="post-author-info">
                  <div className="post-avatar-circle">{post.authorAvatar || 'U'}</div>
                  <div className="post-author-meta">
                    <div className="author-name-group">
                      <span className="author-name">{post.authorName}</span>
                      {post.isPro && <span className="badge-pro-inline">PRO VIP</span>}
                    </div>
                    <span className="post-timestamp">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="post-context-badge">{post.context}</div>
              </div>

              {/* Outfit Image & Score Badge */}
              <div className="post-image-container">
                <img src={post.imageUrl} alt={post.title} className="post-outfit-img" />
                <div className="post-ai-score-badge">
                  <span className="score-star">⭐</span>
                  <span className="score-number">{post.score}</span>
                  <span className="score-max">/10</span>
                </div>
              </div>

              {/* Title & Items */}
              <div className="post-body-content">
                <h3 className="post-title-text">{post.title}</h3>

                {post.outfitItems && post.outfitItems.length > 0 && (
                  <div className="post-outfit-items-tags">
                    {post.outfitItems.map((item, idx) => (
                      <span key={idx} className="item-spec-tag">
                        • {item.name} ({item.color})
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Stylist Review Box */}
                <div className="post-ai-analysis-box">
                  <div className="ai-analysis-header">
                    <span className="ai-robot-icon">✨</span>
                    <span className="ai-header-title">Đánh giá từ AI Stylist:</span>
                  </div>
                  <p className="ai-review-text">{post.aiReview}</p>
                  {post.aiTip && (
                    <div className="ai-tip-row">
                      <span className="ai-tip-badge">Mẹo Stylist</span>
                      <span className="ai-tip-text">{post.aiTip}</span>
                    </div>
                  )}

                  {/* 3 mini score metrics */}
                  {post.breakdown && (
                    <div className="breakdown-metrics-row">
                      <div className="metric-pill">
                        <span className="metric-label">Màu sắc:</span>
                        <span className="metric-val">{post.breakdown.colorHarmony}/10</span>
                      </div>
                      <div className="metric-pill">
                        <span className="metric-label">Tỷ lệ:</span>
                        <span className="metric-val">{post.breakdown.proportions}/10</span>
                      </div>
                      <div className="metric-pill">
                        <span className="metric-label">Hoàn cảnh:</span>
                        <span className="metric-val">{post.breakdown.versatility}/10</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interaction Action Bar */}
                <div className="post-action-bar">
                  <button
                    className={`btn-action-like ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
                    <span className="action-count">{post.likesCount || 0} Thích</span>
                  </button>

                  <button
                    className="btn-action-comment"
                    onClick={() => toggleComments(post.id)}
                  >
                    <span className="action-icon">💬</span>
                    <span className="action-count">{commentsList.length} Bình luận & Góp ý</span>
                  </button>
                </div>

                {/* Comment Section (Always visible or toggled) */}
                <div className="post-comments-container">
                  {/* Danh sách bình luận */}
                  {commentsList.length > 0 && (
                    <div className="comments-thread-list">
                      {commentsList.map((c) => (
                        <div key={c.id} className="comment-bubble-item">
                          <div className="comment-avatar">
                            {c.authorName ? c.authorName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="comment-content-wrap">
                            <div className="comment-header-meta">
                              <span className="comment-author-name">{c.authorName}</span>
                              {c.isPro && <span className="comment-badge-pro">PRO VIP</span>}
                              <span className="comment-time">
                                {new Date(c.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="comment-text-body">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Nhập Bình Luận */}
                  <form
                    className="comment-input-form"
                    onSubmit={(e) => handleSendComment(post.id, e)}
                  >
                    <input
                      type="text"
                      className="comment-text-field"
                      placeholder="Chia sẻ cảm nghĩ hoặc góp ý phối đồ..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="btn-send-comment"
                      disabled={!(commentInputs[post.id] || '').trim()}
                    >
                      Gửi
                    </button>
                  </form>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. MODAL: AI OUTFIT RATER STUDIO */}
      {isRaterModalOpen && (
        <div className="modal-backdrop-blur">
          <div className="rater-modal-box">
            <div className="rater-modal-header">
              <div className="header-titles">
                <span className="modal-super-title">AI OUTFIT RATER STUDIO</span>
                <h2 className="modal-title">Chấm Điểm Phối Đồ & Nhận Góp Ý</h2>
              </div>
              <button
                className="btn-close-modal"
                onClick={() => setIsRaterModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="rater-modal-body">
              {/* Bước 1: Chọn hoàn cảnh */}
              <div className="rater-form-section">
                <label className="section-label">1. Hoàn cảnh mặc đồ:</label>
                <div className="contexts-selector-grid">
                  {OUTFIT_CONTEXTS.map((ctx) => (
                    <button
                      key={ctx.id}
                      type="button"
                      className={`context-btn-chip ${selectedContext.id === ctx.id ? 'active' : ''}`}
                      onClick={() => setSelectedContext(ctx)}
                    >
                      <span className="ctx-icon">{ctx.icon}</span>
                      <span>{ctx.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bước 2: Chọn từ Tủ đồ số hoặc Nhập link ảnh */}
              <div className="rater-form-section">
                <div className="label-with-hint">
                  <label className="section-label">2. Chọn món đồ từ Tủ đồ số (Tối đa 4 món):</label>
                  <span className="section-hint">Đã chọn: {selectedItems.length}/4</span>
                </div>

                {wardrobe.length === 0 ? (
                  <div className="wardrobe-empty-hint">
                    <p>Tủ đồ của bạn chưa có trang phục nào.</p>
                    <button className="btn-link" onClick={onNavigateWardrobe}>
                      Đi đến Tủ đồ để thêm món →
                    </button>
                  </div>
                ) : (
                  <div className="wardrobe-picker-grid">
                    {wardrobe.map((item) => {
                      const isPicked = selectedItems.some((i) => i.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`wardrobe-pick-card ${isPicked ? 'picked' : ''}`}
                          onClick={() => handleToggleSelectItem(item)}
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

              {/* Link ảnh OOTD (Tùy chọn) */}
              <div className="rater-form-section">
                <label className="section-label">Hoặc dán Link ảnh chụp OOTD của bạn (tùy chọn):</label>
                <input
                  type="url"
                  className="input-text-dark"
                  placeholder="https://example.com/anh-outfit.jpg"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                />
              </div>

              {/* Tiêu đề bài đăng */}
              <div className="rater-form-section">
                <label className="section-label">Tiêu đề / Lời tựa cho bộ đồ:</label>
                <input
                  type="text"
                  className="input-text-dark"
                  placeholder="Ví dụ: Set đồ cafe sáng Chủ Nhật, mọi người thấy chiếc sơ mi này thế nào?..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              {/* Nút bấm Kích hoạt AI Chấm điểm */}
              <div className="rater-action-center">
                <button
                  type="button"
                  className="btn-trigger-ai-score"
                  onClick={handleRunAIScore}
                  disabled={isScoring}
                >
                  {isScoring ? (
                    <span>⏳ AI Stylist đang phân tích màu sắc & tỉ lệ...</span>
                  ) : (
                    <span>✨ Phân Tích & Chấm Điểm Ngay</span>
                  )}
                </button>
              </div>

              {/* KẾT QUẢ CHẤM ĐIỂM CỦA AI */}
              {scoreResult && (
                <div className="score-result-card animate-fade-in">
                  <div className="score-main-display">
                    <div className="score-circle-badge">
                      <span className="circle-score-val">{scoreResult.score}</span>
                      <span className="circle-score-unit">/10</span>
                    </div>
                    <div className="score-heading-text">
                      <h4>
                        {scoreResult.score >= 9.0
                          ? '🌟 Đạt Chuẩn Xuất Sắc!'
                          : scoreResult.score >= 8.0
                          ? '✨ Rất Đẹp & Có Gu'
                          : '💡 Khá Ổn, Cần Chút Tinh Chỉnh'}
                      </h4>
                      <p>{scoreResult.aiReview}</p>
                    </div>
                  </div>

                  <div className="score-breakdown-bars">
                    <div className="bar-item">
                      <div className="bar-labels">
                        <span>Hòa hợp màu sắc</span>
                        <strong>{scoreResult.breakdown.colorHarmony}/10</strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(scoreResult.breakdown.colorHarmony / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bar-item">
                      <div className="bar-labels">
                        <span>Tỷ lệ vóc dáng & Form</span>
                        <strong>{scoreResult.breakdown.proportions}/10</strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(scoreResult.breakdown.proportions / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bar-item">
                      <div className="bar-labels">
                        <span>Độ phù hợp hoàn cảnh</span>
                        <strong>{scoreResult.breakdown.versatility}/10</strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(scoreResult.breakdown.versatility / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="ai-tip-box-highlight">
                    <strong>💡 Mẹo nâng cấp từ Stylist:</strong> {scoreResult.aiTip}
                  </div>

                  <div className="publish-confirm-footer">
                    <button
                      type="button"
                      className="btn-publish-to-community"
                      onClick={handlePublishPost}
                    >
                      📢 Đăng Lên Cộng Đồng Để Nhận Bình Luận
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
