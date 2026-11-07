// ==========================================================
// AI LIFESTYLE SERVICE (STYLIST & NUTRITION/FITNESS)
// Tách biệt logic gọi backend API và bộ sinh dự phòng thông minh chuẩn Việt
// Gắn nhãn [Mô phỏng AI] minh bạch khi sử dụng offline fallback
// ==========================================================

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-recommender-be.onrender.com/api';

export const STYLIST_OCCASIONS = [
  { id: 'work', label: 'Công sở / Đi học', icon: '💼', vibe: 'Thanh lịch, chỉn chu, Smart Casual' },
  { id: 'cafe', label: 'Cà phê dạo phố', icon: '☕', vibe: 'Thoải mái, tối giản, trẻ trung' },
  { id: 'date', label: 'Hẹn hò lãng mạn', icon: '✨', vibe: 'Duyên dáng, thu hút, điểm nhấn tinh tế' },
  { id: 'party', label: 'Tiệc tùng & Sự kiện', icon: '🥂', vibe: 'Nổi bật, quyến rũ, sang trọng' },
  { id: 'sports', label: 'Tập luyện thể thao', icon: '🏃', vibe: 'Năng động, co giãn, thấm hút mồ hôi' }
];

export const STYLIST_WEATHERS = [
  { id: 'hot', label: 'Nắng ấm (28°C - 33°C)', icon: '☀️', note: 'Chất vải thoáng mát, màu sáng' },
  { id: 'mild', label: 'Dịu mát (22°C - 26°C)', icon: '🍃', note: 'Lý tưởng cho phối layer nhẹ' },
  { id: 'cold_rain', label: 'Se lạnh / Mưa (18°C - 21°C)', icon: '🌧️', note: 'Áo khoác ấm, tông màu ấm áp' }
];

