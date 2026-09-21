-- ====================================================================
-- Database Initial Script for Personal Income & Expense Management System
-- Database Engine: MySQL 8.0
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- Path: db/init/01-init.sql
-- ====================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- Table 1: users (Core User Table)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Table 2: categories (Master Data Table)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `icon` TEXT NULL,
  `color` VARCHAR(20) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Table 3: transactions (Transaction Table - Single Table Strategy)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `category_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `date` DATE NOT NULL,
  `note` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_tx_amount_positive` CHECK (`amount` > 0),
  CONSTRAINT `fk_tx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tx_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  INDEX `idx_tx_user_date` (`user_id`, `date` DESC),
  INDEX `idx_tx_user_type_date` (`user_id`, `type`, `date`),
  INDEX `idx_tx_user_category` (`user_id`, `category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Table 4: audit_logs (Log / History Table)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `actor_user_id` BIGINT NULL,
  `action` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` BIGINT NULL,
  `old_value` JSON NULL,
  `new_value` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_audit_actor_created` (`actor_user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Table 5: recurring_transactions (Monthly Automated Transactions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `recurring_transactions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `category_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `day_of_month` INT NOT NULL,
  `note` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_generated_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_recurring_amount` CHECK (`amount` > 0),
  CONSTRAINT `chk_day_of_month` CHECK (`day_of_month` BETWEEN 1 AND 31),
  CONSTRAINT `fk_recurring_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recurring_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  INDEX `idx_recurring_user_active` (`user_id`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA: Standard Categories (Master Data)
-- ====================================================================

-- 1. Income Categories
INSERT INTO `categories` (`id`, `name`, `type`, `icon`, `color`) VALUES
(1, 'เงินเดือน', 'income', '💼', '#10B981'),
(2, 'รายได้พิเศษ / ฟรีแลนซ์', 'income', '💻', '#3B82F6'),
(3, 'การลงทุน / ปันผล', 'income', '📈', '#8B5CF6'),
(4, 'ขายของ / ค้าขาย', 'income', '🏪', '#F59E0B'),
(5, 'รายรับอื่นๆ', 'income', '💰', '#6B7280');

-- 2. Expense Categories
INSERT INTO `categories` (`id`, `name`, `type`, `icon`, `color`) VALUES
(6, 'อาหารและเครื่องดื่ม', 'expense', '🍔', '#EF4444'),
(7, 'ค่าเดินทาง / น้ำมัน', 'expense', '🚗', '#F97316'),
(8, 'ช้อปปิ้ง / ของใช้', 'expense', '🛍️', '#EC4899'),
(9, 'ค่าที่พัก / ค่าน้ำ-ค่าไฟ', 'expense', '🏠', '#6366F1'),
(10, 'ความบันเทิง / พักผ่อน', 'expense', '🎮', '#84CC16'),
(11, 'การศึกษา / พัฒนาตนเอง', 'expense', '📚', '#14B8A6'),
(12, 'สุขภาพ / พยาบาล', 'expense', '🏥', '#06B6D4'),
(13, 'รายจ่ายอื่นๆ', 'expense', '✨', '#9CA3AF');
