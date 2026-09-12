-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.40 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for railway
CREATE DATABASE IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;

-- Dumping structure for table railway.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adderss` varchar(100) NOT NULL,
  `create_at` datetime DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `nic` varchar(12) NOT NULL,
  `password` varchar(45) NOT NULL,
  `pone_number` varchar(10) NOT NULL,
  `type` varchar(255) NOT NULL,
  `verification_code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.admin: ~5 rows (approximately)
INSERT INTO `admin` (`id`, `adderss`, `create_at`, `email`, `first_name`, `last_login`, `last_name`, `nic`, `password`, `pone_number`, `type`, `verification_code`) VALUES
	(1, 'Colombo', '2026-09-07 21:23:32', 'admin@admin.com', 'Super', '2026-09-07 22:06:12', 'Admin', '123456789V', 'Admin@123', '0710000001', 'SuperAdmin', '21383'),
	(2, 'Kandy', '2026-09-07 21:23:32', 'manager@admin.com', 'System', '2026-09-07 21:23:32', 'Manager', '234567890V', 'Admin@123', '0710000002', 'Manager', '1002'),
	(3, 'Galle', '2026-09-07 21:23:32', 'staff1@admin.com', 'Station', '2026-09-07 21:23:32', 'Master', '345678901V', 'Admin@123', '0710000003', 'Staff', '1003'),
	(4, 'Matara', '2026-09-07 21:23:32', 'staff2@admin.com', 'Ticket', '2026-09-07 21:23:32', 'Checker', '456789012V', 'Admin@123', '0710000004', 'Staff', '1004'),
	(5, 'Colombo', '2026-09-07 21:23:32', 'support@admin.com', 'IT', '2026-09-07 21:23:32', 'Support', '567890123V', 'Admin@123', '0710000005', 'Support', '1005');

-- Dumping structure for table railway.class
CREATE TABLE IF NOT EXISTS `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classes` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.class: ~5 rows (approximately)
INSERT INTO `class` (`id`, `classes`) VALUES
	(1, 'First Class'),
	(2, 'Second Class'),
	(3, 'Third Class'),
	(4, 'Observation Saloon'),
	(5, 'Sleeperette');

-- Dumping structure for table railway.coaches
CREATE TABLE IF NOT EXISTS `coaches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `box_name` varchar(45) NOT NULL,
  `total_seats` varchar(45) NOT NULL,
  `class_id` int NOT NULL,
  `train_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_o1rne6fyro0yi1gd6fc9eky3s` (`class_id`),
  KEY `FK_aj72y82n8h8sidm9r2txafvq8` (`train_id`),
  CONSTRAINT `FK_aj72y82n8h8sidm9r2txafvq8` FOREIGN KEY (`train_id`) REFERENCES `train` (`tarin_id`),
  CONSTRAINT `FK_o1rne6fyro0yi1gd6fc9eky3s` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.coaches: ~5 rows (approximately)
INSERT INTO `coaches` (`id`, `box_name`, `total_seats`, `class_id`, `train_id`) VALUES
	(1, 'A', '44', 1, 1),
	(2, 'B', '60', 2, 1),
	(3, 'C', '80', 3, 1),
	(4, 'D', '30', 4, 1),
	(5, 'A', '44', 1, 2);

-- Dumping structure for table railway.days_of_travel
CREATE TABLE IF NOT EXISTS `days_of_travel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.days_of_travel: ~5 rows (approximately)
INSERT INTO `days_of_travel` (`id`, `name`) VALUES
	(1, 'Daily'),
	(2, 'Weekdays'),
	(3, 'Weekends'),
	(4, 'Public Holidays'),
	(5, 'Special Days');

