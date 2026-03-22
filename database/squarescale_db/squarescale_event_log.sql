-- Audit / event log: userId = logged-in user who performed the action; optional legacy beforeImage/afterImage.
-- Run against `squarescale` after `users` exists.

USE squarescale;

DROP TABLE IF EXISTS `event_log`;

CREATE TABLE `event_log` (
  `eventId` bigint NOT NULL AUTO_INCREMENT,
  `entityType` varchar(64) NOT NULL,
  `entityId` bigint DEFAULT NULL,
  `action` varchar(32) NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `beforeImage` longtext,
  `afterImage` longtext,
  PRIMARY KEY (`eventId`),
  KEY `idx_event_entity` (`entityType`, `entityId`),
  KEY `idx_event_user` (`userId`),
  KEY `idx_event_time` (`createdAt`),
  CONSTRAINT `fk_event_log_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
