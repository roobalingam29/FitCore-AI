-- ===================================================
-- FitCore AI – Smart Gym Management System
-- Database Initial Seed Data
-- ===================================================

USE fitcore_db;

-- Insert Users
INSERT INTO users (id, name, email, password_hash, role, avatar, phone) VALUES
('u-admin', 'Alexander Stone (Admin)', 'admin@fitcore.ai', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1 (800) 555-0199'),
('u-trainer', 'Marcus Vance (Coach)', 'marcus.v@fitcore.ai', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'trainer', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150', '+1 (555) 111-2222'),
('u-member', 'Sarah Jenkins (Member)', 'sarah.j@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'member', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1 (555) 234-5678');

-- Insert Membership Plans
INSERT INTO membership_plans (id, name, code, duration_months, price, description, features, is_popular) VALUES
('p1', 'Basic Fitness', 'PLAN-BASIC', 1, 49.00, 'Standard access to cardio and weight room.', '["Floor Access", "Locker Access"]', FALSE),
('p2', 'Pro Performance', 'PLAN-PRO', 6, 89.00, 'All-inclusive access including sauna & AI workout generator.', '["24/7 Access", "Group Classes", "Sauna", "AI Recommendations"]', TRUE),
('p3', 'Elite VIP Access', 'PLAN-ELITE', 12, 149.00, 'Premium VIP tier with dedicated trainer sessions.', '["24/7 VIP Access", "4 PT Sessions/Mo", "Free Smoothies"]', FALSE);

-- Insert Trainers
INSERT INTO trainers (id, trainer_code, name, email, phone, specialization, experience_years, status, rating, shift_hours, bio) VALUES
('t1', 'TR-01', 'Marcus Vance', 'marcus.v@fitcore.ai', '+1 (555) 111-2222', '["Strength", "Hypertrophy", "Nutrition"]', 7, 'active', 4.90, '06:00 AM - 02:00 PM', 'Certified CSCS coach specializing in athletic performance.'),
('t2', 'TR-02', 'Elena Rostova', 'elena.r@fitcore.ai', '+1 (555) 222-3333', '["HIIT", "Mobility", "Pilates"]', 5, 'active', 4.80, '10:00 AM - 06:00 PM', 'Former Olympic conditioning coach focusing on mobility.');

-- Insert Members
INSERT INTO members (id, member_code, name, email, phone, gender, date_of_birth, plan_id, status, join_date, expiry_date, assigned_trainer_id, emergency_contact, fitness_goal) VALUES
('m1', 'FC-1001', 'Sarah Jenkins', 'sarah.j@example.com', '+1 (555) 234-5678', 'female', '1995-04-12', 'p2', 'active', '2024-01-15', '2025-01-15', 't1', 'David Jenkins (+1 555 999 1111)', 'Hypertrophy & Endurance'),
('m2', 'FC-1002', 'Alexander Wright', 'alex.wright@example.com', '+1 (555) 876-5432', 'male', '1988-11-23', 'p3', 'active', '2023-09-01', '2025-09-01', 't2', 'Claire Wright (+1 555 888 2222)', 'Powerlifting');

-- Insert Inventory Items
INSERT INTO inventory_items (id, sku, name, category, quantity, min_threshold, unit_price, cost_price, supplier, status, last_restocked) VALUES
('inv-1', 'SUP-WHEY-1K', 'Optimum Whey Isolate 1kg', 'supplements', 34, 10, 65.00, 42.00, 'NutriTech Distributors', 'in_stock', '2024-07-20'),
('inv-2', 'BEV-PREWORK-30', 'Ignite Pre-Workout Tub', 'beverages', 6, 12, 38.00, 22.00, 'NutriTech Distributors', 'low_stock', '2024-06-15');
