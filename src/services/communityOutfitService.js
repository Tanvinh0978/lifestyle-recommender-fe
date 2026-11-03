// ==========================================================
// COMMUNITY OUTFIT & AI RATER SERVICE
// Chấm điểm phối đồ bằng AI & Cộng đồng giao lưu, bình luận OOTD
// ==========================================================

const STORAGE_KEY = 'wearwell_community_feed_v1';

export const OUTFIT_CONTEXTS = [
  { id: 'work', label: 'Công sở & Đi làm', icon: '💼' },
  { id: 'cafe', label: 'Cafe & Dạo phố', icon: '☕' },
  { id: 'date', label: 'Hẹn hò lãng mạn', icon: '🌹' },
  { id: 'party', label: 'Dự tiệc & Sự kiện', icon: '🥂' },
  { id: 'travel', label: 'Du lịch & Dã ngoại', icon: '✈️' },
  { id: 'gym', label: 'Tập luyện & Thể thao', icon: '🏃' }
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post_1',
    authorName: 'Mai Linh',
    authorEmail: 'mailinh.lifestyle@gmail.com',
    isPro: true,
    authorAvatar: 'M',
    title: 'Sơ mi lụa màu hoa cà pastel cùng quần âu cạp cao',
    context: '☕ Cafe & Dạo phố',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    outfitItems: [
      { name: 'Sơ mi lụa màu hoa cà pastel', category: 'Áo', color: 'Tím Lavender' },
      { name: 'Quần âu ống suông cạp cao', category: 'Quần/Váy', color: 'Be sữa' },
      { name: 'Loafers da trơn màu kem', category: 'Giày dép', color: 'Be sữa' }
    ],
    score: 9.3,
    breakdown: {
      colorHarmony: 9.6,
      proportions: 9.2,
      versatility: 9.1
    },
    aiReview: 'Bản phối màu tuyệt vời giữa Tím Lavender dịu mát và Be sữa tạo cảm giác nhã nhặn, thanh lịch chuẩn phong cách Quiet Luxury. Dáng sơ mi rủ tự nhiên kết hợp cạp cao giúp kéo dài tỷ lệ chân một cách khéo léo.',
    aiTip: 'Nếu đeo thêm một chiếc túi xách quai kim loại vàng champagne hoặc kính râm gọng đồi mồi, bạn sẽ có set đồ 10/10 xuất sắc!',
    likesCount: 38,
    likedBy: ['an.nguyen@gmail.com'],
    createdAt: '2026-11-01T15:20:00.000Z',
    comments: [
      {
        id: 'c_1',
        authorName: 'Nguyễn Văn An',
        authorEmail: 'an.nguyen@gmail.com',
        isPro: true,
        content: 'Màu áo này nhã nhặn ghê Linh ơi! Chất vải nhìn bay và tôn da dã man 👍',
        createdAt: '2026-11-01T16:05:00.000Z'
      },
      {
        id: 'c_2',
        authorName: 'Mai Linh',
        authorEmail: 'mailinh.lifestyle@gmail.com',
        isPro: true,
        content: 'Dạ em cảm ơn anh An! Vải lụa này thoáng mát cực kỳ, hợp đi cafe cuối tuần lắm ạ.',
        createdAt: '2026-11-01T16:30:00.000Z'
      },
      {
        id: 'c_3',
        authorName: 'Lê Hoàng Yến',
        authorEmail: 'hoangyen.le@gmail.com',
        isPro: false,
        content: 'Quần âu mua ở đâu vậy nàng ơi? Dáng đứng form thích ghê!',
        createdAt: '2026-11-01T17:10:00.000Z'
      }
    ]
  },
  {
    id: 'post_2',
    authorName: 'Nguyễn Văn An',
    authorEmail: 'an.nguyen@gmail.com',
    isPro: true,
    authorAvatar: 'N',
    title: 'Smart Casual công sở đầu tuần: Áo thun trắng & Blazer Navy',
    context: '💼 Công sở & Đi làm',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    outfitItems: [
      { name: 'Áo thun cotton trắng tối giản', category: 'Áo', color: 'Trắng' },
      { name: 'Blazer Tailored Navy kinh điển', category: 'Áo', color: 'Xanh Navy' },
      { name: 'Quần âu xám tro Slimfit', category: 'Quần/Váy', color: 'Xám Khói' }
    ],
    score: 8.9,
    breakdown: {
      colorHarmony: 9.1,
      proportions: 8.8,
      versatility: 8.8
    },
    aiReview: 'Công thức phối Trắng + Navy kinh điển không bao giờ lỗi mốt. Set đồ toát lên vẻ ngoài nam tính, đáng tin cậy nhưng vẫn trẻ trung, không bị quá cứng nhắc như âu phục truyền thống.',
    aiTip: 'Nên kết hợp cùng đồng hồ dây da nâu tối màu và đi sneaker trắng da trơn để hoàn thiện vibe hiện đại.',
    likesCount: 42,
    likedBy: ['mailinh.lifestyle@gmail.com'],
    createdAt: '2026-11-02T02:15:00.000Z',
    comments: [
      {
        id: 'c_4',
        authorName: 'Mai Linh',
        authorEmail: 'mailinh.lifestyle@gmail.com',
        isPro: true,
        content: 'Set này đi gặp đối tác hoặc pitching dự án là chuẩn bài luôn anh An!',
        createdAt: '2026-11-02T02:45:00.000Z'
      },
      {
        id: 'c_5',
        authorName: 'Trần Minh Quân',
        authorEmail: 'quan.tm@gmail.com',
        isPro: false,
        content: 'Cho mình xin info chiếc blazer với bác, vai áo lên form đẹp quá.',
        createdAt: '2026-11-02T03:10:00.000Z'
      }
    ]
  },
  {
    id: 'post_3',
    authorName: 'Lê Hoàng Yến',
    authorEmail: 'hoangyen.le@gmail.com',
    isPro: false,
    authorAvatar: 'Y',
    title: 'Set dạo phố cuối tuần: Jeans xanh & Loafers be',
    context: '☕ Cafe & Dạo phố',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    outfitItems: [
      { name: 'Áo len dệt kim mỏng kem sữa', category: 'Áo', color: 'Be sữa' },
      { name: 'Quần Jeans Slimfit xanh cổ điển', category: 'Quần/Váy', color: 'Xanh Jeans' },
      { name: 'Túi da đeo vai màu nâu cà phê', category: 'Phụ kiện', color: 'Nâu Cà phê' }
    ],
    score: 9.0,
    breakdown: {
      colorHarmony: 9.3,
      proportions: 8.9,
      versatility: 8.9
    },
    aiReview: 'Sự kết hợp giữa chất liệu len mỏng và denim tạo độ tương phản chất liệu (texture) rất có gu. Tông màu be và xanh jeans là cặp đôi vượt thời gian cho những buổi chiều thư giãn.',
    aiTip: 'Thử xắn gấu quần jean lên 1 nấc mảnh để lộ phần cổ chân thon sẽ giúp vóc dáng trông cao ráo hơn.',
    likesCount: 25,
    likedBy: [],
    createdAt: '2026-11-02T04:00:00.000Z',
    comments: [
      {
        id: 'c_6',
        authorName: 'Mai Linh',
        authorEmail: 'mailinh.lifestyle@gmail.com',
        isPro: true,
        content: 'Mê tone màu này quá nàng ơi, nhìn nhẹ nhàng mà có gu ghê 🌿',
        createdAt: '2026-11-02T04:30:00.000Z'
      }
    ]
  }
];

