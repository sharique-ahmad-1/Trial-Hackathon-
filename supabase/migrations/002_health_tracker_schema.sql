-- 002_health_tracker_schema.sql
-- Health & Wellness Tracker Database Schema for Supabase

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'senior_user_1',
    email TEXT,
    full_name TEXT NOT NULL DEFAULT 'Ramesh Sharma',
    age INT DEFAULT 68,
    gender TEXT DEFAULT 'Male',
    blood_group TEXT DEFAULT 'B+',
    medical_conditions TEXT[] DEFAULT ARRAY['Hypertension', 'Mild Arthritis'],
    allergies TEXT[] DEFAULT ARRAY['Penicillin', 'Peanuts'],
    daily_calorie_target INT DEFAULT 1800,
    water_target_glasses INT DEFAULT 8,
    emergency_contact_name TEXT DEFAULT 'Sunita Sharma (Daughter)',
    emergency_contact_phone TEXT DEFAULT '+91 98765 43210',
    high_contrast_mode BOOLEAN DEFAULT false,
    large_font_mode BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Medications Table
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'senior_user_1',
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    schedule_time TEXT NOT NULL, -- e.g. "08:30 AM" or "20:00"
    meal_relation TEXT NOT NULL DEFAULT 'After Food',
    status TEXT NOT NULL DEFAULT 'pending', -- 'taken', 'pending', 'skipped'
    last_taken_at TIMESTAMPTZ,
    color_tag TEXT DEFAULT 'blue', -- visual aid: 'blue', 'green', 'amber', 'purple', 'rose'
    pill_shape TEXT DEFAULT 'round', -- 'round', 'capsule', 'oval'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Meals & Daily Food Intake Table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'senior_user_1',
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snacks')),
    food_name TEXT NOT NULL,
    calories INT NOT NULL DEFAULT 0,
    protein_grams NUMERIC(6,1) DEFAULT 0,
    carbs_grams NUMERIC(6,1) DEFAULT 0,
    fat_grams NUMERIC(6,1) DEFAULT 0,
    fiber_grams NUMERIC(6,1) DEFAULT 0,
    consumed_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Diet Plans Table (Curated Senior & Health Goal Plans)
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    target_condition TEXT NOT NULL,
    daily_calories INT NOT NULL,
    description TEXT NOT NULL,
    breakfast_plan TEXT NOT NULL,
    lunch_plan TEXT NOT NULL,
    dinner_plan TEXT NOT NULL,
    snacks_plan TEXT NOT NULL,
    hydration_tips TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo/production hackathon evaluation
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public access to profiles" ON public.profiles;
    CREATE POLICY "Public access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access to medications" ON public.medications;
    CREATE POLICY "Public access to medications" ON public.medications FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access to meals" ON public.meals;
    CREATE POLICY "Public access to meals" ON public.meals FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access to diet_plans" ON public.diet_plans;
    CREATE POLICY "Public access to diet_plans" ON public.diet_plans FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Seed Data: Sample Profile
INSERT INTO public.profiles (user_id, full_name, age, gender, medical_conditions, allergies, daily_calorie_target, emergency_contact_name, emergency_contact_phone)
VALUES (
    'senior_user_1',
    'Ramesh Sharma (Age 68)',
    68,
    'Male',
    ARRAY['Hypertension (Blood Pressure)', 'Joint Arthritis'],
    ARRAY['Penicillin'],
    1800,
    'Dr. Sunita Sharma (Daughter & Caregiver)',
    '+91 98765 43210'
) ON CONFLICT (id) DO NOTHING;

