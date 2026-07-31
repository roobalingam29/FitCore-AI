-- ===================================================
-- FitCore AI – Smart Gym Management System
-- Database Schema (MySQL Compatible)
-- ===================================================

CREATE DATABASE IF NOT EXISTS fitcore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitcore_db;

-- 1. Users Table (Role-Based Access)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'trainer', 'member') NOT NULL DEFAULT 'member',
    avatar VARCHAR(255),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features JSON,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'archived') DEFAULT 'active'
);

-- 3. Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
    id VARCHAR(36) PRIMARY KEY,
    trainer_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    specialization JSON,
    experience_years INT DEFAULT 0,
    status ENUM('active', 'on_leave', 'inactive') DEFAULT 'active',
    rating DECIMAL(3,2) DEFAULT 5.00,
    shift_hours VARCHAR(100),
    bio TEXT,
    avatar VARCHAR(255)
);

-- 4. Members Table
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(36) PRIMARY KEY,
    member_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE,
    plan_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'expiring', 'expired', 'suspended') DEFAULT 'active',
    join_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    assigned_trainer_id VARCHAR(36),
    emergency_contact VARCHAR(255),
    fitness_goal TEXT,
    last_check_in DATETIME,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(36) PRIMARY KEY,
    member_id VARCHAR(36) NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    method ENUM('qr_code', 'nfc', 'manual') DEFAULT 'qr_code',
    status ENUM('checked_in', 'checked_out') DEFAULT 'checked_in',
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    member_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'cash', 'upi') DEFAULT 'credit_card',
    purpose ENUM('membership_renewal', 'personal_training', 'pro_shop', 'locker') DEFAULT 'membership_renewal',
    status ENUM('paid', 'pending', 'failed', 'refunded') DEFAULT 'paid',
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 7. Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category ENUM('supplements', 'apparel', 'equipment', 'beverages', 'accessories') NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_threshold INT NOT NULL DEFAULT 10,
    unit_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100),
    status ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
    last_restocked DATE
);

-- Indexes for Query Speed
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_code ON members(member_code);
CREATE INDEX idx_attendance_checkin ON attendance_records(check_in_time);
CREATE INDEX idx_payments_date ON payments(payment_date);
