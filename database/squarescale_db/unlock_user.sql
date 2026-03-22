-- =============================================================================
-- Unlock a user account (clear suspension / lockout) — works for ANY username
-- =============================================================================
-- Your app blocks login when ANY of these are true (see AuthController):
--   1) isActive = 0
--   2) suspendedUntil is set to a future date/time
--   3) After 3 wrong passwords, the app sets isActive = 0 AND suspendedUntil = now + 1 day
--
-- Run in MySQL (Workbench / CLI) against database `squarescale`.
-- Change the username in the WHERE clause to match exactly (usernames are case-sensitive).
-- =============================================================================

USE squarescale;

-- Example: unlock user `regularBrandon` (edit the username as needed)
UPDATE `users`
SET
  `isActive` = 1,
  `failed_login_attempts` = 0,
  `suspendedUntil` = NULL
WHERE `username` = 'regularBrandon';

-- Verify:
-- SELECT userID, username, isActive, failed_login_attempts, suspendedUntil, passwordHash
-- FROM users WHERE username = 'regularBrandon';

-- =============================================================================
-- If password still fails after unlock (why "1234" might not work)
-- =============================================================================
-- • If passwordHash starts with "$2", it is BCrypt — only the password that was
--   used when that hash was created will work (not necessarily "1234").
-- • Usernames must match exactly, e.g. regularBrandon (capital B).
--
-- Development reset: store a LEGACY plain password (no $2 prefix) so the API
-- accepts it and re-hashes to BCrypt on next successful login:
--
-- UPDATE `users` SET `passwordHash` = '1234' WHERE `username` = 'regularBrandon';
--
-- Then log in with password 1234 once; the app will replace passwordHash with BCrypt.
-- For production, use "Forgot password" or an admin password change instead.
-- =============================================================================