-- Seed Data: Daily Medications with Visual Pill Identifiers
INSERT INTO public.medications (user_id, name, dosage, schedule_time, meal_relation, status, color_tag, pill_shape, notes)
VALUES 
    ('senior_user_1', 'Amlodipine (Blood Pressure)', '5 mg - 1 Tablet', '08:00 AM', 'After Breakfast', 'taken', 'blue', 'round', 'Take with fresh warm water.'),
    ('senior_user_1', 'Calcium + Vitamin D3 (Bones)', '500 mg - 1 Tablet', '01:30 PM', 'After Lunch', 'pending', 'amber', 'oval', 'Essential for bone density and knee mobility.'),
    ('senior_user_1', 'Atorvastatin (Cholesterol)', '10 mg - 1 Tablet', '08:30 PM', 'After Dinner', 'pending', 'rose', 'capsule', 'Take before sleeping at night.'),
    ('senior_user_1', 'Multivitamin Senior Formula', '1 Capsule', '09:00 AM', 'With Morning Tea', 'taken', 'purple', 'capsule', 'Supports immunity and daily vitality.')
ON CONFLICT (id) DO NOTHING;

-- Seed Data: Today's Meals
INSERT INTO public.meals (user_id, meal_type, food_name, calories, protein_grams, carbs_grams, fat_grams, fiber_grams)
VALUES
    ('senior_user_1', 'Breakfast', 'Oats Porridge with Almonds & Banana', 380, 14.5, 56.0, 9.2, 8.5),
    ('senior_user_1', 'Lunch', 'Moong Dal, Brown Rice, Spinach Curry & Curd', 520, 24.0, 72.0, 11.5, 12.0),
    ('senior_user_1', 'Snacks', 'Roasted Makhana (Foxnuts) & Green Tea', 140, 4.5, 22.0, 3.0, 3.5)
ON CONFLICT (id) DO NOTHING;

-- Seed Data: Curated Senior Diet Plans
INSERT INTO public.diet_plans (title, target_condition, daily_calories, description, breakfast_plan, lunch_plan, dinner_plan, snacks_plan, hydration_tips)
VALUES
    (
        'Cardio-Shield Senior Plan',
        'Hypertension & Heart Wellness',
        1750,
        'Specially formulated for elderly seniors managing blood pressure. Rich in potassium and magnesium with very low sodium content.',
        'Warm Steel-cut oats with crushed chia seeds, banana slices, and unsalted walnuts with warm skimmed milk.',
        'Yellow Moong Dal (tempered with cumin & garlic), 2 whole wheat rotis, steamed bottle gourd (Lauki), and fresh homemade curd.',
        'Clear vegetable soup, steamed khichdi with mixed vegetables, and lightly roasted paneer cubes.',
        'Roasted Makhana (Foxnuts), unsalted pumpkin seeds, and hot chamomile or herbal tea.',
        'Drink 8-9 glasses of lukewarm water spread across the day. Avoid cold chilled water before bedtime.'
    ),
    (
        'Glucocare Diabetic Friendly Plan',
        'Diabetes & Blood Sugar Stability',
        1600,
        'Low glycemic index (GI) meals designed to avoid insulin spikes, improve sustained energy, and assist digestion.',
        'Multigrain vegetable cheela (pancake) with mint chutney and a small cup of low-fat curd.',
        'Mixed sprouts salad, 1 bowl brown rice or quinoa, methi (fenugreek) sabzi, and boiled egg whites or tofu curry.',
        'Vegetable barley soup followed by grilled cottage cheese with sautéed green beans and broccoli.',
        'Handful of roasted chana (Bengal gram) and a cup of unsweetened cinnamon tea.',
        'Consume methi dana water in the early morning and drink water 30 minutes before each meal.'
    ),
    (
        'Joint Ease & Mobility Plan',
        'Arthritis & Bone Strengthening',
        1800,
        'Anti-inflammatory senior diet packed with Omega-3, calcium, and vitamin D for easing joint pain and improving mobility.',
        'Fortified porridge with crushed flaxseeds, boiled egg, and half a papaya.',
        'Palak (Spinach) paneer, soft jowar/bajra roti, cucumber raita, and steamed green beans.',
        'Light moong dal soup, soft vegetable pulao, and steamed pumpkin curry.',
        'Warm golden turmeric milk (Haldi Doodh) at 5:00 PM with 2 sugar-free digestive biscuits.',
        'Keep a marked copper or steel water bottle by the bedside to monitor daily water intake easily.'
    )
ON CONFLICT (id) DO NOTHING;