// ==========================================================
// BỘ SƯU TẬP PHỐI ĐỒ THEO TREND 2026 (PHỐI TỰ DO & ĐỒ NGOÀI)
// Hỗ trợ cả phối đầm liền thân (không cần quần) và đồ rời
// ==========================================================
export const FASHION_TRENDS = [
  {
    id: 'quiet_luxury',
    label: 'Quiet Luxury',
    fullName: 'Quiet Luxury (Sang trọng thầm lặng)',
    icon: '💎',
    badge: 'Trending 2026',
    desc: 'Đầm lụa liền thân tối giản thượng lưu, không cần quần',
    isOnePiece: true,
    outfit: {
      title: 'The Quiet Elegance (Đầm Liền Thân Lụa Thượng Lưu)',
      items: [
        {
          slot: 'Váy liền thân',
          name: 'Đầm lụa Slip Dress dáng suông midi màu Champagne',
          color: 'Vàng Champagne / Be sữa',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '520.000₫',
          storeSuggestion: 'Zara / Local Brand',
          imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
          note: 'Chất liệu lụa rủ tự nhiên, dáng liền kéo dài tỷ lệ chân mà không cần phối thêm quần'
        },
        {
          slot: 'Áo khoác phối cùng',
          name: 'Blazer đũi dáng rộng màu trắng kem sữa',
          color: 'Trắng kem',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '480.000₫',
          storeSuggestion: 'Uniqlo / Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
          note: 'Khoác hờ trên vai tạo vẻ ngoài quyền lực nhưng vẫn phóng khoáng'
        },
        {
          slot: 'Giày dép',
          name: 'Slingback da bóng mũi nhọn gót 5cm',
          color: 'Đen bóng / Kem',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '390.000₫',
          storeSuggestion: 'Charles & Keith / Shopee',
          imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
          note: 'Thanh mảnh, tôn dáng cổ chân thon thả'
        },
        {
          slot: 'Phụ kiện',
          name: 'Túi kẹp nách da bò dập vân tối giản',
          color: 'Nâu cà phê',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '320.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          note: 'Tone màu ấm áp làm bật tổng thể sang trọng'
        }
      ],
      stylingAdvice: '“Với phong cách Quiet Luxury cùng trang phục liền thân, vẻ đẹp đến từ độ rủ tinh tế của chất vải và dáng suông liền mạch. Chỉ cần khoác hờ blazer bên ngoài là bạn đã có diện mạo hoàn hảo cho cả công sở lẫn tiệc trà chiều.”',
      harmonyScore: 98
    }
  },
  {
    id: 'resort_coastal',
    label: 'Resort Nàng Thơ',
    fullName: 'Resort & Nàng Thơ (Váy Liền Thân Maxi Hoa Nhí)',
    icon: '🌸',
    badge: 'Mùa Hè & Du Lịch',
    desc: 'Đầm hoa nhí bồng bềnh dạo biển, thoáng mát',
    isOnePiece: true,
    outfit: {
      title: 'Coastal Blossom (Đầm Liền Thân Nàng Thơ Dạo Biển)',
      items: [
        {
          slot: 'Váy liền thân',
          name: 'Đầm Maxi hai dây nhún ngực hoa nhí pastel bồng bềnh',
          color: 'Hồng phấn / Xanh Pastel',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '380.000₫',
          storeSuggestion: 'Shopee Mall / Local Brand',
          imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
          note: 'Đầm dáng liền 1 mảnh bồng bềnh, hoàn toàn không cần quần, bước đi nhẹ tênh bay bổng'
        },
        {
          slot: 'Áo khoác phối cùng',
          name: 'Cardigan dệt kim len móc mỏng chống nắng',
          color: 'Trắng ngà',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '230.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
          note: 'Khoác nhẹ che bắp tay khi ra nắng hoặc dạo gió chiều biển'
        },
        {
          slot: 'Giày dép',
          name: 'Sandal bệt quai mảnh đan dây La Mã',
          color: 'Nâu bò / Be',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '260.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
          note: 'Thoáng mát, tiện đi dạo cát hoặc chụp ảnh sống ảo'
        },
        {
          slot: 'Phụ kiện',
          name: 'Mũ cói rộng vành đính nơ lụa & Túi cói dạo biển',
          color: 'Màu cói tự nhiên',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '190.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          note: 'Bộ đôi phụ kiện cói bất hủ cho mọi bức ảnh du lịch nghìn like'
        }
      ],
      stylingAdvice: '“Váy liền thân maxi tôn vinh nét nữ tính tự nhiên mà cực kỳ thoải mái vì không bị gò bó. Hãy mix cùng son bóng cam đào và hoa tai ngọc trai nhỏ.”',
      harmonyScore: 99
    }
  },
  {
    id: 'clean_girl',
    label: 'Clean Girl',
    fullName: 'Clean Girl (Thanh lịch & Tối giản Hiện Đại)',
    icon: '🫧',
    badge: 'Viral TikTok',
    desc: 'Áo gân Tank top & Quần suông cạp cao phóng khoáng',
    isOnePiece: false,
    outfit: {
      title: 'Pure Aesthetic (Clean Girl Hiện Đại)',
      items: [
        {
          slot: 'Áo chính',
          name: 'Áo gân Ribbed Tank Top cổ vuông trắng',
          color: 'Trắng tinh khôi',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '185.000₫',
          storeSuggestion: 'Uniqlo / Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
          note: 'Vải cotton gân ôm sát nhẹ, khoe xương quai xanh thanh tú'
        },
        {
          slot: 'Quần / Váy',
          name: 'Quần âu ống suông cạp cao xếp ly vải tuyết mưa',
          color: 'Be sữa / Vàng bơ',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '320.000₫',
          storeSuggestion: 'Local Brand / Shopee',
          imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
          note: 'Cạp cao che khuyết điểm bụng dưới, kéo dài chân tối đa'
        },
        {
          slot: 'Giày dép',
          name: 'Sneaker trắng da trơn Samba / Court retro',
          color: 'Trắng kem',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '650.000₫',
          storeSuggestion: 'Adidas / Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
          note: 'Năng động, di chuyển thoải mái cả ngày'
        },
        {
          slot: 'Phụ kiện',
          name: 'Kính râm gọng Oval kim loại vàng & Túi canvas',
          color: 'Vàng kim / Kem',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '160.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
          note: 'Cặp kính mắt retro tạo thần thái chuẩn Clean Girl'
        }
      ],
      stylingAdvice: '“Bí quyết của Clean Girl là sự gọn gàng: tóc búi củ tỏi thấp (slicked bun), khuyên tai tròn nhỏ màu vàng và đôi sneaker trắng không tì vết.”',
      harmonyScore: 97
    }
  },
  {
    id: 'korean_chic',
    label: 'Korean Chic',
    fullName: 'Korean Chic (Phố Hàn Trẻ Trung)',
    icon: '✨',
    badge: 'K-Drama Style',
    desc: 'Sơ mi kẻ sọc oversized & Quần jeans ống suông',
    isOnePiece: false,
    outfit: {
      title: 'Seoul Minimalist (Chuẩn Phong Cách Hàn Quốc)',
      items: [
        {
          slot: 'Áo chính',
          name: 'Áo sơ mi dáng rộng kẻ sọc xanh pastel (Poplin Shirt)',
          color: 'Xanh Pastel',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '290.000₫',
          storeSuggestion: 'Shopee Mall / Zara',
          imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
          note: 'Phom rộng phóng khoáng, mở 2 cúc cổ tạo cảm giác thoải mái'
        },
        {
          slot: 'Quần / Váy',
          name: 'Quần Jeans ống đứng cạp cao wash xanh cổ điển',
          color: 'Xanh Jeans nhạt',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '360.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
          note: 'Dáng đứng thẳng tôn chân thon gọn'
        },
        {
          slot: 'Giày dép',
          name: 'Giày Mule hở gót da mềm mũi vuông',
          color: 'Be kem',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '310.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
          note: 'Xỏ vào nhanh chóng, êm ái khi đi bộ'
        },
        {
          slot: 'Phụ kiện',
          name: 'Túi đeo chéo nắp gập tối giản (Crossbody Bag)',
          color: 'Đen nhám',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '270.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
          note: 'Tiện dụng đựng điện thoại, son và ví tiền'
        }
      ],
      stylingAdvice: '“Kỹ thuật cắm thùng một bên vạt sơ mi (half-tuck) là bí quyết thời trang của các bạn trẻ Seoul giúp tạo độ phóng khoáng bất đối xứng cực chất.”',
      harmonyScore: 96
    }
  },
  {
    id: 'glamour_party',
    label: 'Dạ Hội & Tiệc Đêm',
    fullName: 'Glamour Night (Đầm Liền Thân Dạ Hội Quyến Rũ)',
    icon: '🥂',
    badge: 'Dạ Tiệc & Gala',
    desc: 'Đầm ôm body xẻ tà quyến rũ, không cần quần',
    isOnePiece: true,
    outfit: {
      title: 'Nightfall Starlight (Đầm Liền Thân Dạ Tiệc Quyến Rũ)',
      items: [
        {
          slot: 'Váy liền thân',
          name: 'Đầm Bodycon cổ yếm liền thân xẻ tà quyến rũ',
          color: 'Đen tuyền / Đỏ rượu vang',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '580.000₫',
          storeSuggestion: 'Zara / Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80',
          note: 'Thiết kế liền thân tôn đường cong chữ S hoàn hảo, không cần thêm quần/chân váy'
        },
        {
          slot: 'Áo khoác phối cùng',
          name: 'Khăn choàng lụa voan mỏng viền kim tuyến',
          color: 'Đen ánh nhũ / Bạc',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '210.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          note: 'Khoác nhẹ qua tay tăng vẻ kiêu sa đài các dưới ánh đèn tiệc'
        },
        {
          slot: 'Giày dép',
          name: 'Giày cao gót quai mảnh Stiletto gót 7cm',
          color: 'Bạc ánh kim / Đen',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '450.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
          note: 'Kéo dài đôi chân, tạo dáng đi kiêu hãnh'
        },
        {
          slot: 'Phụ kiện',
          name: 'Ví cầm tay Clutch ánh bạc đính đá pha lê',
          color: 'Ánh bạc',
          isOwned: false,
          isExternalTrend: true,
          trendBadge: '🔥 Hot Trend 2026',
          estimatedPrice: '340.000₫',
          storeSuggestion: 'Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
          note: 'Bắt sáng lấp lánh dưới ánh đèn dạ tiệc'
        }
      ],
      stylingAdvice: '“Đầm liền thân xẻ tà là nữ hoàng của các buổi tiệc đêm. Hãy tô son đỏ lạnh rượu vang và búi tóc cao để khoe trọn chiếc cổ thiên nga cùng đôi hoa tai lấp lánh.”',
      harmonyScore: 98
    }
  }
];

