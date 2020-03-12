-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: localhost    Database: handshake
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `company_desc` varchar(3000) DEFAULT NULL,
  `fk_user_id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_no` bigint DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `profile_path` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`company_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `lu_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (2,'Apple Inc.,','We are a great company',20,'university_jobs@apple.com',9876543210,'Palo Alto','CA','USA','../ui/src/HandshakeFiles/company/2.jpg'),(3,'Facebook','We are Facebook',38,'facebookadmin@gmail.com',NULL,NULL,NULL,NULL,NULL),(4,'Tesla Inc.,','AutoMobile Manufacturing company',42,'tesla.company@gmail.com',9876543210,'Palo Alto','CA','USA',NULL);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_events`
--

DROP TABLE IF EXISTS `company_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `fk_company_id` int NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `event_desc` varchar(3000) DEFAULT NULL,
  `event_time` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `eligiblity` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `fk_company_id` (`fk_company_id`),
  CONSTRAINT `company_events_ibfk_1` FOREIGN KEY (`fk_company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_events`
--

LOCK TABLES `company_events` WRITE;
/*!40000 ALTER TABLE `company_events` DISABLE KEYS */;
INSERT INTO `company_events` VALUES (1,2,'Career Fair','Career Fair at SJSU, Free Pizza','2020-03-03','San Jose','All'),(3,4,'Python Developement Conference','Python conference by Elon Musk','2020-04-30','Palo Alto','All');
/*!40000 ALTER TABLE `company_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `fk_company_id` int NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Full Time',
  `postion` varchar(255) DEFAULT NULL,
  `job_desc` varchar(255) DEFAULT NULL,
  `job_location` varchar(255) DEFAULT NULL,
  `job_long_desc` varchar(500) NOT NULL,
  `deadline` date DEFAULT NULL,
  `job_long_desc2` varchar(500) DEFAULT NULL,
  `job_long_dec3` varchar(500) DEFAULT NULL,
  `skills_required` varchar(500) DEFAULT NULL,
  `company_name` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `fk_company_id` (`fk_company_id`),
  CONSTRAINT `job_postings_ibfk_1` FOREIGN KEY (`fk_company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES (1,2,'Full Time','CEO','CEO of Apple Inc....','San Jose','One of the greates jobs in silicon valley, Where you can work with great minds','2020-03-25','You will get KT from Tim Cook. \nSteve Jobs is Dead','$10000K an year','Leadership, Engaging with every one, Team Management','Apple Inc.,'),(2,3,'Full Time','Software Dev','Has  to develop FB','Palo Alto','Working at FB gives you a chance to work with all the best developers around the globe and helping people to connect with every one','2020-04-01','working with Mark Zuckerburg, You will get to know his wife','You will be developing major compenents in FB. ','Node Js, React JS, MongoDB','Facebook'),(4,4,'Internship','Performance Engineering Intern','You have to improve the performance of the cars','Palo Alto','You will work closely with Elon mask as part of your job','2020-05-31','You have to work 50 hours a week to be succesful in this role','$35 per hour','Java, Python, Aws','Tesla Inc.,'),(5,4,'Full Time','Quality Assurance Engineer','QA for cars developed','San Jose','You have to test cars with AI','2020-04-22','You will work with Elon Musk','$100k an year','Junit, Java','Tesla Inc.,');
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lu_role`
--

DROP TABLE IF EXISTS `lu_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lu_role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lu_role`
--

LOCK TABLES `lu_role` WRITE;
/*!40000 ALTER TABLE `lu_role` DISABLE KEYS */;
INSERT INTO `lu_role` VALUES (1,'Student','Student in Handshake'),(2,'Company','Company in Handshake');
/*!40000 ALTER TABLE `lu_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lu_user`
--

DROP TABLE IF EXISTS `lu_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lu_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lu_user`
--

LOCK TABLES `lu_user` WRITE;
/*!40000 ALTER TABLE `lu_user` DISABLE KEYS */;
INSERT INTO `lu_user` VALUES (1,'admin','admin@admin.com','U2FsdGVkX18LVd/IpsZ6a+KV3aMKwFDZJZtDOBN3H+A=','student'),(20,'apple_admin','apple@apple.com','U2FsdGVkX1/mN1pAO0al7PThqutIVEoSnmKI8Cc0YQc=','company'),(38,'fb_admin','facebookadmin@gmail.com','U2FsdGVkX18LVd/IpsZ6a+KV3aMKwFDZJZtDOBN3H+A=','company'),(42,'tesla_admin','tesla.company@gmail.com','U2FsdGVkX19Z5kv3JIsskjry0WBzr5wtOgSFmN7wo1s=','company'),(43,'ron_weasley','ron.weasley@harrypotter.com','U2FsdGVkX187H/VNoMq7/Kn6BKTwF1IXWqysMgOEOHw=','student'),(44,'draco.malfoy','draco.malfoy@harrypotter.com','U2FsdGVkX19m7wSM1+ghKgW++CrxQZL+ldmUaaQURP8=','student');
/*!40000 ALTER TABLE `lu_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_role_tab`
--

DROP TABLE IF EXISTS `map_role_tab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_role_tab` (
  `role_tab_id` int NOT NULL AUTO_INCREMENT,
  `tab_name` varchar(255) DEFAULT NULL,
  `tab_display_name` varchar(255) DEFAULT NULL,
  `fk_role_id` int NOT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `route_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_tab_id`),
  KEY `fk_role_id` (`fk_role_id`),
  CONSTRAINT `map_role_tab_ibfk_1` FOREIGN KEY (`fk_role_id`) REFERENCES `lu_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_role_tab`
--

LOCK TABLES `map_role_tab` WRITE;
/*!40000 ALTER TABLE `map_role_tab` DISABLE KEYS */;
INSERT INTO `map_role_tab` VALUES (1,'Home_student','Dashboard',1,'student','/home'),(2,'ProfileStudent','Profile',1,'student','/profile'),(3,'EventsStudent','Events',2,'company','/companyEvents'),(4,'ApplicationStudents','Applications',1,'student','/applications'),(5,'studentsSearchStudents','Students',1,'student','/students'),(6,'companyHome','Dashboard',2,'company','/companyHome'),(7,'companyStudents','Students',2,'company','/students'),(8,'companyProfile','Profile',2,'company','/companyProfile'),(9,'eventsStudent','Events',1,'student','/events');
/*!40000 ALTER TABLE `map_role_tab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_student_event`
--

DROP TABLE IF EXISTS `map_student_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_student_event` (
  `map_event_id` int NOT NULL AUTO_INCREMENT,
  `fk_student_id` int NOT NULL,
  `fk_event_id` int NOT NULL,
  `registration_data` date DEFAULT NULL,
  PRIMARY KEY (`map_event_id`),
  KEY `fk_student_id` (`fk_student_id`),
  KEY `fk_event_id` (`fk_event_id`),
  CONSTRAINT `map_student_event_ibfk_1` FOREIGN KEY (`fk_student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `map_student_event_ibfk_2` FOREIGN KEY (`fk_event_id`) REFERENCES `company_events` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_student_event`
--

LOCK TABLES `map_student_event` WRITE;
/*!40000 ALTER TABLE `map_student_event` DISABLE KEYS */;
INSERT INTO `map_student_event` VALUES (3,21,1,'2020-03-11');
/*!40000 ALTER TABLE `map_student_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_student_job`
--

DROP TABLE IF EXISTS `map_student_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_student_job` (
  `map_application_id` int NOT NULL AUTO_INCREMENT,
  `fk_student_id` int NOT NULL,
  `fk_job_id` int NOT NULL,
  `application_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `resume_path` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`map_application_id`),
  KEY `fk_student_id` (`fk_student_id`),
  KEY `fk_job_id` (`fk_job_id`),
  CONSTRAINT `map_student_job_ibfk_1` FOREIGN KEY (`fk_student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `map_student_job_ibfk_2` FOREIGN KEY (`fk_job_id`) REFERENCES `job_postings` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_student_job`
--

LOCK TABLES `map_student_job` WRITE;
/*!40000 ALTER TABLE `map_student_job` DISABLE KEYS */;
INSERT INTO `map_student_job` VALUES (40,1,1,'2020-03-10','Pending','/Users/sandy/CMPE273/HandshakeFiles/Resumes/1_1.pdf'),(41,21,4,'2020-03-11','Pending','undefined');
/*!40000 ALTER TABLE `map_student_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_educational_details`
--

DROP TABLE IF EXISTS `student_educational_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_educational_details` (
  `student_education_id` int NOT NULL AUTO_INCREMENT,
  `fk_student_id` int NOT NULL,
  `college` varchar(255) DEFAULT NULL,
  `course` varchar(255) DEFAULT NULL,
  `grad_date` date DEFAULT NULL,
  `gpa` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`student_education_id`),
  KEY `fk_student_id` (`fk_student_id`),
  CONSTRAINT `student_educational_details_ibfk_1` FOREIGN KEY (`fk_student_id`) REFERENCES `Students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_educational_details`
--

LOCK TABLES `student_educational_details` WRITE;
/*!40000 ALTER TABLE `student_educational_details` DISABLE KEYS */;
INSERT INTO `student_educational_details` VALUES (1,1,'San Jose State University','Masters in Software Engineering.','2020-02-22','4.0'),(6,1,'NIT Patna','B.tech CSE','2018-05-14',NULL),(10,21,'Hogwarts','Software Engineering','2021-01-01','4.0');
/*!40000 ALTER TABLE `student_educational_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_experience_details`
--

DROP TABLE IF EXISTS `student_experience_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_experience_details` (
  `student_exp_id` int NOT NULL AUTO_INCREMENT,
  `fk_student_id` int NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `postion` varchar(255) DEFAULT NULL,
  `work_desc` varchar(255) DEFAULT NULL,
  `work_location` varchar(255) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  PRIMARY KEY (`student_exp_id`),
  KEY `fk_student_id` (`fk_student_id`),
  CONSTRAINT `student_experience_details_ibfk_1` FOREIGN KEY (`fk_student_id`) REFERENCES `Students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_experience_details`
--

LOCK TABLES `student_experience_details` WRITE;
/*!40000 ALTER TABLE `student_experience_details` DISABLE KEYS */;
INSERT INTO `student_experience_details` VALUES (1,1,'Highradius Technologies Pvt Ltd. ','Associate Software Developer ','I am an engineer, Developed highradius framework','Hyderabad','2018-01-08','2020-02-22'),(13,21,'Greffendor','Magic boy','Assisting Harry potter','Scotland','2011-01-01','2020-01-01');
/*!40000 ALTER TABLE `student_experience_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `fk_user_id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_no` bigint DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `college_name` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `objective` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `profile_path` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `lu_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Sandeep','Bhimireddy',1,'sandeepreddy.bhimireddy@sjsu.edu',6692259364,'Python, MongoDB, React, Node JS','Stanford','1998-03-25','Data Analytics','I want to work at Tesla or FB or Amazon or Google','Hyderabad','1.jpg'),(21,'Ronald','Weasley',43,'ron.weasley@harrypotter.com',1234567890,NULL,'Stanford',NULL,'Software Engineering','I want to get a job','Scotland',NULL),(22,'Draco','Malfoy',44,'draco.malfoy@harrypotter.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tab`
--

DROP TABLE IF EXISTS `tab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab` (
  `tab_id` int NOT NULL AUTO_INCREMENT,
  `tab_name` varchar(255) DEFAULT NULL,
  `tab_display_name` varchar(255) DEFAULT NULL,
  `tab_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tab_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab`
--

LOCK TABLES `tab` WRITE;
/*!40000 ALTER TABLE `tab` DISABLE KEYS */;
/*!40000 ALTER TABLE `tab` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-12  4:21:00
