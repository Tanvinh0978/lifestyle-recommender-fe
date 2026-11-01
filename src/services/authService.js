// ==========================================================
// AUTHENTICATION & USER PROFILE SERVICE
// Sẵn sàng kết nối Supabase và đồng bộ server-side
// ==========================================================

const USER_STORAGE_KEY = 'ai_lifestyle_user_v2';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-recommender-be.onrender.com/api';

export const DEFAULT_USER = {
  id: 'usr_demo_01',
  name: 'Mai Linh',
  email: 'mailinh.lifestyle@gmail.com',
  city: 'Hà Nội',
  gender: 'Nữ',
  age: 24,
  height: 163,
  weight: 51,
  activityLevel: 'moderate', // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  healthGoal: 'fat_loss',     // 'fat_loss' | 'maintain' | 'muscle_gain'
  dietPreference: 'Eat Clean',
  plan: 'FREE', // 'FREE' | 'PRO'
  aiUsageCount: 1, // Đã dùng 1 lượt ban đầu
  adRewardCount: 0, // Đã xem bao nhiêu quảng cáo hôm nay (tối đa 3 lần)
  lastUsageDate: new Date().toISOString().slice(0, 10),
  waterConsumedMl: 1500,
  caloriesConsumed: 1250,
  workoutMinutesCompleted: 25
};

class AuthService {
  constructor() {
    this.user = this._loadInitialUser();
  }

  _loadInitialUser() {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      // Reset lượt AI nếu qua ngày mới
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastUsageDate !== today) {
        parsed.aiUsageCount = 0;
        parsed.adRewardCount = 0;
        parsed.lastUsageDate = today;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  }

  getCurrentUser() {
    return this.user;
  }

  saveUser(updatedUser) {
    this.user = { ...updatedUser };
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user));
    }
    // Gửi sync ngầm lên backend/Supabase
    this._syncToServer(this.user);
    return this.user;
  }

  updateProfile(profileData) {
    const updated = {
      ...this.user,
      ...profileData
    };
    return this.saveUser(updated);
  }

  login(name, email, additionalData = {}) {
    const today = new Date().toISOString().slice(0, 10);
    const newUser = {
      ...DEFAULT_USER,
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      city: additionalData.city || 'Hà Nội',
      lastUsageDate: today,
      aiUsageCount: 0,
      adRewardCount: 0,
      ...additionalData
    };
    return this.saveUser(newUser);
  }

  logout() {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  /**
   * Kiểm tra và trừ lượt dùng AI (Server-side & Local)
   * Mỗi tài khoản có 3 lượt khởi đầu. Khi hết 3 lượt, có thể xem quảng cáo (tối đa 3 lần/ngày) để nhận thêm từng lượt.
   */
  canUseAI() {
    if (!this.user) return false;
    if (this.user.plan === 'PRO') return true;
    const maxQuota = 3 + (this.user.adRewardCount || 0);
    return (this.user.aiUsageCount || 0) < maxQuota;
  }

  consumeAIQuota() {
    if (!this.user) return false;
    if (this.user.plan === 'PRO') return true;
    if (!this.canUseAI()) return false;

    const updated = {
      ...this.user,
      aiUsageCount: (this.user.aiUsageCount || 0) + 1
    };
    this.saveUser(updated);
    return true;
  }

  getRemainingAIQuota() {
    if (!this.user) return 0;
    if (this.user.plan === 'PRO') return Infinity;
    const maxQuota = 3 + (this.user.adRewardCount || 0);
    return Math.max(0, maxQuota - (this.user.aiUsageCount || 0));
  }

  canWatchAd() {
    if (!this.user || this.user.plan === 'PRO') return false;
    return (this.user.adRewardCount || 0) < 3;
  }

  getRemainingAdsCount() {
    if (!this.user || this.user.plan === 'PRO') return 0;
    return Math.max(0, 3 - (this.user.adRewardCount || 0));
  }

  /**
   * Xem quảng cáo thành công -> cộng thêm 1 lượt AI (tối đa 3 lần/ngày)
   */
  rewardAdWatch() {
    if (!this.user || !this.canWatchAd()) return false;
    const updated = {
      ...this.user,
      adRewardCount: (this.user.adRewardCount || 0) + 1
    };
    this.saveUser(updated);
    return true;
  }

  /**
   * Cập nhật trạng thái gói PRO VIP
   */
  upgradeToPro() {
    const updated = {
      ...this.user,
      plan: 'PRO',
      upgradedAt: new Date().toISOString()
    };
    return this.saveUser(updated);
  }

  /**
   * Tích hợp đồng bộ Backend/Supabase trong tương lai
   */
  async _syncToServer(user) {
    try {
      await fetch(`${BACKEND_BASE_URL}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch {
      // Backend có thể offline hoặc chưa bật, client vẫn hoạt động mượt mà
    }
  }
}

export const authService = new AuthService();