class CommunityOutfitService {
  constructor() {
    this.posts = this._loadInitialPosts();
  }

  _loadInitialPosts() {
    if (typeof window === 'undefined') return INITIAL_COMMUNITY_POSTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return INITIAL_COMMUNITY_POSTS;
  }

  _persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.posts));
      } catch (_) {}
    }
  }

  getPosts() {
    return this.posts;
  }

  /**
   * AI Chấm điểm thông minh cho outfit
   */
  scoreOutfit({ items = [], contextLabel = 'Dạo phố', userNotes = '', customImageUrl = '' }) {
    // 1. Phân tích màu sắc
    const colors = items.map(i => i.color).filter(Boolean);
    const categories = items.map(i => i.category).filter(Boolean);

    let colorScore = 8.5;
    let propScore = 8.4;
    let versScore = 8.6;

    // Quy tắc hòa hợp màu
    const uniqueColors = [...new Set(colors)];
    if (uniqueColors.length >= 2 && uniqueColors.length <= 3) {
      colorScore += 0.7; // Tối ưu 2-3 màu
    } else if (uniqueColors.length > 4) {
      colorScore -= 0.5; // Quá nhiều màu bị rối
    }

    if (colors.some(c => ['Trắng', 'Be sữa', 'Đen'].includes(c))) {
      colorScore += 0.4; // Có màu trung tính làm nền
    }

    // Quy tắc cấu trúc trang phục
    const hasTop = categories.some(c => c === 'Áo');
    const hasBottom = categories.some(c => c === 'Quần/Váy');
    const hasShoes = categories.some(c => c === 'Giày dép');
    const hasAcc = categories.some(c => c === 'Phụ kiện');

    if (hasTop && hasBottom) propScore += 0.6;
    if (hasShoes) propScore += 0.3;
    if (hasAcc) propScore += 0.2;

    // Giới hạn max 9.8, min 7.2
    colorScore = Math.min(9.8, Math.max(7.2, Number(colorScore.toFixed(1))));
    propScore = Math.min(9.7, Math.max(7.0, Number(propScore.toFixed(1))));
    versScore = Math.min(9.6, Math.max(7.2, Number(versScore.toFixed(1))));

    const overall = Number(((colorScore * 0.4) + (propScore * 0.35) + (versScore * 0.25)).toFixed(1));

    // Lời bình AI
    let aiReview = '';
    let aiTip = '';

    if (overall >= 9.0) {
      aiReview = `Set trang phục xuất sắc! Sự kết hợp giữa ${items.map(i => i.name).slice(0, 2).join(' và ')} mang đến tổng thể hài hòa, tôn dáng và toát lên gu thẩm mỹ tinh tế cho hoàn cảnh ${contextLabel}.`;
      aiTip = 'Điểm nhấn đã rất trọn vẹn. Bạn chỉ cần giữ phong thái tự tin và thêm hương nước hoa nhẹ nhàng là có thể thu hút mọi ánh nhìn.';
    } else if (overall >= 8.2) {
      aiReview = `Bản phối an toàn, thanh lịch và mang tính ứng dụng cao. Các item ${items.map(i => i.name).slice(0, 2).join(', ')} bổ trợ tốt cho nhau, không bị lỗi mốt.`;
      aiTip = 'Để nâng tầm set đồ lên mức 9.5+, bạn nên bổ sung thêm 1 phụ kiện tương phản (như thắt lưng da, đồng hồ hoặc kính râm) để tạo điểm nhấn thị giác.';
    } else {
      aiReview = `Bộ đồ mang lại cảm giác thoải mái, tuy nhiên các mảng màu và phom dáng giữa các item chưa thực sự tạo được tỷ lệ cơ thể tối ưu nhất.`;
      aiTip = 'Thử áp dụng quy tắc 1/3: sơ vin vạt trước hoặc chọn cạp quần cao hơn để đôi chân trông dài và thanh mảnh hơn.';
    }

    return {
      score: overall,
      breakdown: {
        colorHarmony: colorScore,
        proportions: propScore,
        versatility: versScore
      },
      aiReview,
      aiTip
    };
  }

  /**
   * Đăng bài phối đồ mới lên cộng đồng
   */
  createPost({
    authorName,
    authorEmail,
    isPro = false,
    title,
    context,
    imageUrl,
    outfitItems = [],
    score,
    breakdown,
    aiReview,
    aiTip
  }) {
    const newPost = {
      id: `post_${Date.now()}`,
      authorName: authorName || 'Fashionista',
      authorEmail: authorEmail || 'an.nguyen@gmail.com',
      isPro: Boolean(isPro),
      authorAvatar: (authorName || 'U').charAt(0).toUpperCase(),
      title: title || 'Bộ phối đồ hôm nay',
      context: context || '☕ Cafe & Dạo phố',
      imageUrl: imageUrl || (outfitItems[0]?.imageUrl || outfitItems[0]?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'),
      outfitItems,
      score: score || 8.8,
      breakdown: breakdown || { colorHarmony: 8.9, proportions: 8.7, versatility: 8.8 },
      aiReview: aiReview || 'Bản phối hài hòa và trẻ trung.',
      aiTip: aiTip || 'Tự tin sải bước để tỏa sáng nhất!',
      likesCount: 1,
      likedBy: [authorEmail || 'an.nguyen@gmail.com'],
      createdAt: new Date().toISOString(),
      comments: []
    };

    this.posts = [newPost, ...this.posts];
    this._persist();
    return newPost;
  }

  /**
   * Thêm bình luận vào bài viết
   */
  addComment(postId, { authorName, authorEmail, isPro = false, content }) {
    if (!content || !content.trim()) return null;

    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const newComment = {
      id: `c_${Date.now()}`,
      authorName: authorName || 'Bạn',
      authorEmail: authorEmail || '',
      isPro: Boolean(isPro),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const targetPost = this.posts[postIndex];
    targetPost.comments = [...(targetPost.comments || []), newComment];
    this.posts[postIndex] = { ...targetPost };
    this._persist();

    return newComment;
  }

  /**
   * Thả tim / Bỏ thả tim
   */
  toggleLike(postId, userEmail) {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const targetPost = this.posts[postIndex];
    const likedBy = targetPost.likedBy || [];
    const hasLiked = likedBy.includes(userEmail);

    let updatedLikedBy = [];
    let updatedLikesCount = targetPost.likesCount || 0;

    if (hasLiked) {
      updatedLikedBy = likedBy.filter(email => email !== userEmail);
      updatedLikesCount = Math.max(0, updatedLikesCount - 1);
    } else {
      updatedLikedBy = [...likedBy, userEmail];
      updatedLikesCount += 1;
    }

    this.posts[postIndex] = {
      ...targetPost,
      likedBy: updatedLikedBy,
      likesCount: updatedLikesCount
    };

    this._persist();
    return {
      likesCount: updatedLikesCount,
      hasLiked: !hasLiked
    };
  }
}

export const communityOutfitService = new CommunityOutfitService();
