import React, { useState, useEffect } from 'react';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateDailyTargetCalories,
  calculateMacroSplit,
  calculateWaterTarget,
  ACTIVITY_LEVELS,
  HEALTH_GOALS
} from '../services/metricsService.js';
import { VIETNAM_CITIES } from '../services/cityWeatherService.js';

export default function ProfileView({
  user,
  onUpdateProfile,
  onLogout,
  onNavigatePricing,
  onTriggerToast
}) {
  // Local form state initialized with current user
  const [name, setName] = useState(user?.name || 'Mai Linh');
  const [email, setEmail] = useState(user?.email || 'mailinh.lifestyle@gmail.com');
  const [city, setCity] = useState(user?.city || 'Hà Nội');
  const [gender, setGender] = useState(user?.gender || 'Nữ');
  const [age, setAge] = useState(user?.age || 24);
  const [height, setHeight] = useState(user?.height || 163);
  const [weight, setWeight] = useState(user?.weight || 51);
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');
  const [healthGoal, setHealthGoal] = useState(user?.healthGoal || 'fat_loss');

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCity(user.city || 'Hà Nội');
      setGender(user.gender || 'Nữ');
      setAge(user.age || 24);
      setHeight(user.height || 163);
      setWeight(user.weight || 51);
      setActivityLevel(user.activityLevel || 'moderate');
      setHealthGoal(user.healthGoal || 'fat_loss');
    }
  }, [user]);

  // LIVE AUTO-CALCULATIONS (Cập nhật ngay lập tức khi inputs thay đổi)
  const bmiData = calculateBMI(height, weight);
  const bmr = calculateBMR(gender, age, height, weight);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieNeeds = calculateDailyTargetCalories(tdee, healthGoal);
  const macros = calculateMacroSplit(calorieNeeds.targetCalories, healthGoal);
  const waterTarget = calculateWaterTarget(weight);

  const isPro = user?.plan === 'PRO';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      email: email.trim(),
      city: city.trim(),
      gender,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      activityLevel,
      healthGoal
    });
    onTriggerToast?.('✅ Đã lưu cài đặt hồ sơ và cập nhật thông tin khu vực/thời tiết!');
  };

  return (
    <div className="profile-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HEADER & SUBSCRIPTION STATUS                           */}
      {/* ========================================================= */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Hồ sơ cá nhân & Chỉ số sức khỏe</h1>
          <p className="page-sub-title">
            Tự động tính toán chỉ số BMI, TDEE và nhu cầu calo/nước theo công thức y khoa chuẩn xác khi bạn thay đổi thông số.
          </p>
        </div>

        <div className="plan-badge-group">
          {isPro ? (
            <span className="badge-vip-pill">👑 GÓI PRO VIP VÔ HẠN</span>
          ) : (
            <div className="free-status-group">
              <span className="badge-free-pill">FREE TIER (3 LƯỢT AI/NGÀY)</span>
              <button
                className="btn-upgrade-from-profile"
                onClick={onNavigatePricing}
              >
                ⚡ Lên VIP (49k)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* ========================================================= */}
        {/* 2. FORM CÀI ĐẶT THÔNG SỐ (INPUTS)                        */}
        {/* ========================================================= */}
        <div className="profile-form-column">
          <div className="glass-panel-card">
            <div className="panel-header">
              <span className="panel-icon">📝</span>
              <h3>Thông số sinh học & Mục tiêu</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              {/* Họ tên & Email */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label className="field-label">Họ và tên</label>
                  <input
                    type="text"
                    className="field-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Email liên hệ</label>
                  <input
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Nơi ở hiện tại (Dùng để kiểm tra thời tiết) */}
              <div className="form-field">
                <label className="field-label">
                  Tỉnh / Thành phố đang sinh sống
                  <span className="hint-pill">Dự báo thời tiết & Gợi ý trang phục</span>
                </label>
                <input
                  type="text"
                  list="vietnam-cities-list"
                  className="field-input"
                  placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Đà Lạt..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <datalist id="vietnam-cities-list">
                  {VIETNAM_CITIES.map(c => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
                <span className="field-hint-micro">💡 Wearwell sẽ đối chiếu thời tiết tại khu vực này để AI gợi ý bản phối phù hợp nhất</span>
              </div>

              {/* Giới tính & Tuổi */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label className="field-label">Giới tính sinh học</label>
                  <div className="gender-selector-row">
                    <button
                      type="button"
                      className={`gender-btn ${gender === 'Nam' ? 'active' : ''}`}
                      onClick={() => setGender('Nam')}
                    >
                      Nam 👨
                    </button>
                    <button
                      type="button"
                      className={`gender-btn ${gender === 'Nữ' ? 'active' : ''}`}
                      onClick={() => setGender('Nữ')}
                    >
                      Nữ 👩
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Tuổi hiện tại</label>
                  <input
                    type="number"
                    min="14"
                    max="90"
                    className="field-input"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Chiều cao & Cân nặng (Tự động cập nhật BMI tức thì) */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label className="field-label">
                    Chiều cao (cm)
                    <span className="hint-pill">Tự tính BMI</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="220"
                    className="field-input highlight"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Cân nặng (kg)
                    <span className="hint-pill">Tự tính BMI</span>
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    className="field-input highlight"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Cường độ vận động (Activity Level) */}
              <div className="form-field">
                <label className="field-label">Mức độ vận động thể chất hàng tuần</label>
                <div className="activity-levels-list">
                  {ACTIVITY_LEVELS.map(level => {
                    const isSelected = activityLevel === level.id;
                    return (
                      <div
                        key={level.id}
                        className={`activity-radio-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setActivityLevel(level.id)}
                      >
                        <div className="radio-circle">
                          {isSelected && <span className="inner-pip"></span>}
                        </div>
                        <div className="activity-text">
                          <span className="activity-name">{level.name} (x{level.factor})</span>
                          <span className="activity-desc">{level.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mục tiêu sức khỏe */}
              <div className="form-field">
                <label className="field-label">Mục tiêu cân nặng & vóc dáng</label>
                <div className="goals-selector-row">
                  {HEALTH_GOALS.map(goal => {
                    const isSelected = healthGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        className={`goal-btn-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setHealthGoal(goal.id)}
                      >
                        <span className="goal-icon">{goal.icon}</span>
                        <span className="goal-name">{goal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="form-submit-row">
                <button type="submit" className="btn-save-profile">
                  💾 Lưu & Cập nhật chỉ số
                </button>
                <button
                  type="button"
                  className="btn-logout-secondary"
                  onClick={onLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. LIVE HEALTH METRICS DISPLAY (TÍNH TỰ ĐỘNG)            */}
        {/* ========================================================= */}
        <div className="profile-metrics-column">
          {/* Card 1: BMI & Phân loại chuẩn WHO */}
          <div className="metric-display-card-glass">
            <div className="metric-header">
              <span className="metric-title">Chỉ số khối cơ thể (BMI)</span>
              <span className={`bmi-status-tag ${bmiData.badgeClass}`}>
                {bmiData.category}
              </span>
            </div>

            <div className="bmi-gauge-display">
              <span className="bmi-large-number">{bmiData.bmi}</span>
              <div className="bmi-scale-bar">
                <div className="scale-segment blue" title="Thiếu cân (< 18.5)"></div>
                <div className="scale-segment green" title="Lý tưởng (18.5 - 22.9)"></div>
                <div className="scale-segment yellow" title="Tiền thừa cân (23.0 - 24.9)"></div>
                <div className="scale-segment red" title="Béo phì (>= 25)"></div>
                {/* Pointer indicator */}
                <div
                  className="bmi-pointer-arrow"
                  style={{
                    left: `${Math.min(95, Math.max(5, ((bmiData.bmi - 15) / 18) * 100))}%`
                  }}
                >
                  ▲
                </div>
              </div>
            </div>

            <p className="metric-advice-text">
              <strong>Khuyến nghị AI:</strong> {bmiData.advice}
            </p>
          </div>

          {/* Card 2: BMR & TDEE (Năng lượng tiêu hao) */}
          <div className="metric-display-card-glass">
            <div className="metric-header">
              <span className="metric-title">Năng lượng BMR & TDEE</span>
              <span className="badge-standard-pill">Mifflin-St Jeor</span>
            </div>

            <div className="bmr-tdee-grid">
              <div className="energy-stat-box">
                <span className="stat-label">BMR (Chuyển hóa cơ bản)</span>
                <span className="stat-val">{bmr} <small>kcal</small></span>
                <span className="stat-note">Năng lượng tối thiểu khi nghỉ ngơi hoàn toàn</span>
              </div>

              <div className="energy-stat-box highlighted">
                <span className="stat-label">TDEE (Tiêu hao hàng ngày)</span>
                <span className="stat-val">{tdee} <small>kcal</small></span>
                <span className="stat-note">BMR kết hợp mức độ vận động thể chất</span>
              </div>
            </div>
          </div>

          {/* Card 3: Nhu cầu Calo & Phân bổ Macro */}
          <div className="metric-display-card-glass">
            <div className="metric-header">
              <span className="metric-title">Mục tiêu Calo & Macro dinh dưỡng</span>
              <span className="calorie-goal-tag">
                {calorieNeeds.deficitOrSurplus < 0
                  ? `Thâm hụt ${Math.abs(calorieNeeds.deficitOrSurplus)} kcal`
                  : calorieNeeds.deficitOrSurplus > 0
                  ? `Thặng dư +${calorieNeeds.deficitOrSurplus} kcal`
                  : 'Cân bằng duy trì'}
              </span>
            </div>

            <div className="daily-calorie-highlight">
              <span className="cal-label">Mục tiêu nạp hàng ngày:</span>
              <span className="cal-number">{calorieNeeds.targetCalories} kcal</span>
            </div>

            {/* Macro split breakdown */}
            <div className="macros-breakdown-row">
              <div className="macro-item protein">
                <div className="macro-top">
                  <span className="macro-name">Chất Đạm (Protein)</span>
                  <span className="macro-pct">{macros.protein.percent}%</span>
                </div>
                <div className="macro-bar"><div style={{ width: `${macros.protein.percent}%` }}></div></div>
                <span className="macro-grams"><strong>{macros.protein.grams}g</strong> ({macros.protein.calories} kcal)</span>
              </div>

              <div className="macro-item carbs">
                <div className="macro-top">
                  <span className="macro-name">Tinh Bột (Carbs)</span>
                  <span className="macro-pct">{macros.carbs.percent}%</span>
                </div>
                <div className="macro-bar"><div style={{ width: `${macros.carbs.percent}%` }}></div></div>
                <span className="macro-grams"><strong>{macros.carbs.grams}g</strong> ({macros.carbs.calories} kcal)</span>
              </div>

              <div className="macro-item fat">
                <div className="macro-top">
                  <span className="macro-name">Chất Béo (Fat)</span>
                  <span className="macro-pct">{macros.fat.percent}%</span>
                </div>
                <div className="macro-bar"><div style={{ width: `${macros.fat.percent}%` }}></div></div>
                <span className="macro-grams"><strong>{macros.fat.grams}g</strong> ({macros.fat.calories} kcal)</span>
              </div>
            </div>
          </div>

          {/* Card 4: Nhu cầu nước uống */}
          <div className="metric-display-card-glass water-card">
            <div className="water-left-side">
              <span className="water-icon">💧</span>
              <div>
                <span className="water-title">Nhu cầu nước uống hàng ngày</span>
                <span className="water-desc">Công thức 35ml x {weight}kg cân nặng</span>
              </div>
            </div>
            <div className="water-right-side">
              <span className="water-liters">{(waterTarget / 1000).toFixed(2)} Lít</span>
              <span className="water-cups">~ {Math.round(waterTarget / 250)} cốc nước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