-- Dumping structure for table railway.route_price
CREATE TABLE IF NOT EXISTS `route_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_class_price` double NOT NULL,
  `second_class_price` double NOT NULL,
  `admin_id` int NOT NULL,
  `from` int NOT NULL,
  `to` int NOT NULL,
  `train_routes_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_dmw0j2wiirqrod4clvqc7txip` (`admin_id`),
  KEY `FK_lkl18kte9d3e01eevtm7vmerx` (`from`),
  KEY `FK_g7ks3c1u67lwkm02qib9pe95q` (`to`),
  KEY `FK_7y6cygtb9uo4dm9lci3ynrrha` (`train_routes_id`),
  CONSTRAINT `FK_7y6cygtb9uo4dm9lci3ynrrha` FOREIGN KEY (`train_routes_id`) REFERENCES `train_routes` (`id`),
  CONSTRAINT `FK_dmw0j2wiirqrod4clvqc7txip` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `FK_g7ks3c1u67lwkm02qib9pe95q` FOREIGN KEY (`to`) REFERENCES `station` (`id`),
  CONSTRAINT `FK_lkl18kte9d3e01eevtm7vmerx` FOREIGN KEY (`from`) REFERENCES `station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.route_price: ~5 rows (approximately)
INSERT INTO `route_price` (`id`, `first_class_price`, `second_class_price`, `admin_id`, `from`, `to`, `train_routes_id`) VALUES
	(1, 1500, 800, 1, 1, 3, 1),
	(2, 1200, 600, 2, 1, 5, 2),
	(3, 2500, 1200, 1, 1, 7, 3),
	(4, 1800, 900, 3, 1, 3, 4),
	(5, 500, 200, 4, 4, 5, 5);

-- Dumping structure for table railway.smart_bookings
CREATE TABLE IF NOT EXISTS `smart_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_date` datetime NOT NULL,
  `passengers` int NOT NULL,
  `passengers_details` longtext NOT NULL,
  `qr_code` varchar(45) DEFAULT NULL,
  `total_price` double NOT NULL,
  `travel_date` datetime NOT NULL,
  `class_id` int NOT NULL,
  `route_price_id` int NOT NULL,
  `train_routes_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8388xc2y3lr8a26cdg3u1fj5m` (`class_id`),
  KEY `FK_d2ko9lnpvra2usj1my3bt5pab` (`route_price_id`),
  KEY `FK_jo2jnwlo9mt9asxc6gveiq1ms` (`train_routes_id`),
  KEY `FK_2b9l4uojojxma4wsib7d6ofj9` (`user_id`),
  CONSTRAINT `FK_2b9l4uojojxma4wsib7d6ofj9` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_8388xc2y3lr8a26cdg3u1fj5m` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`),
  CONSTRAINT `FK_d2ko9lnpvra2usj1my3bt5pab` FOREIGN KEY (`route_price_id`) REFERENCES `route_price` (`id`),
  CONSTRAINT `FK_jo2jnwlo9mt9asxc6gveiq1ms` FOREIGN KEY (`train_routes_id`) REFERENCES `train_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.smart_bookings: ~5 rows (approximately)
INSERT INTO `smart_bookings` (`id`, `booking_date`, `passengers`, `passengers_details`, `qr_code`, `total_price`, `travel_date`, `class_id`, `route_price_id`, `train_routes_id`, `user_id`) VALUES
	(1, '2026-09-07 21:23:32', 2, 'Adults: 2', 'QR1001', 3000, '2025-01-15 05:30:00', 1, 1, 1, 1),
	(2, '2026-09-07 21:23:32', 1, 'Adults: 1', 'QR1002', 800, '2025-01-16 05:30:00', 2, 1, 1, 2),
	(3, '2026-09-07 21:23:32', 3, 'Adults: 2, Child: 1', 'QR1003', 3600, '2025-01-20 14:00:00', 1, 2, 2, 3),
	(4, '2026-09-07 21:23:32', 1, 'Adults: 1', 'QR1004', 1200, '2025-01-25 06:00:00', 2, 3, 3, 4),
	(5, '2026-09-07 21:23:32', 2, 'Adults: 2', 'QR1005', 3600, '2025-02-01 20:00:00', 1, 4, 4, 5);

