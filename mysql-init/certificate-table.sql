-- Create certificates table
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `student_name` varchar(200) NOT NULL,
  `pathway` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `certificate_type` varchar(50) DEFAULT NULL,
  `uploaded_at` datetime NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `idx_certificates_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;