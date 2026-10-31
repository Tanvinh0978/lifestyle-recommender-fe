import React, { useState } from 'react';
import { NUTRITION_GOALS, DIET_PREFERENCES, WORKOUT_TIMES } from '../services/aiService.js';

export default function NutritionFitnessView({
  user,
  onGeneratePlan,
  planResult,
  isLoading,
  onNavigatePricing,
  onTriggerToast
}) {
  const [selectedGoal, setSelectedGoal] = useState(NUTRITION_GOALS[0]);
  const [selectedDiet, setSelectedDiet] = useState(DIET_PREFERENCES[1]); // Eat Clean
  const [selectedDuration, setSelectedDuration] = useState(30);
  
  // Interactive workout completion checkboxes
  const [completedExercises, setCompletedExercises] = useState({});

  const isPro = user?.plan === 'PRO';
  const remainingQuota = isPro ? Infinity : Math.max(0, 3 - (user?.aiUsageCount || 0));

  const handleGenerateClick = () => {
    if (!isPro && remainingQuota <= 0) {
      onTriggerToast?.('🔒 Bạn đã dùng hết lượt AI hôm nay! Nâng cấp PRO VIP để lên thực đơn & lịch tập không giới hạn.', 'warning');
      onNavigatePricing?.();
      return;
    }

    setCompletedExercises({});
    onGeneratePlan({
      goal: selectedGoal,
      diet: selectedDiet,
      durationMinutes: selectedDuration
    });
  };

  const handleToggleExercise = (exerciseId) => {
    const updated = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    };
    setCompletedExercises(updated);

    const total = planResult?.exercises?.length || 0;
    const finishedCount = Object.values(updated).filter(Boolean).length;

    if (total > 0 && finishedCount === total) {
      onTriggerToast?.('🎉 Xuất sắc! Bạn đã hoàn thành 100% mục tiêu tập luyện hôm nay! Hãy bổ sung nước ngay nhé.');
    } else if (updated[exerciseId]) {
      onTriggerToast?.(`💪 Đã hoàn thành bài tập (${finishedCount}/${total})!`);
    }
  };

  // Workout progress
  const totalExercises = planResult?.exercises?.length || 0;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const workoutProgress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="nutrition-fitness-page-container animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HEADER                                                 */}
      {/* ========================================================= */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Dinh dưỡng & Tập luyện AI</h1>
          <p className="page-sub-title">
            Thiết kế thực đơn 4 bữa chuẩn khẩu vị Việt kết hợp giáo án thể hình tại nhà, bám sát chỉ số TDEE và mục tiêu vóc dáng của bạn.
          </p>
        </div>

        <div className="quota-pill-status">
          <span className="lightning-icon">⚡</span>
          <span>Hạn mức hôm nay: <strong>{isPro ? 'Vô hạn (PRO VIP)' : `Còn ${remainingQuota} / 3 lượt`}</strong></span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CONFIGURATOR CARD (GOAL, DIET, TIME)                   */}
      {/* ========================================================= */}
      <div className="fitness-config-card-glass">
        <div className="config-header">
          <div className="config-title-group">
            <span className="config-icon">🥗</span>
            <div>
              <h3>Tùy biến kế hoạch sức khỏe cá nhân</h3>
              <p>Chọn mục tiêu, trường phái ăn uống và quỹ thời gian rảnh của bạn</p>
            </div>
          </div>

          <span className="tag-personalized-badge">
            👤 Dựa trên: {user?.height || 163}cm • {user?.weight || 51}kg
          </span>
        </div>

        {/* 1. Mục tiêu (Goals) */}
        <div className="config-section-group">
          <label className="section-label-row">
            <span className="label-icon">🎯</span>
            <span>Mục tiêu thể hình:</span>
            <span className="selected-value-tag">{selectedGoal.label}</span>
          </label>
          <div className="grid-goals-3col">
            {NUTRITION_GOALS.map(g => {
              const isActive = selectedGoal.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  className={`goal-card-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedGoal(g)}
                >
                  <span className="goal-icon">{g.icon}</span>
                  <span className="goal-title">{g.label}</span>
                  <span className="goal-desc">{g.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Chế độ ăn (Diet Preference) */}
        <div className="config-section-group">
          <label className="section-label-row">
            <span className="label-icon">🍲</span>
            <span>Trường phái ẩm thực:</span>
            <span className="selected-value-tag">{selectedDiet.label}</span>
          </label>
          <div className="grid-diets-3col">
            {DIET_PREFERENCES.map(d => {
              const isActive = selectedDiet.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`diet-card-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDiet(d)}
                >
                  <span className="diet-icon">{d.icon}</span>
                  <span className="diet-title">{d.label}</span>
                  <span className="diet-desc">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Thời gian tập luyện (Available Time) */}
        <div className="config-section-group">
          <label className="section-label-row">
            <span className="label-icon">⏱️</span>
            <span>Thời lượng tập luyện rảnh hôm nay:</span>
            <span className="selected-value-tag">{selectedDuration} phút</span>
          </label>
          <div className="times-chips-row">
            {WORKOUT_TIMES.map(t => {
              const isActive = selectedDuration === t.minutes;
              return (
                <button
                  key={t.minutes}
                  type="button"
                  className={`time-chip-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(t.minutes)}
                >
                  <span className="time-minutes">{t.label}</span>
                  <span className="time-intensity">{t.intensity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="btn-generate-fitness-cta"
          onClick={handleGenerateClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="btn-loading-content">
              <span className="spinner-icon">🔄</span>
              <span>Đang tính toán Macro & soạn lịch tập...</span>
            </div>
          ) : (
            <div className="btn-normal-content">
              <span className="sparkle-symbol">⚡</span>
              <span>Thiết kế Thực đơn & Bài tập AI</span>
              <div className="shimmer-sweep"></div>
            </div>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3. SKELETON LOADER                                        */}
      {/* ========================================================= */}
      {isLoading && (
        <div className="fitness-skeleton-glass animate-pulse">
          <div className="skeleton-banner"></div>
          <div className="skeleton-meals-row">
            <div className="skeleton-meal-card"></div>
            <div className="skeleton-meal-card"></div>
          </div>
          <div className="skeleton-workout-box"></div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PLAN RESULTS (MEALS & WORKOUT)                         */}
      {/* ========================================================= */}
      {!isLoading && planResult && (
        <div className="plan-results-wrapper animate-fade-in-up">
          {/* Energy Summary Banner */}
          <div className="energy-targets-banner-glass">
            <div className="energy-item">
              <span className="energy-label">Mục tiêu Calo ngày:</span>
              <span className="energy-val primary">{planResult.dailyCalorieTarget} kcal</span>
            </div>
            <div className="energy-item">
              <span className="energy-label">Tổng calo 4 bữa ăn:</span>
              <span className="energy-val green">{planResult.totalMealCalories} kcal</span>
            </div>
            <div className="energy-item">
              <span className="energy-label">Nhu cầu nước uống:</span>
              <span className="energy-val blue">{(planResult.waterTargetMl / 1000).toFixed(1)} Lít / ngày</span>
            </div>
            {planResult.isSimulated && (
              <span className="tag-source-badge">
                ⚡ {planResult.source}
              </span>
            )}
          </div>

          {/* Section: 4 Meals of the Day */}
          <div className="meals-section-glass">
            <div className="meals-section-header">
              <div className="title-group">
                <span className="section-icon">🍳</span>
                <h3>Thực đơn 4 bữa dinh dưỡng hôm nay</h3>
              </div>
              <span className="tag-diet-pill">{planResult.dietName}</span>
            </div>

            <div className="meals-grid-cards">
              {Array.isArray(planResult.meals) && planResult.meals.map((meal, idx) => (
                <div key={idx} className="meal-card-glass">
                  <div className="meal-card-top">
                    <div className="meal-badge-time">
                      <span className="meal-name-pill">{meal.name}</span>
                      <span className="meal-time-text">{meal.time}</span>
                    </div>
                    <span className="meal-calorie-badge">{meal.calories} kcal</span>
                  </div>

                  <h4 className="meal-dish-name">{meal.dish}</h4>

                  {/* Ingredients Tags */}
                  <div className="ingredients-box">
                    <span className="ingredients-label">Nguyên liệu chuẩn bị:</span>
                    <div className="ingredient-chips-list">
                      {meal.ingredients.map((ing, iIdx) => (
                        <span key={iIdx} className="ingredient-chip">{ing}</span>
                      ))}
                    </div>
                  </div>

                  {/* Meal Tip */}
                  <div className="meal-tip-row">
                    <span className="bulb-icon">💡</span>
                    <span className="tip-text">{meal.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Workout Exercises with Interactive Checklist */}
          <div className="workout-section-glass">
            <div className="workout-section-header">
              <div className="title-group">
                <span className="section-icon">🏋️</span>
                <div>
                  <h3>Bài tập tại nhà ({planResult.durationMinutes} phút)</h3>
                  <p>Giáo án không cần tạ, bảo vệ khớp và siết cơ hiệu quả</p>
                </div>
              </div>

              {/* Workout Progress Bar */}
              <div className="workout-progress-box">
                <span className="progress-fraction">
                  {completedCount} / {totalExercises} bài hoàn thành ({workoutProgress}%)
                </span>
                <div className="progress-track-small">
                  <div
                    className="progress-fill-emerald"
                    style={{ width: `${workoutProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="exercises-list-group">
              {Array.isArray(planResult.exercises) && planResult.exercises.map((ex) => {
                const isChecked = !!completedExercises[ex.id];
                return (
                  <div
                    key={ex.id}
                    className={`exercise-row-glass ${isChecked ? 'completed' : ''}`}
                    onClick={() => handleToggleExercise(ex.id)}
                  >
                    {/* Checkbox */}
                    <div className="checkbox-round">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                      />
                      <span className="custom-check-pip"></span>
                    </div>

                    {/* Content */}
                    <div className="exercise-info">
                      <div className="exercise-title-line">
                        <h4 className={`exercise-name ${isChecked ? 'line-through' : ''}`}>
                          {ex.name}
                        </h4>
                        <span className="exercise-target-badge">{ex.targetMuscle}</span>
                      </div>

                      <div className="exercise-meta-pills">
                        <span className="meta-pill sets"><strong>{ex.sets}</strong> hiệp</span>
                        <span className="meta-pill reps"><strong>{ex.reps}</strong></span>
                        <span className="meta-pill rest">Nghỉ: {ex.rest}</span>
                      </div>

                      <p className="exercise-instructions-text">{ex.instructions}</p>
                    </div>

                    <div className="exercise-status-badge">
                      {isChecked ? (
                        <span className="tag-finished">Đã tập ✓</span>
                      ) : (
                        <span className="tag-pending">Chưa tập</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