-- Dumping structure for table railway.speed
CREATE TABLE IF NOT EXISTS `speed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.speed: ~5 rows (approximately)
INSERT INTO `speed` (`id`, `name`) VALUES
	(1, 'Express'),
	(2, 'Intercity'),
	(3, 'Slow'),
	(4, 'Night Mail'),
	(5, 'Mixed');

-- Dumping structure for table railway.station
CREATE TABLE IF NOT EXISTS `station` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.station: ~7 rows (approximately)
INSERT INTO `station` (`id`, `name`) VALUES
	(1, 'Colombo Fort'),
	(2, 'Maradana'),
	(3, 'Kandy'),
	(4, 'Galle'),
	(5, 'Matara'),
	(6, 'Anuradhapura'),
	(7, 'Jaffna');

-- Dumping structure for table railway.station_payment
CREATE TABLE IF NOT EXISTS `station_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `pasenger` int NOT NULL,
  `payment_date` datetime NOT NULL,
  `qr_code` varchar(45) DEFAULT NULL,
  `total` double NOT NULL,
  `train_station_price` int NOT NULL,
  `train_stations` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8k8l6ln82xvogd1xs0qicrrma` (`train_station_price`),
  KEY `FK_kp2m7tpnixxx0s1pfa67gw0te` (`train_stations`),
  KEY `FK_goljn3nyggha3uqnj40xxbuwi` (`user_id`),
  CONSTRAINT `FK_8k8l6ln82xvogd1xs0qicrrma` FOREIGN KEY (`train_station_price`) REFERENCES `train_station_price` (`id`),
  CONSTRAINT `FK_goljn3nyggha3uqnj40xxbuwi` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_kp2m7tpnixxx0s1pfa67gw0te` FOREIGN KEY (`train_stations`) REFERENCES `train_stations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.station_payment: ~5 rows (approximately)
INSERT INTO `station_payment` (`id`, `date`, `pasenger`, `payment_date`, `qr_code`, `total`, `train_station_price`, `train_stations`, `user_id`) VALUES
	(1, '2026-09-07 21:23:32', 1, '2026-09-07 21:23:32', 'QRPAY001', 50, 1, 1, 1),
	(2, '2026-09-07 21:23:32', 2, '2026-09-07 21:23:32', 'QRPAY002', 1600, 2, 1, 2),
	(3, '2026-09-07 21:23:32', 1, '2026-09-07 21:23:32', 'QRPAY003', 750, 3, 2, 3),
	(4, '2026-09-07 21:23:32', 3, '2026-09-07 21:23:32', 'QRPAY004', 3600, 4, 4, 4),
	(5, '2026-09-07 21:23:32', 1, '2026-09-07 21:23:32', 'QRPAY005', 300, 5, 1, 5);

-- Dumping structure for table railway.status
CREATE TABLE IF NOT EXISTS `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.status: ~5 rows (approximately)
INSERT INTO `status` (`id`, `name`) VALUES
	(1, 'Active'),
	(2, 'Inactive'),
	(3, 'Maintenance'),
	(4, 'Delayed'),
	(5, 'Cancelled');

