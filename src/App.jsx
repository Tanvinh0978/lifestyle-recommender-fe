'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardView from './components/DashboardView.jsx';
import WardrobeView from './components/WardrobeView.jsx';
import StylistView from './components/StylistView.jsx';
import NutritionFitnessView from './components/NutritionFitnessView.jsx';
import ProfileView from './components/ProfileView.jsx';
import PricingView from './components/PricingView.jsx';
import LoginView from './components/LoginView.jsx';
import AuthModal from './components/AuthModal.jsx';
import AdModal from './components/AdModal.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';

import { authService, DEFAULT_USER } from './services/authService.js';
import { wardrobeService } from './services/wardrobeService.js';
import { aiService } from './services/aiService.js';
import { calculateDailyTargetCalories, calculateBMR, calculateTDEE, calculateWaterTarget } from './services/metricsService.js';

import './App.css';

export default function App({ initialTab = 'dashboard' }) {
  // ==========================================
  // STATE: USER & AUTHENTICATION
  // ==========================================
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // ==========================================
  // STATE: NAVIGATION
  // ==========================================
  // 'dashboard' | 'wardrobe' | 'stylist' | 'nutrition-fitness' | 'profile' | 'pricing' | 'login'
  const [activeTab, setActiveTab] = useState(initialTab);

  // ==========================================
  // STATE: DIGITAL WARDROBE
  // ==========================================
  const [wardrobe, setWardrobe] = useState(() => wardrobeService.getAllItems());

  // ==========================================
  // STATE: AI STYLIST
  // ==========================================
  const [stylistResult, setStylistResult] = useState(null);
  const [stylistLoading, setStylistLoading] = useState(false);

  // ==========================================
  // STATE: AI NUTRITION & FITNESS
  // ==========================================
  const [fitnessResult, setFitnessResult] = useState(null);
  const [fitnessLoading, setFitnessLoading] = useState(false);

  // ==========================================
  // STATE: WATER & HABIT TRACKING
  // ==========================================
  const [waterConsumed, setWaterConsumed] = useState(() => user?.waterConsumedMl || 1500);

  // Helper trigger Toast
  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Tự động tắt Toast sau 4.5 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Tự động tải tủ đồ đồng bộ từ server khi user đăng nhập hoặc đổi tài khoản
  useEffect(() => {
    if (user?.email) {
      wardrobeService.fetchUserWardrobe(user.email).then(items => {
        setWardrobe([...items]);
      });
    }
  }, [user?.email]);

  // ==========================================
  // ACTIONS: USER PROFILE & AUTH
  // ==========================================
  const handleLogin = async (name, email, additional) => {
    const newUser = authService.login(name, email, additional);
    setUser(newUser);
    const syncedItems = await wardrobeService.fetchUserWardrobe(newUser.email);
    setWardrobe([...syncedItems]);
    setActiveTab('dashboard');
    triggerToast(`👋 Chào mừng bạn, ${newUser.name}!`);
  };

  const handleDemoLogin = async () => {
    const demoUser = authService.login(DEFAULT_USER.name, DEFAULT_USER.email, DEFAULT_USER);
    setUser(demoUser);
    setWaterConsumed(demoUser.waterConsumedMl);
    const syncedItems = await wardrobeService.fetchUserWardrobe(demoUser.email);
    setWardrobe([...syncedItems]);
    setActiveTab('dashboard');
    triggerToast('⚡ Đã đăng nhập nhanh với tài khoản mẫu thiết lập sẵn!');
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      authService.logout();
      setUser(null);
      setActiveTab('dashboard');
      triggerToast('Đã đăng xuất thành công.', 'info');
    }
  };

  const handleUpdateProfile = (profileData) => {
    const updated = authService.updateProfile(profileData);
    setUser(updated);
    triggerToast('✅ Đã cập nhật thông tin hồ sơ sức khỏe thành công!');
  };

  const handleUpgradeSuccess = () => {
    const updated = authService.upgradeToPro();
    setUser(updated);
    triggerToast('👑 Chúc mừng! Bạn đã nâng cấp thành công lên Gói PRO VIP.');
  };

  // ==========================================
  // ACTIONS: WARDROBE
  // ==========================================
  const handleAddItem = (itemData) => {
    try {
      wardrobeService.addItem(itemData, user?.plan, user?.email);
      setWardrobe([...wardrobeService.getAllItems()]);
      triggerToast('✨ Đã thêm trang phục mới vào tủ đồ thành công!');
    } catch (err) {
      triggerToast(err.message, 'warning');
      setActiveTab('pricing');
    }
  };

  const handleUpdateItem = (id, updateData) => {
    wardrobeService.updateItem(id, updateData);
    setWardrobe([...wardrobeService.getAllItems()]);
    triggerToast('✅ Đã lưu cập nhật thông tin món đồ!');
  };

  const handleDeleteItem = (id) => {
    wardrobeService.deleteItem(id);
    setWardrobe([...wardrobeService.getAllItems()]);
    triggerToast('🗑️ Đã xóa món đồ khỏi tủ đồ số.', 'info');
  };

  // ==========================================
  // ACTIONS: WATER TRACKING
  // ==========================================
  const handleAddWater = () => {
    const nextVal = waterConsumed + 250;
    setWaterConsumed(nextVal);
    if (user) {
      authService.updateProfile({ waterConsumedMl: nextVal });
    }
    triggerToast('💧 Đã ghi nhận thêm +250ml nước uống!');
  };

  // ==========================================
  // ACTIONS: AD REWARD
  // ==========================================
  const handleRewardAdComplete = () => {
    const success = authService.rewardAdWatch();
    if (success) {
      setUser({ ...authService.getCurrentUser() });
      triggerToast('🎉 Bạn đã nhận thêm +1 lượt gọi AI miễn phí hôm nay!');
    }
  };

  // ==========================================
  // ACTIONS: AI GENERATION
  // ==========================================
  const handleGenerateOutfit = async (options) => {
    if (!user) {
      triggerToast('Vui lòng đăng nhập để Stylist AI gợi ý bản phối từ tủ đồ của bạn!', 'info');
      setActiveTab('login');
      return;
    }

    if (!authService.canUseAI()) {
      if (authService.canWatchAd()) {
        triggerToast('📺 Bạn đã dùng hết lượt khởi đầu hôm nay. Xem 1 quảng cáo ngắn để nhận thêm lượt!', 'info');
        setAdModalOpen(true);
      } else {
        triggerToast('🔒 Bạn đã đạt giới hạn quảng cáo hôm nay! Nâng cấp PRO VIP để sử dụng không giới hạn.', 'warning');
        setActiveTab('pricing');
      }
      return;
    }

    setStylistLoading(true);
    try {
      const result = await aiService.generateOutfit(options);
      authService.consumeAIQuota();
      setUser({ ...authService.getCurrentUser() });
      setStylistResult(result);
      triggerToast('✨ Stylist AI đã hoàn tất bản phối trang phục hôm nay!');
    } catch {
      triggerToast('Lỗi khi phân tích trang phục, vui lòng thử lại!', 'error');
    } finally {
      setStylistLoading(false);
    }
  };

  const handleGenerateFitness = async (options) => {
    if (!user) {
      triggerToast('Vui lòng đăng nhập để thiết kế thực đơn & bài tập AI!', 'info');
      setActiveTab('login');
      return;
    }

    if (!authService.canUseAI()) {
      if (authService.canWatchAd()) {
        triggerToast('📺 Bạn đã dùng hết lượt khởi đầu hôm nay. Xem 1 quảng cáo ngắn để nhận thêm lượt!', 'info');
        setAdModalOpen(true);
      } else {
        triggerToast('🔒 Bạn đã đạt giới hạn quảng cáo hôm nay! Nâng cấp PRO VIP để tạo thực đơn không giới hạn.', 'warning');
        setActiveTab('pricing');
      }
      return;
    }

    setFitnessLoading(true);
    try {
      // Tính toán targets thực tế dựa trên profile người dùng
      const bmr = calculateBMR(user.gender, user.age, user.height, user.weight);
      const tdee = calculateTDEE(bmr, user.activityLevel);
      const calorieTarget = calculateDailyTargetCalories(tdee, options.goal.id).targetCalories;
      const waterTarget = calculateWaterTarget(user.weight);

      const result = await aiService.generateNutritionAndFitness({
        ...options,
        user,
        targetCalories: calorieTarget,
        waterTarget
      });

      authService.consumeAIQuota();
      setUser({ ...authService.getCurrentUser() });
      setFitnessResult(result);
      triggerToast('🥗 Kế hoạch dinh dưỡng & tập luyện AI đã sẵn sàng!');
    } catch {
      triggerToast('Lỗi khi thiết kế thực đơn, vui lòng thử lại!', 'error');
    } finally {
      setFitnessLoading(false);
    }
  };

  // Tính toán các chỉ số cho Dashboard
  const currentBmr = calculateBMR(user?.gender, user?.age, user?.height, user?.weight);
  const currentTdee = calculateTDEE(currentBmr, user?.activityLevel);
  const currentCalorieTarget = calculateDailyTargetCalories(currentTdee, user?.healthGoal).targetCalories;
  const currentWaterTarget = calculateWaterTarget(user?.weight);

  return (
    <div className="aura-life-app-root">
      {/* 1. Header & Navigation Dock */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        wardrobeCount={wardrobe.length}
        onOpenAuth={() => setActiveTab('login')}
        onLogout={handleLogout}
      />

      {/* 2. Floating Toast Alert */}
      <Toast toast={toast} onClose={closeToast} />

      {/* 3. Main Views Container */}
      <main className="app-main-viewport">
        {activeTab === 'login' && (
          <LoginView
            onLogin={handleLogin}
            onDemoLogin={handleDemoLogin}
            onBackToHome={() => setActiveTab('dashboard')}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            wardrobeCount={wardrobe.length}
            onNavigate={setActiveTab}
            onAddWater={handleAddWater}
            waterConsumed={waterConsumed}
            waterTarget={currentWaterTarget}
            dailyCalorieTarget={currentCalorieTarget}
            caloriesConsumed={user?.caloriesConsumed || 1450}
            onOpenAdModal={() => setAdModalOpen(true)}
            remainingAds={authService.getRemainingAdsCount()}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobeView
            wardrobe={wardrobe}
            user={user}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onNavigatePricing={() => setActiveTab('pricing')}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'stylist' && (
          <StylistView
            user={user}
            wardrobe={wardrobe}
            onGenerateOutfit={handleGenerateOutfit}
            outfitResult={stylistResult}
            isLoading={stylistLoading}
            onNavigatePricing={() => setActiveTab('pricing')}
            onOpenAdModal={() => setAdModalOpen(true)}
            remainingAds={authService.getRemainingAdsCount()}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'nutrition-fitness' && (
          <NutritionFitnessView
            user={user}
            onGeneratePlan={handleGenerateFitness}
            planResult={fitnessResult}
            isLoading={fitnessLoading}
            onNavigatePricing={() => setActiveTab('pricing')}
            onOpenAdModal={() => setAdModalOpen(true)}
            remainingAds={authService.getRemainingAdsCount()}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onNavigatePricing={() => setActiveTab('pricing')}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingView
            user={user}
            onUpgradeSuccess={handleUpgradeSuccess}
            onTriggerToast={triggerToast}
          />
        )}
      </main>

      {/* 4. Full-Width Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAdModal={() => setAdModalOpen(true)}
        user={user}
      />

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onDemoLogin={handleDemoLogin}
      />

      {/* 5. Watch Ad Modal (Xem QC nhận thêm lượt AI) */}
      <AdModal
        isOpen={adModalOpen}
        onClose={() => setAdModalOpen(false)}
        onRewardComplete={handleRewardAdComplete}
        remainingAdsToday={authService.getRemainingAdsCount()}
      />
    </div>
  );
}
