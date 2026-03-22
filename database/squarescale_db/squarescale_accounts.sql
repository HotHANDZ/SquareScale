-- Chart of accounts table (replaces older one-row-per-user design).
-- Run against database `squarescale` after `users` exists.
-- Account numbers: digits only; first digit 1–5 (assets, liabilities, equity, revenue, expense — class convention).

USE squarescale;

DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
  `accountId` int NOT NULL AUTO_INCREMENT,
  `accountName` varchar(255) NOT NULL,
  `accountNumber` varchar(20) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `normalSide` varchar(10) NOT NULL,
  `accountCategory` varchar(100) NOT NULL,
  `accountSubcategory` varchar(100) NOT NULL,
  `initialBalance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `debit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime NOT NULL,
  `userId` int NOT NULL,
  `accountOrder` varchar(10) NOT NULL,
  `statementType` varchar(16) NOT NULL,
  `commentText` varchar(500) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT 1,
  PRIMARY KEY (`accountId`),
  UNIQUE KEY `uk_account_number` (`accountNumber`),
  UNIQUE KEY `uk_account_name` (`accountName`),
  KEY `fk_accounts_user` (`userId`),
  CONSTRAINT `fk_accounts_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