export const NUTRITION_GOALS = [
  { id: 'fat_loss', label: 'Giảm mỡ & Siết dáng', icon: '🔥', desc: 'Thâm hụt calo, bảo toàn cơ bắp' },
  { id: 'muscle_gain', label: 'Tăng cơ nạc', icon: '💪', desc: 'Giàu đạm chất lượng cao, thặng dư nhẹ' },
  { id: 'maintain', label: 'Duy trì & Khỏe đẹp', icon: '⚖️', desc: 'Cân bằng vi chất, năng lượng bền bỉ' }
];

export const DIET_PREFERENCES = [
  { id: 'viet_home', label: 'Cơm nhà thuần Việt', icon: '🍚', desc: 'Món ăn gia đình quen thuộc, gia giảm dầu mỡ' },
  { id: 'eat_clean', label: 'Eat Clean cao cấp', icon: '🥗', desc: 'Thực phẩm nguyên bản, hấp/áp chảo, ít gia vị' },
  { id: 'high_protein', label: 'Giàu Protein thể hình', icon: '🥩', desc: 'Tối đa hóa thịt nạc, ức gà, trứng, cá hồi' }
];

export const WORKOUT_TIMES = [
  { minutes: 15, label: '15 phút (HIIT nhanh)', intensity: 'Cường độ cao ngắt quãng' },
  { minutes: 30, label: '30 phút (Tiêu chuẩn)', intensity: 'Kết hợp kháng lực & cardio' },
  { minutes: 45, label: '45 phút (Nâng cao)', intensity: 'Tập trung sâu từng nhóm cơ' }
];

function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function matchCategory(cat1, cat2) {
  if (!cat1 || !cat2) return false;
  const n1 = normalizeText(cat1);
  const n2 = normalizeText(cat2);
  return n1 === n2 || n1.includes(n2) || n2.includes(n1);
}

function matchWardrobe(wardrobeItems, category, itemName, fromWardrobe) {
  if (!Array.isArray(wardrobeItems) || wardrobeItems.length === 0) return null;
  const itemsInCat = wardrobeItems.filter(w => !category || matchCategory(w.category, category));
  if (itemsInCat.length === 0) return null;

  const cleanTarget = normalizeText(itemName);
  if (cleanTarget) {
    const directMatch = itemsInCat.find(w => {
      const cleanW = normalizeText(w.name);
      return cleanTarget.includes(cleanW) || cleanW.includes(cleanTarget);
    });
    if (directMatch) return directMatch;
  }

  if (fromWardrobe) {
    return itemsInCat[0];
  }
  return null;
}

