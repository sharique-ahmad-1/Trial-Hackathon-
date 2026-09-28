'use client';

import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Plus, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Volume2, 
  Layers, 
  Info,
  Calendar,
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DietPage() {
  const [meals, setMeals] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('350');
  const [protein, setProtein] = useState('12');
  const [carbs, setCarbs] = useState('45');
  const [fiber, setFiber] = useState('6');

  useEffect(() => {
    fetchDietData();
  }, []);

  const fetchDietData = async () => {
    setLoading(true);
    try {
      // 1. Fetch meals
      const { data: mealData } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', 'senior_user_1')
        .order('created_at', { ascending: false });
      if (mealData) setMeals(mealData);

      // 2. Fetch curated plans
      const { data: planData } = await supabase
        .from('diet_plans')
        .select('*');
      if (planData) {
        setDietPlans(planData);
        if (planData.length > 0) setActivePlan(planData[0]);
      }
    } catch (err) {
      console.error('Failed to load diet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('meals')
        .insert([{
          user_id: 'senior_user_1',
          meal_type: mealType,
          food_name: foodName,
          calories: parseInt(calories) || 0,
          protein_grams: parseFloat(protein) || 0,
          carbs_grams: parseFloat(carbs) || 0,
          fat_grams: 5.0,
          fiber_grams: parseFloat(fiber) || 0,
        }])
        .select()
        .single();

      if (data) {
        setMeals([data, ...meals]);
        setShowLogModal(false);
        setFoodName('');
      }
    } catch (err) {
      alert('Error adding meal: ' + err.message);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await supabase.from('meals').delete().eq('id', id);
      setMeals(meals.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const speak = (msg) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const totalCalories = meals.reduce((a, m) => a + (m.calories || 0), 0);
  const targetCalories = activePlan?.daily_calories || 1800;

  const quickFoodPresets = [
    { name: 'Oats with Milk & Almonds', cal: 350, type: 'Breakfast' },
    { name: 'Moong Dal, Soft Roti & Curd', cal: 480, type: 'Lunch' },
    { name: 'Vegetable Khichdi with Ghee', cal: 420, type: 'Dinner' },
    { name: 'Roasted Foxnuts (Makhana) & Green Tea', cal: 130, type: 'Snacks' },
    { name: 'Fresh Papaya & Pomegranate Bowl', cal: 160, type: 'Breakfast' }
  ];

  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Utensils className="w-8 h-8 text-emerald-600" />
            Diet Planning & Calorie Tracker
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Senior-focused nutritional guidance, easy meal logging, and tailored meal plans.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="touch-target px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Log What You Ate</span>
        </button>
      </div>

      {/* Today's Calorie Meter Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-3 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Today's Calorie Budget
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {totalCalories} <span className="text-lg text-slate-500 font-bold">/ {targetCalories} kcal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold text-slate-500 block">Remaining</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {Math.max(0, targetCalories - totalCalories)} kcal
              </span>
            </div>
            <button
              onClick={() => speak(`Today you have consumed ${totalCalories} calories. Your target is ${targetCalories} calories. You have ${Math.max(0, targetCalories - totalCalories)} calories remaining.`)}
              className="touch-target p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              title="Read Calorie Status"
            >
              <Volume2 className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* SECTION 1: Daily Logged Meals by Category */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Today's Meals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealCategories.map((cat) => {
            const catMeals = meals.filter(m => m.meal_type === cat);
            const catCalories = catMeals.reduce((a, m) => a + (m.calories || 0), 0);

            return (
              <div 
                key={cat}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{cat === 'Breakfast' ? '🥞' : cat === 'Lunch' ? '🍛' : cat === 'Dinner' ? '🍲' : '🍎'}</span>
                    {cat}
                  </h3>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {catCalories} kcal
                  </span>
                </div>

                {catMeals.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No items logged yet for {cat}.</p>
                ) : (
                  <div className="space-y-2">
                    {catMeals.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-sm"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.food_name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.calories} kcal • {item.protein_grams || 0}g protein • {item.fiber_grams || 0}g fiber
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMeal(item.id)}
                          className="touch-target p-2 text-slate-400 hover:text-rose-500 rounded-xl"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Customized Senior Diet Plans */}
      <div className="space-y-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Personalized Senior Diet Plans
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Scientifically balanced diets crafted for elderly health conditions.
          </p>
        </div>

        {/* Plan Selector Pills */}
        <div className="flex flex-wrap gap-2.5">
          {dietPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => {
                setActivePlan(plan);
                speak(`Selected plan: ${plan.title}. Target condition: ${plan.target_condition}`);
              }}
              className={`touch-target px-5 py-3 rounded-2xl font-black text-sm sm:text-base border-2 transition-all ${
                activePlan?.id === plan.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {plan.title}
            </button>
          ))}
        </div>

        {/* Selected Plan Details Card */}
        {activePlan && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-3 border-blue-500/30 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
                  Target: {activePlan.target_condition}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {activePlan.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
                  {activePlan.description}
                </p>
              </div>

              <div className="text-center px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-400">
                <span className="text-xs font-bold text-slate-500 block">Daily Budget</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {activePlan.daily_calories} kcal
                </span>
              </div>
            </div>

            {/* Daily Schedule breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  🥞 Breakfast Recommendation:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{activePlan.breakfast_plan}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  🍛 Lunch Recommendation:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{activePlan.lunch_plan}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  🍲 Dinner Recommendation:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{activePlan.dinner_plan}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  🍎 Healthy Snacks & Hydration:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{activePlan.snacks_plan} — {activePlan.hydration_tips}</p>
              </div>
            </div>

            <button
              onClick={() => speak(`Here is the recommendation for ${activePlan.title}. Breakfast: ${activePlan.breakfast_plan}. Lunch: ${activePlan.lunch_plan}. Dinner: ${activePlan.dinner_plan}.`)}
              className="touch-target px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-sm flex items-center gap-2 border border-blue-300 dark:border-blue-800"
            >
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span>Read Full Meal Plan Aloud</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal: Log Meal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-3 border-emerald-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Log Your Meal</h3>
            
            {/* Quick Presets */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Quick Pick Senior Favorites:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickFoodPresets.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFoodName(f.name);
                      setCalories(String(f.cal));
                      setMealType(f.type);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold hover:bg-emerald-50 hover:border-emerald-400"
                  >
                    + {f.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meal Category
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Food Item Name
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. 2 Moong Dal Cheela with Mint Chutney"
                  className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Protein (grams)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="touch-target px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-md"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
