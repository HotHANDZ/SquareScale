CREATE DATABASE  IF NOT EXISTS `squarescale` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `squarescale`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: squarescale
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'regularBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',1,1,'Braden1','McCoy'),(2,'managerBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',2,1,'Braden2','McCoy'),(3,'adminBraden','1234','bradenmccoycg@gmail.com','2026-03-03 09:17:15',3,1,'Braden3','McCoy'),(4,'regularBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',1,1,'Brandon1','Merck'),(5,'managerBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',2,1,'Brandon2','Merck'),(6,'adminBrandon','1234','bmerck@students.kennesaw.edu','2026-03-03 09:17:15',3,1,'Brandon3','Merck'),(7,'regularWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',1,1,'Will1','Van Winkle'),(8,'managerWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',2,1,'Will2','Van Winkle'),(9,'adminWill','1234','willvanwinkle711@gmail.com','2026-03-03 09:17:15',3,1,'Will3','Van Winkle'),(10,'regularClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',1,1,'Claudio1','Costa'),(11,'managerClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',2,1,'Claudio2','Costa'),(12,'adminClaudio','1234','costaclaudio2001@gmail.com','2026-03-03 09:17:15',3,1,'Claudio3','Costa'),(13,'regularAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',1,1,'Aminah1','Babar'),(14,'adminAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',2,1,'Aminah2','Babar'),(15,'managerAminah','1234','aminahbabar@gmail.com','2026-03-03 09:17:15',3,1,'Aminah3','Babar');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-03 18:00:08
