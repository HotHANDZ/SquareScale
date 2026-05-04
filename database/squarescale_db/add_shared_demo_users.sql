-- Add shared demo users (Admin / Manager / User, password 1234) if missing.
-- Use this when you already have a database and do not want to re-run squarescale_users.sql from scratch.
-- Safe to run multiple times: only fills empty userID slots 16–18.

USE squarescale;

INSERT INTO `users` (`userID`,`username`,`passwordHash`,`email`,`createdAt`,`roleID`,`isActive`,`firstName`,`lastName`,`failed_login_attempts`)
VALUES
  (16,'User','1234','demo.user@squarescale.local',NOW(),1,1,'Demo','User',0),
  (17,'Manager','1234','demo.manager@squarescale.local',NOW(),2,1,'Demo','Manager',0),
  (18,'Admin','1234','demo.admin@squarescale.local',NOW(),3,1,'Demo','Administrator',0)
ON DUPLICATE KEY UPDATE
  `username` = VALUES(`username`),
  `passwordHash` = VALUES(`passwordHash`),
  `email` = VALUES(`email`),
  `roleID` = VALUES(`roleID`),
  `isActive` = VALUES(`isActive`),
  `firstName` = VALUES(`firstName`),
  `lastName` = VALUES(`lastName`),
  `failed_login_attempts` = 0;