-- Dumping structure for table railway.train
CREATE TABLE IF NOT EXISTS `train` (
  `tarin_id` int NOT NULL AUTO_INCREMENT,
  `total_coaches` varchar(45) NOT NULL,
  `train_name` varchar(200) NOT NULL,
  `train_number` varchar(45) NOT NULL,
  `admin_id` int NOT NULL,
  `days_of_travel_id` int NOT NULL,
  `speed_id` int NOT NULL,
  `status_id` int NOT NULL,
  `type_id` int NOT NULL,
  PRIMARY KEY (`tarin_id`),
  KEY `FK_jvx3jc05qyj2yn7ud11t8ejtw` (`admin_id`),
  KEY `FK_l6x4sdytb824ge8q5drjsy9uk` (`days_of_travel_id`),
  KEY `FK_tftljfgis2bmrarl2ppe4o3io` (`speed_id`),
  KEY `FK_gi2psf1dtsd7gciqojb9y311n` (`status_id`),
  KEY `FK_6l1eic185feehetnfvuaphush` (`type_id`),
  CONSTRAINT `FK_6l1eic185feehetnfvuaphush` FOREIGN KEY (`type_id`) REFERENCES `train_type` (`id`),
  CONSTRAINT `FK_gi2psf1dtsd7gciqojb9y311n` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `FK_jvx3jc05qyj2yn7ud11t8ejtw` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `FK_l6x4sdytb824ge8q5drjsy9uk` FOREIGN KEY (`days_of_travel_id`) REFERENCES `days_of_travel` (`id`),
  CONSTRAINT `FK_tftljfgis2bmrarl2ppe4o3io` FOREIGN KEY (`speed_id`) REFERENCES `speed` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.train: ~5 rows (approximately)
INSERT INTO `train` (`tarin_id`, `total_coaches`, `train_name`, `train_number`, `admin_id`, `days_of_travel_id`, `speed_id`, `status_id`, `type_id`) VALUES
	(1, '10', 'Udarata Menike', '1001', 1, 1, 1, 1, 1),
	(2, '8', 'Ruhunu Kumari', '1002', 2, 1, 1, 1, 1),
	(3, '12', 'Yal Devi', '1003', 1, 1, 2, 1, 5),
	(4, '14', 'Night Mail', '1004', 3, 1, 4, 1, 1),
	(5, '6', 'Slow Train Colombo', '1005', 4, 2, 3, 1, 1);

-- Dumping structure for table railway.train_routes
CREATE TABLE IF NOT EXISTS `train_routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arrival_time` datetime NOT NULL,
  `departure_time` datetime NOT NULL,
  `titile` varchar(45) NOT NULL,
  `admin_id` int NOT NULL,
  `destination_id` int NOT NULL,
  `source_id` int NOT NULL,
  `train_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_255g6o5wjekhcuq17ms4tdlke` (`admin_id`),
  KEY `FK_68ja5rwr9ir9818mv722c4ob9` (`destination_id`),
  KEY `FK_oq89lmpqcn6wnda3l3wavk2cn` (`source_id`),
  KEY `FK_jbtcw9bwirjkcryv2nm9uo873` (`train_id`),
  CONSTRAINT `FK_255g6o5wjekhcuq17ms4tdlke` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `FK_68ja5rwr9ir9818mv722c4ob9` FOREIGN KEY (`destination_id`) REFERENCES `station` (`id`),
  CONSTRAINT `FK_jbtcw9bwirjkcryv2nm9uo873` FOREIGN KEY (`train_id`) REFERENCES `train` (`tarin_id`),
  CONSTRAINT `FK_oq89lmpqcn6wnda3l3wavk2cn` FOREIGN KEY (`source_id`) REFERENCES `station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.train_routes: ~5 rows (approximately)
INSERT INTO `train_routes` (`id`, `arrival_time`, `departure_time`, `titile`, `admin_id`, `destination_id`, `source_id`, `train_id`) VALUES
	(1, '2025-01-01 08:30:00', '2025-01-01 05:30:00', 'Colombo to Kandy', 1, 3, 1, 1),
	(2, '2025-01-01 18:00:00', '2025-01-01 14:00:00', 'Colombo to Matara', 2, 5, 1, 2),
	(3, '2025-01-01 14:30:00', '2025-01-01 06:00:00', 'Colombo to Jaffna', 1, 7, 1, 3),
	(4, '2025-01-02 05:00:00', '2025-01-01 20:00:00', 'Colombo to Badulla Night Mail', 3, 3, 1, 4),
	(5, '2025-01-01 09:00:00', '2025-01-01 07:00:00', 'Galle to Matara', 4, 5, 4, 5);

-- Dumping structure for table railway.train_stations
CREATE TABLE IF NOT EXISTS `train_stations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arrival_time` time NOT NULL,
  `departure_time` time NOT NULL,
  `stop_platform` int DEFAULT NULL,
  `station_id` int NOT NULL,
  `train_routes_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2mfiek4mu2gra5127m7gn0y45` (`station_id`),
  KEY `FK_dumksqx7hcrneovomg90cnlrr` (`train_routes_id`),
  CONSTRAINT `FK_2mfiek4mu2gra5127m7gn0y45` FOREIGN KEY (`station_id`) REFERENCES `station` (`id`),
  CONSTRAINT `FK_dumksqx7hcrneovomg90cnlrr` FOREIGN KEY (`train_routes_id`) REFERENCES `train_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.train_stations: ~5 rows (approximately)
INSERT INTO `train_stations` (`id`, `arrival_time`, `departure_time`, `stop_platform`, `station_id`, `train_routes_id`) VALUES
	(1, '05:30:00', '05:45:00', 1, 1, 1),
	(2, '06:00:00', '06:10:00', 2, 2, 1),
	(3, '08:30:00', '08:30:00', 3, 3, 1),
	(4, '14:00:00', '14:15:00', 4, 1, 2),
	(5, '18:00:00', '18:00:00', 1, 5, 2);

-- Dumping structure for table railway.train_station_price
CREATE TABLE IF NOT EXISTS `train_station_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `distance` double DEFAULT NULL,
  `price` double NOT NULL,
  `station_from` int NOT NULL,
  `station_to` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b16smwhg2tse0hkif1ry2pspo` (`station_from`),
  KEY `FK_o9m1vg2akxleywl0u1kesx8wy` (`station_to`),
  CONSTRAINT `FK_b16smwhg2tse0hkif1ry2pspo` FOREIGN KEY (`station_from`) REFERENCES `train_stations` (`id`),
  CONSTRAINT `FK_o9m1vg2akxleywl0u1kesx8wy` FOREIGN KEY (`station_to`) REFERENCES `station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.train_station_price: ~5 rows (approximately)
INSERT INTO `train_station_price` (`id`, `distance`, `price`, `station_from`, `station_to`) VALUES
	(1, 15.5, 50, 1, 2),
	(2, 115.5, 800, 1, 3),
	(3, 100, 750, 2, 3),
	(4, 150, 1200, 4, 5),
	(5, 40, 300, 1, 4);

-- Dumping structure for table railway.train_type
CREATE TABLE IF NOT EXISTS `train_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.train_type: ~5 rows (approximately)
INSERT INTO `train_type` (`id`, `name`) VALUES
	(1, 'Passenger'),
	(2, 'Cargo'),
	(3, 'Mixed'),
	(4, 'Special Holiday'),
	(5, 'Express Passenger');

-- Dumping structure for table railway.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `date_of_birth` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `email_verifyed` varchar(20) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `nic` varchar(12) NOT NULL,
  `password` varchar(12) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `role` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table railway.user: ~5 rows (approximately)
INSERT INTO `user` (`id`, `create_at`, `date_of_birth`, `email`, `email_verifyed`, `full_name`, `gender`, `nic`, `password`, `phone`, `role`) VALUES
	(1, '2026-09-07 21:23:32', '1998-01-01', 'chamod.bcu.student@gmail.com', 'Verifyed', 'Chamod', 'Male', '981234567V', 'User@123', '0770000000', 'User'),
	(2, '2026-09-07 21:23:32', '1992-05-15', 'user2@test.com', 'Verifyed', 'Nimali Silva', 'Female', '921234567V', 'User@123', '0772222222', 'User'),
	(3, '2026-09-07 21:23:32', '1985-10-20', 'user3@test.com', 'Verifyed', 'Sunil Fernando', 'Male', '851234567V', 'User@123', '0773333333', 'User'),
	(4, '2026-09-07 21:23:32', '1998-12-05', 'user4@test.com', 'Verifyed', 'Amala Gunaratne', 'Female', '981234567V', 'User@123', '0774444444', 'User'),
	(5, '2026-09-07 21:23:32', '2000-08-30', 'user5@test.com', 'Verifyed', 'Ruwan Kumara', 'Male', '200012345V', 'User@123', '0775555555', 'User');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
