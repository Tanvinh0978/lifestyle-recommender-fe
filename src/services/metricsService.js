// ==========================================================
// METRICS SERVICE: BMI, BMR, TDEE & NUTRITION TARGETS
// Công thức chuẩn y khoa Mifflin-St Jeor & WHO Asian Standard
// ==========================================================

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', name: 'Ít vận động', factor: 1.2, desc: 'Làm việc văn phòng, ít hoặc không tập thể dục' },
  { id: 'light', name: 'Vận động nhẹ', factor: 1.375, desc: 'Tập nhẹ nhàng 1 - 3 buổi / tuần' },
  { id: 'moderate', name: 'Vừa phải', factor: 1.55, desc: 'Tập thể thao 3 - 5 buổi / tuần' },
  { id: 'active', name: 'Năng động', factor: 1.725, desc: 'Tập cường độ cao 6 - 7 buổi / tuần' },
  { id: 'very_active', name: 'Cường độ cao', factor: 1.9, desc: 'Vận động viên hoặc lao động thể lực nặng' }
];

export const HEALTH_GOALS = [
  { id: 'fat_loss', name: 'Giảm mỡ & Thon gọn', calorieModifier: -450, icon: '🔥', desc: 'Thâm hụt calo an toàn 400 - 500 kcal/ngày' },
  { id: 'maintain', name: 'Duy trì vóc dáng', calorieModifier: 0, icon: '⚖️', desc: 'Cân bằng năng lượng nạp và tiêu hao' },
  { id: 'muscle_gain', name: 'Tăng cơ nạc', calorieModifier: 350, icon: '💪', desc: 'Thặng dư calo nhẹ và ưu tiên đạm cao' }
];

/**
 * Tính chỉ số khối cơ thể (BMI)
 */
export function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 22.0, category: 'Bình thường', color: 'success', advice: 'Cân đối lý tưởng' };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  // Chuẩn WHO dành cho người châu Á
  if (bmi < 18.5) {
    return {
      bmi,
      category: 'Thiếu cân',
      badgeClass: 'badge-warning',
      color: '#f59e0b',
      advice: 'Cần bổ sung dinh dưỡng cân đối và tăng khối lượng cơ nạc.'
    };
  } else if (bmi <= 22.9) {
    return {
      bmi,
      category: 'Cân đối lý tưởng',
      badgeClass: 'badge-success',
      color: '#10b981',
      advice: 'Vóc dáng đạt chuẩn vàng! Hãy duy trì lối sống lành mạnh hiện tại.'
    };
  } else if (bmi <= 24.9) {
    return {
      bmi,
      category: 'Tiền thừa cân',
      badgeClass: 'badge-warning',
      color: '#f59e0b',
      advice: 'Nên kết hợp vận động 30 phút/ngày và giảm nhẹ lượng đường bột tinh chế.'
    };
  } else {
    return {
      bmi,
      category: 'Thừa cân / Cần giảm mỡ',
      badgeClass: 'badge-danger',
      color: '#ef4444',
      advice: 'Khuyến nghị thâm hụt calo khoa học và tăng cường tập luyện cardio/kháng lực.'
    };
  }
}

/**
 * Tính BMR (Tỷ lệ trao đổi chất cơ bản) theo công thức Mifflin-St Jeor
 */
export function calculateBMR(gender, age, heightCm, weightKg) {
  const w = Number(weightKg) || 65;
  const h = Number(heightCm) || 170;
  const a = Number(age) || 25;

  let bmr = 10 * w + 6.25 * h - 5 * a;
  if (gender === 'Nữ') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  return Math.round(bmr);
}

/**
 * Tính TDEE (Tổng năng lượng tiêu hao hàng ngày)
 */
export function calculateTDEE(bmr, activityLevelId = 'light') {
  const level = ACTIVITY_LEVELS.find(l => l.id === activityLevelId) || ACTIVITY_LEVELS[1];
  return Math.round(bmr * level.factor);
}

/**
 * Tính nhu cầu calo khuyến nghị hàng ngày theo mục tiêu
 */
export function calculateDailyTargetCalories(tdee, goalId = 'maintain') {
  const goal = HEALTH_GOALS.find(g => g.id === goalId) || HEALTH_GOALS[1];
  const target = Math.max(1200, tdee + goal.calorieModifier);
  return {
    targetCalories: target,
    deficitOrSurplus: goal.calorieModifier,
    goalName: goal.name
  };
}

/**
 * Phân bổ Macro dinh dưỡng khuyến nghị (Carbs, Protein, Fat)
 */
export function calculateMacroSplit(targetCalories, goalId = 'maintain') {
  let proteinRatio = 0.25;
  let fatRatio = 0.25;
  let carbRatio = 0.50;

  if (goalId === 'fat_loss') {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbRatio = 0.40;
  } else if (goalId === 'muscle_gain') {
    proteinRatio = 0.30;
    fatRatio = 0.25;
    carbRatio = 0.45;
  }

  const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const carbGrams = Math.round((targetCalories * carbRatio) / 4);
  const fatGrams = Math.round((targetCalories * fatRatio) / 9);

  return {
    protein: { grams: proteinGrams, percent: Math.round(proteinRatio * 100), calories: proteinGrams * 4 },
    carbs: { grams: carbGrams, percent: Math.round(carbRatio * 100), calories: carbGrams * 4 },
    fat: { grams: fatGrams, percent: Math.round(fatRatio * 100), calories: fatGrams * 9 }
  };
}

/**
 * Tính mục tiêu lượng nước uống hàng ngày (ml)
 */
export function calculateWaterTarget(weightKg) {
  const w = Number(weightKg) || 60;
  return Math.round(w * 35); // 35ml/kg cân nặng
}
