-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: tues
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `connection_codes`
--

DROP TABLE IF EXISTS `connection_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `connection_codes` (
  `code` varchar(10) NOT NULL,
  `pro_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `pro_id` (`pro_id`),
  CONSTRAINT `connection_codes_ibfk_1` FOREIGN KEY (`pro_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connection_codes`
--

LOCK TABLES `connection_codes` WRITE;
/*!40000 ALTER TABLE `connection_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `connection_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise_library`
--

DROP TABLE IF EXISTS `exercise_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_library` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `intensity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `exercise_library_chk_1` CHECK ((`intensity` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_library`
--

LOCK TABLES `exercise_library` WRITE;
/*!40000 ALTER TABLE `exercise_library` DISABLE KEYS */;
INSERT INTO `exercise_library` VALUES (15,'Laatikkohengitys (Box Breathing)','Sotilas- ja pelastusalan käyttämä tekniikka: Hengitä sisään 4s, pidätä 4s, ulos 4s, pidätä 4s. Laskee välittömästi sykettä ja stressitasoa.','breathe',1),(16,'4-7-8 -hengitys','Tohtori Andrew Weilin kehittämä menetelmä parasympaattisen hermoston aktivoimiseksi. Auttaa nukahtamaan ja tyynnyttämään mieltä.','breathe',1),(17,'Progressiivinen lihasrentoutus','Jännitä ja rentouta eri lihasryhmiä vuorotellen. Tutkitusti vähentää fyysistä ahdistusta ja kehon jännitystiloja.','stretch',1),(18,'Yoga Nidra','Syvärentoutusharjoitus, joka säätelee hermostoa. 20 minuuttia vastaa tutkimusten mukaan jopa parin tunnin syvää unta.','yoga',1),(19,'Metsäkävely','Tieteellisesti todistettu laskevan verenpainetta ja parantavan vastustuskykyä. Kävele metsässä ilman päämäärää vähintään 20 minuuttia.','walk',2),(20,'Kevyt Yin-jooga','Pitkäkestoiset venytykset, jotka kohdistuvat sidekudoksiin. Auttaa laskemaan kehon sympaattista vireystilaa.','yoga',2),(21,'Aurinkokävely','Aamun luonnonvalo säätelee sirkadiaanista rytmiä ja parantaa serotoniinin tuotantoa, mikä auttaa illalla palautumaan paremmin.','walk',2),(22,'Rauhallinen uinti','Veden paine ja rytminen liike vaikuttavat rauhoittavasti hermostoon samalla kun kunto kasvaa maltillisesti.','swim',3),(23,'Flow-jooga','Yhdistää hengityksen ja liikkeen. Parantaa keskittymiskykyä ja kehonhallintaa ilman äärimmäistä rasitusta.','yoga',3),(24,'PK-hölkkä (Peruskestävyys)','Hölkkää vauhdilla, jossa pystyisit vielä puhumaan. Parantaa sydämen iskutilavuutta ilman massiivista stressireaktiota.','run',3),(25,'Vauhtikestävyysjuoksu','Nostaa aerobista kynnystä. Vapauttaa endorfiineja, jotka toimivat luonnollisina stressin lievittäjinä kovan työpäivän jälkeen.','run',4),(26,'Voimaharjoittelu (Perus)','Raskaat moninivelliikkeet vahvistavat tuki- ja liikuntaelimistöä ja parantavat itseluottamusta sekä hormonaalista tasapainoa.','gym',4),(27,'Tabata-intervallit','20s täysillä, 10s lepo. Erittäin tehokas tapa parantaa hapenottokykyä, mutta vaatii hermostolta täydellistä valmiustilaa.','run',5),(28,'HIIT-treeni','Korkeatehoinen intervalliharjoitus. Parantaa insuliiniherkkyyttä ja antaa kovan metabolisen vasteen.','gym',5);
/*!40000 ALTER TABLE `exercise_library` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kubios_results`
--

DROP TABLE IF EXISTS `kubios_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kubios_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `measure_id` varchar(36) NOT NULL,
  `measured_at` datetime DEFAULT NULL,
  `artefact_level` varchar(255) DEFAULT NULL,
  `mean_hr` decimal(5,2) DEFAULT NULL,
  `pns_index` decimal(5,2) DEFAULT NULL,
  `readiness` decimal(5,2) DEFAULT NULL,
  `rmssd` decimal(5,2) DEFAULT NULL,
  `sdnn` decimal(5,2) DEFAULT NULL,
  `sns_index` decimal(5,2) DEFAULT NULL,
  `stress_index` decimal(5,2) DEFAULT NULL,
  `lf_hf` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `measure_id` (`measure_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `kubios_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1950 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kubios_results`
--

LOCK TABLES `kubios_results` WRITE;
/*!40000 ALTER TABLE `kubios_results` DISABLE KEYS */;
INSERT INTO `kubios_results` VALUES (13,1,'4a40f76f-5e07-4a13-a09f-9ffbe3bd0803','2026-02-08 08:44:25','GOOD',62.34,1.94,62.50,107.47,116.69,-1.00,4.37,4.40),(15,1,'5aa12db4-43e1-4d3c-8000-e0304f2afb11','2026-03-06 22:07:28','GOOD',62.14,1.57,66.20,94.99,119.89,-0.94,4.49,5.07),(16,1,'542214f5-fa6b-4509-bc6e-8dee76a1f1a2','2026-03-10 20:13:37','GOOD',65.63,1.79,69.18,110.95,129.76,-0.71,4.75,3.93),(17,1,'9f4a99de-9f3d-402e-bf55-4927e80f1427','2026-03-11 21:03:17','LOW',76.65,-0.37,35.56,54.41,78.94,0.15,5.37,3.50),(18,1,'7d32d99c-b3c6-4c6f-ba3e-c28b34ec7af5','2026-03-17 09:22:00','GOOD',60.86,2.61,79.70,126.27,116.10,-1.22,4.01,2.15),(37,1,'6fba6d5b-b301-44b4-a619-5b94423318db','2026-05-04 15:54:34','GOOD',70.46,0.00,38.23,57.66,89.96,-0.07,6.37,10.79),(94,1,'0f9b93a2-491f-11f1-ac60-afad56a74460','2026-04-20 07:30:00','GOOD',58.00,1.20,88.00,52.00,65.00,-0.50,8.20,1.10),(95,1,'0f9b9d7a-491f-11f1-ac60-afad56a74460','2026-04-21 07:45:00','GOOD',60.00,0.80,82.00,48.00,60.00,-0.20,9.10,1.30),(96,1,'0f9b9fa0-491f-11f1-ac60-afad56a74460','2026-04-22 08:00:00','GOOD',57.00,1.50,92.00,58.00,72.00,-0.80,7.50,0.90),(97,1,'0f9ba086-491f-11f1-ac60-afad56a74460','2026-04-23 07:15:00','GOOD',59.00,1.10,85.00,50.00,63.00,-0.40,8.80,1.20),(98,1,'0f9becda-491f-11f1-ac60-afad56a74460','2026-04-24 07:30:00','GOOD',62.00,0.50,78.00,42.00,55.00,0.10,10.20,1.50),(99,1,'0f9bee60-491f-11f1-ac60-afad56a74460','2026-04-25 09:30:00','GOOD',55.00,1.80,95.00,65.00,80.00,-1.20,6.40,0.80),(100,1,'0f9bef46-491f-11f1-ac60-afad56a74460','2026-04-26 10:00:00','GOOD',56.00,1.60,90.00,60.00,75.00,-1.00,7.10,1.00),(101,1,'0f9bf022-491f-11f1-ac60-afad56a74460','2026-04-27 07:30:00','GOOD',65.00,-0.20,65.00,35.00,48.00,0.80,12.50,2.20),(102,1,'0f9bf0d6-491f-11f1-ac60-afad56a74460','2026-04-28 07:15:00','GOOD',68.00,-0.80,58.00,28.00,40.00,1.20,14.80,2.80),(103,1,'0f9bf18a-491f-11f1-ac60-afad56a74460','2026-04-29 07:45:00','GOOD',72.00,-1.50,45.00,22.00,35.00,2.10,18.20,3.50),(104,1,'0f9bf23e-491f-11f1-ac60-afad56a74460','2026-04-30 07:30:00','GOOD',70.00,-1.20,52.00,25.00,38.00,1.80,16.50,3.10),(105,1,'0f9bf2e8-491f-11f1-ac60-afad56a74460','2026-05-01 08:15:00','GOOD',66.00,-0.50,62.00,32.00,45.00,1.00,13.10,2.40),(106,1,'0f9bf3a6-491f-11f1-ac60-afad56a74460','2026-05-02 09:00:00','GOOD',63.00,0.10,70.00,38.00,50.00,0.40,11.20,1.80),(107,1,'0f9bf464-491f-11f1-ac60-afad56a74460','2026-05-06 15:11:33','GOOD',64.00,-0.10,68.00,36.00,49.00,0.60,11.80,1.90),(1928,1,'d8dded31-495d-4c8f-9ef5-36b9821b6bc5','2026-05-07 17:42:09','GOOD',73.79,-0.06,46.38,59.53,75.41,-0.01,5.78,1.53);
/*!40000 ALTER TABLE `kubios_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_pro_links`
--

DROP TABLE IF EXISTS `patient_pro_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_pro_links` (
  `pro_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pro_id`,`patient_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `patient_pro_links_ibfk_1` FOREIGN KEY (`pro_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `patient_pro_links_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_pro_links`
--

LOCK TABLES `patient_pro_links` WRITE;
/*!40000 ALTER TABLE `patient_pro_links` DISABLE KEYS */;
INSERT INTO `patient_pro_links` VALUES (3,1,'{\"share_hrv\": true, \"share_entries\": true}','2026-05-07 13:20:50');
/*!40000 ALTER TABLE `patient_pro_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `professional_id` int DEFAULT NULL,
  `exercise_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `message` text NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercise_library` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_entries`
--

DROP TABLE IF EXISTS `user_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_text` text NOT NULL,
  `workload` int DEFAULT NULL,
  `mood_score` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_entries_chk_1` CHECK ((`mood_score` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_entries`
--

LOCK TABLES `user_entries` WRITE;
/*!40000 ALTER TABLE `user_entries` DISABLE KEYS */;
INSERT INTO `user_entries` VALUES (2,1,'Feeling rested and ready for the week.',2,5,'2026-04-20 08:00:00'),(3,1,'Good sleep, focused at work.',3,4,'2026-04-21 08:05:00'),(4,1,'Great morning workout.',2,5,'2026-04-22 08:15:00'),(5,1,'Busy day but energy levels are high.',3,4,'2026-04-23 07:45:00'),(6,1,'A bit tired but mood is stable.',4,3,'2026-04-24 08:00:00'),(7,1,'Weekend vibes, feeling awesome.',1,5,'2026-04-25 10:00:00'),(8,1,'Relaxing Sunday.',1,5,'2026-04-26 10:30:00'),(9,1,'Big project starting, feeling pressured.',5,3,'2026-04-27 08:00:00'),(10,1,'Stayed up late working. Tired.',5,2,'2026-04-28 07:45:00'),(11,1,'Headache and very stressed.',5,1,'2026-04-29 08:15:00'),(12,1,'Barely made it through the day.',4,2,'2026-04-30 08:00:00'),(13,1,'Still feeling overwhelmed.',5,2,'2026-05-01 08:45:00'),(14,1,'Couldn\'t relax today.',3,3,'2026-05-02 09:30:00'),(20,14,'Olo on energinen viikonlopun jälkeen. Valmiina uuteen viikkoon!',2,1,'2026-05-01 20:00:00'),(21,14,'Rauhallinen lauantai, ulkoilua ja hyvää ruokaa.',1,2,'2026-05-02 21:00:00'),(22,14,'Projektin deadline painaa päälle. Nukuin huonosti ja kahvia kuluu liikaa.',4,3,'2026-05-04 22:30:00'),(23,14,'Todella raskas päivä. Kroppa tuntuu ylikierroksilla ja päässä tykyttää.',5,5,'2026-05-05 22:00:00'),(24,14,'Päätin ottaa illan rennosti ja mennä ajoissa nukkumaan. HRV näköjään pohjalukemissa.',3,4,'2026-05-06 21:15:00'),(25,14,'Vähän parempi fiilis jo. Tein lyhyen hengitysharjoituksen sovelluksen suosituksesta.',2,3,'2026-05-07 19:00:00');
/*!40000 ALTER TABLE `user_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role` enum('user','pro') DEFAULT 'user',
  `pro_code` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Eetu','eetu.parvela@metropolia.fi','f60bb38a-b3a7-4b34-89cc-099464294b2a',178,73.00,'2003-06-05','user','LEEYWW','2026-05-03 19:11:33'),(3,'Professional','pro@test.com','$2b$10$6pwGgwlhDxDBe/Y2b7dUFecbHqcbbov9Vsw/QUHSHgOElWk6QgrMS',NULL,NULL,NULL,'pro',NULL,'2026-05-05 21:17:31'),(14,'Test','test@test.com','7d154852-c5e5-4ae6-aab0-0ff628204686',180,75.00,'2000-01-01','user',NULL,'2026-05-07 17:48:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_reports`
--

DROP TABLE IF EXISTS `weekly_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `week_number` int NOT NULL,
  `year` int NOT NULL,
  `avg_rmssd` decimal(5,2) DEFAULT NULL,
  `avg_readiness` decimal(5,2) DEFAULT NULL,
  `avg_stress_score` decimal(5,2) DEFAULT NULL,
  `avg_mood_score` decimal(3,2) DEFAULT NULL,
  `pro_comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_week_year` (`user_id`,`week_number`,`year`),
  CONSTRAINT `weekly_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_reports`
--

LOCK TABLES `weekly_reports` WRITE;
/*!40000 ALTER TABLE `weekly_reports` DISABLE KEYS */;
INSERT INTO `weekly_reports` VALUES (1,1,6,2026,107.47,62.50,4.37,NULL,NULL,'2026-05-06 11:04:25'),(2,1,9,2026,89.60,60.40,4.72,NULL,NULL,'2026-05-06 11:04:25'),(3,1,10,2026,82.68,52.37,5.06,NULL,NULL,'2026-05-06 11:04:25'),(4,1,11,2026,126.27,79.70,4.01,NULL,NULL,'2026-05-06 11:04:25'),(5,1,18,2026,46.83,53.12,9.09,2.00,'Testi','2026-05-06 11:04:25'),(6,1,16,2026,52.50,86.67,8.37,4.33,NULL,'2026-05-06 11:04:25'),(7,1,17,2026,34.29,63.14,13.34,2.57,'Testi kommentti','2026-05-06 11:04:25'),(8,14,19,2026,39.09,65.43,13.23,3.00,'Huomioitavaa: Viikon HRV-keskiarvo (RMSSD 39ms) on laskenut merkittävästi alkuviikon stressipiikin vuoksi. Tiistain ja keskiviikon lukemat olivat kriittisen alhaiset, mikä korreloi käyttäjän merkintöjen kanssa. Loppuviikon palautuminen on alkanut, mutta vaatii vielä lepoa.','2026-05-07 10:00:00');
/*!40000 ALTER TABLE `weekly_reports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07 23:10:55
