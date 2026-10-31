// ==========================================================
// DIGITAL WARDROBE SERVICE
// Quản lý tủ đồ số cá nhân, upload ảnh và thực thi hạn mức FREE 8 món
// ==========================================================

const WARDROBE_STORAGE_KEY = 'ai_lifestyle_wardrobe_v2';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const WARDROBE_CATEGORIES = [
  { id: 'Tất cả', name: 'Tất cả', icon: '✨' },
  { id: 'Áo', name: 'Áo', icon: '👕', sub: 'Tops, sơ mi, áo thun, blazer' },
  { id: 'Quần/Váy', name: 'Quần & Váy', icon: '👖', sub: 'Bottoms, quần âu, jeans, chân váy' },
  { id: 'Giày dép', name: 'Giày dép', icon: '👟', sub: 'Shoes, sneakers, loafers, cao gót' },
  { id: 'Phụ kiện', name: 'Phụ kiện', icon: '🕶️', sub: 'Accessories, túi xách, đồng hồ, khăn' }
];

export const POPULAR_COLORS = [
  { name: 'Trắng', hex: '#FFFFFF', border: true },
  { name: 'Đen', hex: '#1E1E24' },
  { name: 'Be sữa', hex: '#F5EBE0' },
  { name: 'Xanh Navy', hex: '#1D3557' },
  { name: 'Xanh Jeans', hex: '#457B9D' },
  { name: 'Tím Lavender', hex: '#C4B5FD' },
  { name: 'Hồng Pastel', hex: '#FECDD3' },
  { name: 'Xanh Sage', hex: '#A7F3D0' },
  { name: 'Nâu Cà phê', hex: '#78593A' },
  { name: 'Xám Khói', hex: '#94A3B8' }
];

export const CURATED_PRESETS = [
  {
    name: 'Sơ mi lụa màu hoa cà pastel',
    category: 'Áo',
    color: 'Tím Lavender',
    notes: 'Chất liệu lụa tơ tằm mềm mại, thoáng khí, hợp công sở & cafe',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Áo thun cotton trắng tối giản',
    category: 'Áo',
    color: 'Trắng',
    notes: 'Cotton 100% thoáng mát, form suông relaxed',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Quần âu ống suông cạp cao màu be',
    category: 'Quần/Váy',
    color: 'Be sữa',
    notes: 'Vải tuyết mưa đứng form, tôn dáng chân dài',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Quần Jeans Slimfit xanh cổ điển',
    category: 'Quần/Váy',
    color: 'Xanh Jeans',
    notes: 'Denim co giãn nhẹ, phù hợp dạo phố cuối tuần',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Loafers da trơn màu kem sữa',
    category: 'Giày dép',
    color: 'Be sữa',
    notes: 'Da bò microfiber êm chân, đế cao su nguyên khối 3cm',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Đồng hồ dây da vintage tối giản',
    category: 'Phụ kiện',
    color: 'Nâu Cà phê',
    notes: 'Mặt số mạ vàng champagne, dây da thật cao cấp',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80'
  }
];

class WardrobeService {
  constructor() {
    this.items = this._loadInitialItems();
  }

  _loadInitialItems() {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(WARDROBE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Khởi tạo các món mẫu cho trải nghiệm đầu tiên
      const initial = CURATED_PRESETS.map((preset, idx) => ({
        id: `wd_${Date.now()}_${idx}`,
        ...preset,
        createdAt: new Date().toISOString()
      }));
      localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  }

  getAllItems() {
    return this.items;
  }

  /**
   * Kiểm tra hạn mức thêm đồ (FREE giới hạn 8 món)
   */
  canAddItem(userPlan) {
    if (userPlan === 'PRO') return { allowed: true };
    const currentCount = this.items.length;
    if (currentCount >= 8) {
      return {
        allowed: false,
        reason: 'Bạn đã đạt giới hạn 8 món của bản FREE. Nâng cấp PRO VIP để sở hữu tủ đồ vô hạn!',
        currentCount,
        maxCount: 8
      };
    }
    return { allowed: true, currentCount, maxCount: 8 };
  }

  addItem(itemData, userPlan = 'FREE', userEmail = '') {
    const quotaCheck = this.canAddItem(userPlan);
    if (!quotaCheck.allowed) {
      throw new Error(quotaCheck.reason);
    }

    const newItem = {
      id: 'wd_' + Date.now(),
      user_email: userEmail || itemData.user_email || '',
      name: itemData.name.trim(),
      category: itemData.category || 'Áo',
      color: itemData.color || 'Trắng',
      notes: (itemData.notes || '').trim(),
      imageUrl: itemData.imageUrl || CURATED_PRESETS[0].imageUrl,
      image_url: itemData.imageUrl || itemData.image_url || CURATED_PRESETS[0].imageUrl,
      createdAt: new Date().toISOString()
    };

    this.items = [newItem, ...this.items];
    this._persist();
    this._syncAddBackend(newItem);
    return newItem;
  }

  updateItem(id, updateData) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Không tìm thấy món trang phục.');

    this.items[index] = {
      ...this.items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this._persist();
    return this.items[index];
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this._persist();
    this._syncDeleteBackend(id);
    return true;
  }

  _persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  async fetchUserWardrobe(userEmail) {
    if (!userEmail) return this.items;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/wardrobe?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        if (data.items.length > 0) {
          const mapped = data.items.map(it => ({
            id: it.id,
            user_email: it.user_email,
            name: it.name,
            category: it.category,
            color: it.color,
            imageUrl: it.image_url || it.imageUrl,
            image_url: it.image_url || it.imageUrl,
            notes: it.notes || '',
            createdAt: it.created_at || it.createdAt || new Date().toISOString()
          }));
          this.items = mapped;
          this._persist();
          return mapped;
        } else if (this.items.length > 0) {
          // Đồng bộ các món ban đầu của user lên server
          for (const item of this.items) {
            await this._syncAddBackend({ ...item, user_email: userEmail });
          }
        }
      }
    } catch {
      // Offline fallback
    }
    return this.items;
  }

  async _syncAddBackend(item) {
    try {
      await fetch(`${BACKEND_BASE_URL}/wardrobe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          user_email: item.user_email,
          name: item.name,
          category: item.category,
          color: item.color,
          image_url: item.imageUrl || item.image_url
        })
      });
    } catch {
      // Backend có thể offline, frontend lưu persistent
    }
  }

  async _syncDeleteBackend(id) {
    try {
      await fetch(`${BACKEND_BASE_URL}/wardrobe/${id}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
  }
}

export const wardrobeService = new WardrobeService();
