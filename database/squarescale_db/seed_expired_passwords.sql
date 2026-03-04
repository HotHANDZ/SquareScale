-- Run this in MySQL Workbench (squarescale database).
-- 1) Makes all existing users have a "current" password (not expired).
-- 2) Inserts new test users whose passwords count as expired (for the Expired Passwords report).

USE squarescale;

-- Step 1: Ensure every existing user is NOT expired (password last set = now).
-- WHERE uses primary key (userID) so it works with safe update mode. Adjust range if needed.
UPDATE users
SET passwordLastSet = NOW()
WHERE userID < 100;

-- Step 2: Add new test users with expired passwords (password last set 4+ months ago).
-- Use high userIDs (e.g. 100+) so they don't conflict with existing users.
-- If your table has a different column name (e.g. password_last_set), change it below.

INSERT INTO users (userID, username, passwordHash, email, createdAt, roleID, isActive, firstName, lastName, failed_login_attempts, passwordLastSet)
VALUES
  (100, 'expiredAlice', 'Abcdef1!', 'expired.alice@test.com', NOW(), 1, 1, 'Expired', 'Alice', 0, DATE_SUB(NOW(), INTERVAL 4 MONTH)),
  (101, 'expiredBob', 'Abcdef1!', 'expired.bob@test.com', NOW(), 2, 1, 'Expired', 'Bob', 0, DATE_SUB(NOW(), INTERVAL 5 MONTH)),
  (102, 'expiredCarol', 'Abcdef1!', 'expired.carol@test.com', NOW(), 3, 1, 'Expired', 'Carol', 0, DATE_SUB(NOW(), INTERVAL 6 MONTH));

-- If you get "Unknown column 'passwordLastSet'", run your app once so Hibernate creates the column,
-- or use the column name your table actually has (e.g. password_last_set).
