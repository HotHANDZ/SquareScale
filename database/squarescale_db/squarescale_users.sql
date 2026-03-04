CREATE DATABASE IF NOT EXISTS `squarescale`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `squarescale`;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userID` int NOT NULL,
  `username` varchar(16) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `roleID` int NOT NULL,
  `isActive` tinyint NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`userID`,`username`,`passwordHash`,`email`,`createdAt`,`roleID`,`isActive`,`firstName`,`lastName`,`failed_login_attempts`) VALUES
(1,'regularBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',1,1,'Braden1','McCoy',0),
(2,'managerBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',2,1,'Braden2','McCoy',0),
(3,'adminBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',3,1,'Braden3','McCoy',0),
(4,'regularBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',1,1,'Brandon1','Merck',0),
(5,'managerBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',2,1,'Brandon2','Merck',0),
(6,'adminBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',3,1,'Brandon3','Merck',0),
(7,'regularWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',1,1,'Will1','Van Winkle',0),
(8,'managerWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',2,1,'Will2','Van Winkle',0),
(9,'adminWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',3,1,'Will3','Van Winkle',0),
(10,'regularClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',1,1,'Claudio1','Costa',0),
(11,'managerClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',2,1,'Claudio2','Costa',0),
(12,'adminClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',3,1,'Claudio3','Costa',0),
(13,'regularAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',1,1,'Aminah1','Babar',0),
(14,'adminAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',2,1,'Aminah2','Babar',0),
(15,'managerAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',3,1,'Aminah3','Babar',0);