class AIService {
  /**
   * Sinh gợi ý phối đồ AI Stylist
   */
  async generateOutfit({ occasion, weather, prioritizeWardrobe, wardrobeItems, userGender = 'Nữ', selectedTrend = null }) {
    // 1. Thử gọi backend nếu có
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/recommend-outfit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: userGender,
          occasion: occasion.label,
          weather: weather.label,
          onlyUseWardrobe: prioritizeWardrobe,
          selectedTrend: selectedTrend?.id || selectedTrend,
          wardrobeItems
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        return this._adaptBackendOutfit(resData.data, { occasion, weather, wardrobeItems, selectedTrend });
      }
    } catch {
      // Backend offline -> chuyển sang hệ thống AI Fallback cục bộ
    }

    // 2. Fallback AI generator mô phỏng chuẩn xác ngữ cảnh và tủ đồ cá nhân
    await new Promise(resolve => setTimeout(resolve, 800)); // Nhịp thở UX chân thực

    return this._generateSimulatedOutfit({ occasion, weather, prioritizeWardrobe, wardrobeItems, userGender, selectedTrend });
  }

  /**
   * Sinh thực đơn và lịch tập AI Nutrition & Fitness
   */
  async generateNutritionAndFitness({ goal, diet, durationMinutes, user, targetCalories, waterTarget }) {
    // 1. Thử gọi backend
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/recommend-fitness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: user?.gender || 'Nữ',
          height: user?.height || 163,
          weight: user?.weight || 51,
          goal: goal.label,
          dietPreference: diet.label,
          durationMinutes
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        return this._adaptBackendFitness(resData.data, { goal, diet, durationMinutes, targetCalories, waterTarget });
      }
    } catch {
      // Fallback
    }

    await new Promise(resolve => setTimeout(resolve, 900));
    return this._generateSimulatedFitness({ goal, diet, durationMinutes, user, targetCalories, waterTarget });
  }

  _adaptBackendOutfit(data, { occasion, weather, wardrobeItems = [] }) {
    let items = [];
    if (Array.isArray(data?.items) && data.items.length > 0) {
      items = data.items.map(item => {
        const matched = matchWardrobe(wardrobeItems, item.slot === 'Áo chính' ? 'Áo' : item.slot === 'Quần / Váy' ? 'Quần/Váy' : item.slot, item.name, item.isOwned);
        return {
          slot: item.slot || 'Trang phục',
          name: matched ? matched.name : (item.name || 'Món đồ thời trang'),
          color: matched ? matched.color : (item.color || 'Tự nhiên'),
          isOwned: !!matched || !!item.isOwned,
          imageUrl: matched ? (matched.imageUrl || matched.image_url) : (item.imageUrl || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80'),
          note: item.note || (matched ? 'Đã có sẵn trong tủ đồ của bạn' : 'Gợi ý phối đồ hài hòa')
        };
      });
    } else {
      const ownedTop = wardrobeItems.find(i => i.category === 'Áo');
      const ownedBottom = wardrobeItems.find(i => i.category === 'Quần/Váy');
      const ownedShoes = wardrobeItems.find(i => i.category === 'Giày dép');
      const ownedAccessory = wardrobeItems.find(i => i.category === 'Phụ kiện');

      const topName = typeof data?.top === 'object' ? data.top.item : (data?.top || (ownedTop ? ownedTop.name : 'Sơ mi lụa màu pastel'));
      const bottomName = typeof data?.bottom === 'object' ? data.bottom.item : (data?.bottom || (ownedBottom ? ownedBottom.name : 'Quần âu ống suông cạp cao'));
      const shoesName = typeof data?.shoes === 'object' ? data.shoes.item : (data?.shoes || (ownedShoes ? ownedShoes.name : 'Loafers da trơn màu kem sữa'));
      const accessoryName = Array.isArray(data?.accessories) && data.accessories.length > 0 
        ? data.accessories[0] 
        : (ownedAccessory ? ownedAccessory.name : 'Túi xách da kẹp nách baguette');

      const matchedTop = matchWardrobe(wardrobeItems, 'Áo', topName, typeof data?.top === 'object' && data.top.fromWardrobe);
      const matchedBottom = matchWardrobe(wardrobeItems, 'Quần/Váy', bottomName, typeof data?.bottom === 'object' && data.bottom.fromWardrobe);
      const matchedShoes = matchWardrobe(wardrobeItems, 'Giày dép', shoesName, typeof data?.shoes === 'object' && data.shoes.fromWardrobe);
      const matchedAcc = matchWardrobe(wardrobeItems, 'Phụ kiện', accessoryName, true);

      items = [
        {
          slot: 'Áo chính',
          name: matchedTop ? matchedTop.name : topName,
          color: matchedTop ? matchedTop.color : 'Tone thanh lịch',
          isOwned: !!matchedTop,
          imageUrl: matchedTop ? (matchedTop.imageUrl || matchedTop.image_url) : 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80',
          note: typeof data?.top === 'object' && data.top.reason ? data.top.reason : (matchedTop ? 'Đã có sẵn trong tủ đồ của bạn' : 'Chất liệu thoáng nhẹ, tôn dáng')
        },
        {
          slot: 'Quần / Váy',
          name: matchedBottom ? matchedBottom.name : bottomName,
          color: matchedBottom ? matchedBottom.color : 'Be / Đen / Trung tính',
          isOwned: !!matchedBottom,
          imageUrl: matchedBottom ? (matchedBottom.imageUrl || matchedBottom.image_url) : 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80',
          note: typeof data?.bottom === 'object' && data.bottom.reason ? data.bottom.reason : (matchedBottom ? 'Đã có sẵn trong tủ đồ của bạn' : 'Cạp cao che khuyết điểm, tạo hiệu ứng chân dài')
        },
        {
          slot: 'Giày dép',
          name: matchedShoes ? matchedShoes.name : shoesName,
          color: matchedShoes ? matchedShoes.color : 'Kem / Đen',
          isOwned: !!matchedShoes,
          imageUrl: matchedShoes ? (matchedShoes.imageUrl || matchedShoes.image_url) : 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
          note: matchedShoes ? 'Đã có sẵn trong tủ đồ của bạn' : 'Di chuyển êm ái, phù hợp hoàn cảnh'
        },
        {
          slot: 'Phụ kiện',
          name: matchedAcc ? matchedAcc.name : accessoryName,
          color: matchedAcc ? matchedAcc.color : 'Tone đồng điệu',
          isOwned: !!matchedAcc,
          imageUrl: matchedAcc ? (matchedAcc.imageUrl || matchedAcc.image_url) : 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80',
          note: matchedAcc ? 'Đã có sẵn trong tủ đồ của bạn' : 'Điểm nhấn tinh tế hoàn thiện set đồ'
        }
      ];
    }

    let missingSuggestion = {
      name: 'Khăn lụa quàng cổ họa tiết trừu tượng (Silk Twilly)',
      category: 'Phụ kiện',
      estimatedPrice: '189.000₫',
      storeSuggestion: 'Shopee Mall / Local Brand',
      reason: 'Tạo điểm nhấn cuốn hút, biến outfit quen thuộc thành lookbook chuẩn phong cách.'
    };
    if (data?.missingSuggestion && typeof data.missingSuggestion === 'object') {
      missingSuggestion = {
        name: data.missingSuggestion.name || missingSuggestion.name,
        category: data.missingSuggestion.category || 'Phụ kiện / Món đồ thêm',
        estimatedPrice: data.missingSuggestion.estimatedPrice || '199.000₫',
        storeSuggestion: data.missingSuggestion.storeSuggestion || 'Shopee Mall',
        reason: data.missingSuggestion.reason || missingSuggestion.reason
      };
    } else if (typeof data?.missingItemSuggestion === 'string' && data.missingItemSuggestion.trim()) {
      missingSuggestion.name = data.missingItemSuggestion.trim();
      missingSuggestion.reason = 'Món đồ gợi ý sắm thêm để nâng tầm set đồ này.';
    }

    const title = data?.title || `Bản phối ${occasion?.label || ''} (${occasion?.vibe || 'Tối giản & Sang trọng'})`;
    const stylingAdvice = data?.stylingAdvice || data?.stylingTip || `“Với thời tiết ${weather?.label?.toLowerCase() || 'mát mẻ'} và dịp ${occasion?.label?.toLowerCase() || 'dạo phố'}, hãy giữ tổng thể gọn gàng, phối màu hài hòa và tự tin với phong thái của bạn!”`;

    return {
      title,
      occasion: occasion?.label || data?.occasion || 'Dạo phố',
      weather: weather?.label || data?.weather || 'Dịu mát',
      harmonyScore: Number(data?.harmonyScore) || 97,
      items,
      missingSuggestion,
      stylingAdvice,
      isSimulated: false,
      source: 'Groq AI Backend Engine'
    };
  }

  _adaptBackendFitness(data, { goal, diet, durationMinutes, targetCalories = 1650, waterTarget = 2100 }) {
    let meals = [];
    if (Array.isArray(data?.meals) && data.meals.length > 0) {
      meals = data.meals;
    } else if (data?.meals && typeof data.meals === 'object') {
      const mealKeys = [
        { key: 'breakfast', name: 'Bữa sáng', time: '07:00 - 08:00', defaultDish: 'Cháo yến mạch ức gà & trứng chần' },
        { key: 'lunch', name: 'Bữa trưa', time: '12:00 - 13:00', defaultDish: 'Cơm gạo lứt, cá thu áp chảo & canh cải ngọt' },
        { key: 'snack', name: 'Bữa phụ chiều', time: '16:00 - 16:30', defaultDish: 'Trái cây tươi & hạt hạnh nhân rang mộc' },
        { key: 'dinner', name: 'Bữa tối', time: '18:30 - 19:30', defaultDish: 'Thịt thăn nạc luộc cuốn bánh tráng & rau sống' }
      ];

      meals = mealKeys.map(mk => {
        const m = data.meals[mk.key] || {};
        return {
          name: mk.name,
          time: mk.time,
          dish: m.name || mk.defaultDish,
          calories: Number(m.calories) || Math.round(targetCalories * 0.25),
          ingredients: m.macros ? [m.macros] : ['Cân đối dinh dưỡng', 'Gia vị thanh nhẹ'],
          tip: m.macros ? `Dinh dưỡng: ${m.macros}` : 'Duy trì năng lượng bền bỉ cho cơ thể.'
        };
      });
    }

    let exercises = [];
    const rawExercises = data?.workout?.exercises || data?.exercises;
    if (Array.isArray(rawExercises) && rawExercises.length > 0) {
      exercises = rawExercises.map((ex, idx) => ({
        id: `ex_${idx + 1}`,
        name: ex.name || 'Bài tập vận động',
        targetMuscle: ex.targetMuscle || data?.workout?.focusArea || 'Toàn thân & Cơ lõi',
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps || '12 - 15 lần'),
        rest: ex.rest || `${ex.restSeconds || 45} giây`,
        instructions: ex.instructions || ex.tip || 'Giữ nhịp thở đều và siết chặt cơ khi thực hiện.'
      }));
    }

    const calculatedTotalCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);

    return {
      goalName: goal?.label || data?.goalName || 'Giảm mỡ & Siết dáng',
      dietName: diet?.label || data?.dietName || 'Eat Clean chuẩn Việt',
      durationMinutes: Number(durationMinutes || data?.workout?.durationMinutes || 30),
      dailyCalorieTarget: Number(data?.healthMetrics?.targetCalories) || Number(targetCalories) || 1650,
      totalMealCalories: calculatedTotalCalories || targetCalories,
      waterTargetMl: data?.healthMetrics?.waterIntakeLiters ? Math.round(data.healthMetrics.waterIntakeLiters * 1000) : waterTarget,
      meals: meals.length > 0 ? meals : this._generateSimulatedFitness({ goal, diet, durationMinutes, targetCalories, waterTarget }).meals,
      exercises: exercises.length > 0 ? exercises : this._generateSimulatedFitness({ goal, diet, durationMinutes, targetCalories, waterTarget }).exercises,
      isSimulated: false,
      source: 'Groq AI Backend Engine'
    };
  }

  // ==========================================
  // BỘ TẠO DỮ LIỆU MÔ PHỎNG NỘI ĐỊA HÓA CAO CẤP
  // ==========================================
  _generateSimulatedOutfit({ occasion, weather, prioritizeWardrobe, wardrobeItems = [], selectedTrend = null }) {
    // -------------------------------------------------------------
    // CHẾ ĐỘ 1: PHỐI TỰ DO THEO XU HƯỚNG MỚI (LẤY ĐỒ BÊN NGOÀI & HOT TREND 2026)
    // -------------------------------------------------------------
    if (!prioritizeWardrobe) {
      let trend = FASHION_TRENDS.find(t => t.id === selectedTrend?.id || t.id === selectedTrend);
      if (!trend) {
        if (occasion.id === 'party') {
          trend = FASHION_TRENDS.find(t => t.id === 'glamour_party') || FASHION_TRENDS[0];
        } else if (occasion.id === 'date') {
          trend = FASHION_TRENDS.find(t => t.id === 'resort_coastal') || FASHION_TRENDS[0];
        } else if (occasion.id === 'work') {
          trend = FASHION_TRENDS.find(t => t.id === 'quiet_luxury') || FASHION_TRENDS[0];
        } else {
          trend = FASHION_TRENDS.find(t => t.id === 'clean_girl') || FASHION_TRENDS[0];
        }
      }

      const outfitData = trend.outfit;
      return {
        title: `${outfitData.title}`,
        occasion: occasion.label,
        weather: weather.label,
        harmonyScore: outfitData.harmonyScore || 98,
        isOnePiece: !!trend.isOnePiece,
        trendId: trend.id,
        trendName: trend.label,
        trendBadge: trend.badge,
        items: outfitData.items,
        missingSuggestion: {
          name: trend.isOnePiece ? 'Khuyên tai ngọc trai tự nhiên hoặc Dây chuyền mảnh' : 'Kính râm gọng kim loại retro',
          category: 'Phụ kiện',
          estimatedPrice: '189.000₫',
          storeSuggestion: 'Shopee Mall / Local Brand',
          reason: 'Món đồ giúp hoàn thiện đường nét khuôn mặt và thần thái cuốn hút.'
        },
        stylingAdvice: outfitData.stylingAdvice,
        isSimulated: true,
        source: `AI Trend Forecast 2026 (${trend.fullName})`
      };
    }

    // -------------------------------------------------------------
    // CHẾ ĐỘ 2: PHỐI TỪ TỦ ĐỒ CỦA BẠN (ƯU TIÊN ĐỒ SẴN CÓ)
    // Xử lý thông minh: Nếu có Đầm/Váy liền thân -> KHÔNG CẦN QUẦN!
    // -------------------------------------------------------------
    const ownedOnePiece = wardrobeItems.find(i => {
      const cat = (i.category || '').toLowerCase();
      const nm = (i.name || '').toLowerCase();
      return cat === 'váy liền thân' || cat.includes('đầm') || cat.includes('liền') || cat.includes('maxi') || cat.includes('jumpsuit') || nm.includes('đầm') || nm.includes('váy liền') || nm.includes('jumpsuit');
    });

    const ownedTop = wardrobeItems.find(i => i.category === 'Áo');
    const ownedBottom = wardrobeItems.find(i => i.category === 'Quần/Váy' || i.category === 'Quần' || i.category === 'Chân váy');
    const ownedShoes = wardrobeItems.find(i => i.category === 'Giày dép');
    const ownedAccessory = wardrobeItems.find(i => i.category === 'Phụ kiện');

    // Nếu người dùng có váy liền thân và hoàn cảnh tiệc/hẹn hò (hoặc tủ đồ không đủ cả áo lẫn quần) -> Tự động phối Đầm liền thân
    const preferOnePiece = ownedOnePiece && (occasion.id === 'party' || occasion.id === 'date' || (!ownedTop && !ownedBottom) || !ownedBottom);

    if (preferOnePiece) {
      const items = [
        {
          slot: 'Váy liền thân',
          name: ownedOnePiece.name,
          color: ownedOnePiece.color || 'Tone thanh nhã',
          isOwned: true,
          imageUrl: ownedOnePiece.imageUrl || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
          note: 'Trang phục dáng liền 1 mảnh tôn dáng tự nhiên — không cần phối thêm quần/váy!'
        },
        {
          slot: 'Áo khoác phối cùng',
          name: ownedTop && (ownedTop.name.toLowerCase().includes('blazer') || ownedTop.name.toLowerCase().includes('khoác') || ownedTop.name.toLowerCase().includes('cardigan'))
            ? ownedTop.name 
            : 'Blazer mỏng hoặc Cardigan len dệt kim mỏng nhẹ',
          color: ownedTop ? ownedTop.color : 'Trắng kem / Be sữa',
          isOwned: !!(ownedTop && (ownedTop.name.toLowerCase().includes('blazer') || ownedTop.name.toLowerCase().includes('khoác'))),
          isExternalTrend: !(ownedTop && (ownedTop.name.toLowerCase().includes('blazer') || ownedTop.name.toLowerCase().includes('khoác'))),
          trendBadge: '🔥 Gợi ý phối kèm',
          estimatedPrice: '380.000₫',
          storeSuggestion: 'Uniqlo / Shopee Mall',
          imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80',
          note: 'Khoác hờ trên vai giữ ấm nhẹ và tăng độ sang trọng cho chiếc đầm'
        },
        {
          slot: 'Giày dép',
          name: ownedShoes ? ownedShoes.name : 'Loafers da trơn màu kem sữa đế 3cm',
          color: ownedShoes ? ownedShoes.color : 'Kem / Be',
          isOwned: !!ownedShoes,
          imageUrl: ownedShoes ? ownedShoes.imageUrl : 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
          note: ownedShoes ? 'Đã có sẵn trong tủ đồ của bạn' : 'Giúp đôi chân trông dài và thanh thoát hơn'
        },
        {
          slot: 'Phụ kiện',
          name: ownedAccessory ? ownedAccessory.name : 'Túi xách da kẹp nách baguette tone nâu cà phê',
          color: ownedAccessory ? ownedAccessory.color : 'Nâu cà phê',
          isOwned: !!ownedAccessory,
          imageUrl: ownedAccessory ? ownedAccessory.imageUrl : 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80',
          note: ownedAccessory ? 'Đã có sẵn trong tủ đồ' : 'Điểm nhấn tone ấm hoàn thiện set đồ'
        }
      ];

      return {
        title: `The Seamless One-Piece (Bản Phối Đầm Liền Thân: ${ownedOnePiece.name})`,
        occasion: occasion.label,
        weather: weather.label,
        harmonyScore: 98,
        isOnePiece: true,
        items,
        missingSuggestion: {
          name: 'Khăn lụa vuông thắt nơ hoặc Vòng cổ ngọc trai mảnh',
          category: 'Phụ kiện',
          estimatedPrice: '145.000₫',
          storeSuggestion: 'Shopee Mall',
          reason: 'Điểm xuyết nhẹ nhàng ở cổ áo giúp chiếc đầm thêm phần nổi bật.'
        },
        stylingAdvice: `“Váy liền thân là giải pháp thông minh tuyệt đối vì bạn hoàn toàn không cần lo lắng về việc phối quần/váy sao cho ăn khớp. Hãy tập trung vào tỷ lệ thắt eo và chọn đôi giày cùng tone màu để đôi chân dài miên man!”`,
        isSimulated: true,
        source: 'Mô phỏng AI Stylist Chuẩn Phong Cách'
      };
    }

    // NẾU LÀ PHỐI 2 MẢNH RỜI (ÁO CHÍNH + QUẦN/VÁY)
    let outfitTitle = 'The Soft Minimalist (Nhã nhặn & Tinh khôi)';
    let harmonyScore = 96;

    if (occasion.id === 'work') {
      outfitTitle = 'Smart Chic Office (Thanh lịch Công sở Hiện đại)';
      harmonyScore = 98;
    } else if (occasion.id === 'date') {
      outfitTitle = 'Romantic Twilight (Dịu dàng & Cuốn hút)';
      harmonyScore = 97;
    } else if (occasion.id === 'party') {
      outfitTitle = 'Glamour Nightfall (Nổi bật & Sang trọng)';
      harmonyScore = 95;
    } else if (occasion.id === 'sports') {
      outfitTitle = 'Active Breath (Năng động & Thoáng khí)';
      harmonyScore = 99;
    }

    const items = [
      {
        slot: 'Áo chính',
        name: ownedTop ? ownedTop.name : 'Sơ mi lụa màu hoa cà pastel (Mulberry Silk)',
        color: ownedTop ? ownedTop.color : 'Tím Lavender',
        isOwned: !!ownedTop,
        imageUrl: ownedTop ? ownedTop.imageUrl : 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80',
        note: ownedTop ? 'Đã có sẵn trong tủ đồ của bạn' : 'Chất liệu lụa thoáng nhẹ, tôn dáng cổ'
      },
      {
        slot: 'Quần / Váy',
        name: ownedBottom ? ownedBottom.name : 'Quần âu ống suông cạp cao màu be kem',
        color: ownedBottom ? ownedBottom.color : 'Be sữa',
        isOwned: !!ownedBottom,
        imageUrl: ownedBottom ? ownedBottom.imageUrl : 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80',
        note: ownedBottom ? 'Đã có sẵn trong tủ đồ của bạn' : 'Cạp cao che khuyết điểm, tạo hiệu ứng chân dài'
      },
      {
        slot: 'Giày dép',
        name: ownedShoes ? ownedShoes.name : 'Loafers da trơn màu kem sữa đế 3cm',
        color: ownedShoes ? ownedShoes.color : 'Kem / Be',
        isOwned: !!ownedShoes,
        imageUrl: ownedShoes ? ownedShoes.imageUrl : 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
        note: ownedShoes ? 'Đã có sẵn trong tủ đồ' : 'Di chuyển êm ái cả ngày không đau mỏi chân'
      },
      {
        slot: 'Phụ kiện',
        name: ownedAccessory ? ownedAccessory.name : 'Túi xách da kẹp nách baguette tone nâu cà phê',
        color: ownedAccessory ? ownedAccessory.color : 'Nâu cà phê',
        isOwned: !!ownedAccessory,
        imageUrl: ownedAccessory ? ownedAccessory.imageUrl : 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80',
        note: ownedAccessory ? 'Đã có sẵn trong tủ đồ' : 'Điểm nhấn tone ấm hoàn thiện set đồ'
      }
    ];

    // Gợi ý món đồ còn thiếu để mua sắm
    const missingSuggestion = {
      name: 'Khăn lụa quàng cổ họa tiết trừu tượng (Silk Twilly)',
      category: 'Phụ kiện',
      estimatedPrice: '189.000₫',
      storeSuggestion: 'Zara / Shopee Mall',
      reason: 'Tạo điểm nhấn cuốn hút ở cổ áo sơ mi, biến outfit quen thuộc thành lookbook chuẩn tạp chí thời trang.'
    };

    const stylingAdvice = `“Với thời tiết ${weather.label.toLowerCase()} và dịp ${occasion.label.toLowerCase()}, bạn nên áp dụng kỹ thuật sơ vin vạt trước nhẹ nhàng (French tuck) để tạo tỷ lệ cơ thể thanh thoát. Hãy mix cùng son tông hồng đất hoặc cam đào nhẹ để giữ nét rạng ngời tự nhiên suốt cả ngày.”`;

    return {
      title: outfitTitle,
      occasion: occasion.label,
      weather: weather.label,
      harmonyScore,
      isOnePiece: false,
      items,
      missingSuggestion,
      stylingAdvice,
      isSimulated: true,
      source: 'Mô phỏng AI Stylist Chuẩn Phong Cách'
    };
  }

  _generateSimulatedFitness({ goal, diet, durationMinutes, _user, targetCalories = 1650, waterTarget = 2100 }) {
    // 4 Bữa ăn hàng ngày
    const meals = [
      {
        name: 'Bữa sáng',
        time: '07:00 - 08:00',
        dish: diet.id === 'viet_home' ? 'Cháo yến mạch ức gà xé nấm hương & trứng chần' : 'Yogurt Hy Lạp hạt chia, chuối chín & dâu tây',
        calories: Math.round(targetCalories * 0.25),
        ingredients: ['1 quả trứng gà luộc lòng đào', '45g yến mạch cán dẹt', '70g ức gà hấp xé nhỏ', 'Hành ngò, tiêu xay, nấm hương tươi'],
        tip: 'Khởi động quá trình trao đổi chất buổi sáng, no lâu không đầy bụng.'
      },
      {
        name: 'Bữa trưa',
        time: '12:00 - 13:00',
        dish: diet.id === 'viet_home' ? 'Cơm gạo lứt huyết rồng, cá thu áp chảo sốt cà & canh cải ngọt' : 'Bowl cơm lứt ức gà nướng mè, bơ lát & bông cải xanh sốt mè rang',
        calories: Math.round(targetCalories * 0.38),
        ingredients: ['120g cơm lứt nấu dẻo', '130g cá thu hoặc ức gà áp chảo', '150g canh rau cải ngọt nấu tôm băm', '1/4 quả bơ sáp tươi'],
        tip: 'Giàu đạm và chất xơ, duy trì năng lượng ổn định chống cơn buồn ngủ đầu giờ chiều.'
      },
      {
        name: 'Bữa phụ chiều',
        time: '16:00 - 16:30',
        dish: 'Sinh tố bơ đậu phộng chuối & bột whey hạt điều (hoặc 1 quả táo xanh + 10 hạt hạnh nhân)',
        calories: Math.round(targetCalories * 0.12),
        ingredients: ['1 quả táo xanh giòn', '12 hạt hạnh nhân rang mộc nguyên vị', '200ml trà xanh ấm không đường'],
        tip: 'Nạp năng lượng tức thì trước buổi tập luyện cuối ngày.'
      },
      {
        name: 'Bữa tối',
        time: '18:30 - 19:30',
        dish: diet.id === 'viet_home' ? 'Thịt thăn heo luộc cuốn bánh tráng rau rừng chấm mắm nêm gia giảm' : 'Salad cá hồi áp chảo rau mầm, cà chua bi & trứng cút sốt dầu giấm',
        calories: Math.round(targetCalories * 0.25),
        ingredients: ['120g thịt thăn heo nạc luộc chín tới', 'Rau thơm các loại, dưa chuột thái lát', 'Bánh tráng gạo lứt', '1 thìa canh nước chấm thanh nhẹ'],
        tip: 'Hạn chế tinh bột nhanh vào ban đêm để cơ thể dễ dàng đốt mỡ thừa khi ngủ.'
      }
    ];

    const totalMealCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    // Danh sách bài tập có Interactive Checkbox
    const exercises = [
      {
        id: 'ex_1',
        name: 'Bodyweight Squats (Ngồi xổm tay trước ngực)',
        targetMuscle: 'Đùi trước, cơ mông & lõi cơ thể',
        sets: 4,
        reps: '15 - 20 lần',
        rest: '45 giây',
        instructions: 'Giữ lưng thẳng tự nhiên, siết chặt cơ bụng và đẩy đầu gối hướng ra theo mũi chân.'
      },
      {
        id: 'ex_2',
        name: 'Knee Push-ups hoặc Full Incline Push-ups',
        targetMuscle: 'Ngực, vai trước và tay sau',
        sets: 3,
        reps: '12 - 15 lần',
        rest: '45 giây',
        instructions: 'Hạ ngực chạm gần mặt sàn, đẩy dứt khoát lên và thở đều qua miệng.'
      },
      {
        id: 'ex_3',
        name: 'Glute Bridge (Cầu nâng mông siết eo)',
        targetMuscle: 'Cơ mông lớn & đùi sau',
        sets: 4,
        reps: '15 lần (giữ 2s trên đỉnh)',
        rest: '30 giây',
        instructions: 'Nhấn gót chân xuống sàn, nâng hông lên cao cho đến khi đùi và thân tạo thành đường thẳng.'
      },
      {
        id: 'ex_4',
        name: 'Plank tĩnh siết chặt cơ bụng (Core Hold)',
        targetMuscle: 'Toàn bộ khối cơ trung tâm & cơ liên sườn',
        sets: 3,
        reps: '45 - 60 giây / hiệp',
        rest: '45 giây',
        instructions: 'Không để võng lưng dưới, mắt nhìn nhẹ về phía trước hai cẳng tay.'
      },
      {
        id: 'ex_5',
        name: 'Jumping Jacks hoặc Đi bộ ép tim nhẹ',
        targetMuscle: 'Cardio đốt mỡ toàn thân',
        sets: 3,
        reps: '45 giây liên tục',
        rest: '30 giây',
        instructions: 'Bật nhảy nhịp nhàng, tiếp đất bằng mũi chân để bảo vệ khớp gối.'
      }
    ];

    return {
      goalName: goal.label,
      dietName: diet.label,
      durationMinutes,
      dailyCalorieTarget: targetCalories,
      totalMealCalories,
      waterTargetMl: waterTarget,
      meals,
      exercises,
      isSimulated: true,
      source: 'Mô phỏng AI Nutritionist & Fitness Coach'
    };
  }
}

export const aiService = new AIService();
