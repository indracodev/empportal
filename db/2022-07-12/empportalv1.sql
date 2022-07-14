-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2022 at 04:55 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `empportalv1`
--

-- --------------------------------------------------------

--
-- Table structure for table `blastcontent`
--

CREATE TABLE `blastcontent` (
  `blastcontent_id` int(11) NOT NULL,
  `blastcontent_code` text NOT NULL,
  `blastcontent_title` text NOT NULL,
  `blastcontent_subject` text NOT NULL,
  `blastcontent_content` longtext NOT NULL,
  `blastcontent_type` text NOT NULL,
  `blastcontent_attachment` text DEFAULT NULL,
  `blastcontent_targettime` datetime NOT NULL,
  `blastcontent_webtarget` text NOT NULL,
  `blastcontent_note` longtext DEFAULT NULL,
  `blastcontent_status` text NOT NULL,
  `blastcontent_writentime` datetime NOT NULL,
  `blastcontent_url` text NOT NULL,
  `emp_code` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastcontent`
--

INSERT INTO `blastcontent` (`blastcontent_id`, `blastcontent_code`, `blastcontent_title`, `blastcontent_subject`, `blastcontent_content`, `blastcontent_type`, `blastcontent_attachment`, `blastcontent_targettime`, `blastcontent_webtarget`, `blastcontent_note`, `blastcontent_status`, `blastcontent_writentime`, `blastcontent_url`, `emp_code`) VALUES
(1, 'NWS-448LTR4832', 'Memang Lidah', 'Memang Lidah Tak Bertulang', '<p>Tak terbatas kata-kata</p>', 'Text', 'portalasset/newsletter/attachment/840932171046448fafc50d339c030193983fd4c4b0d9a9f9d56c83b25a183b08.pdf', '2022-05-20 16:30:00', 'https://www.supresso.com/sg/newsletter/?ltr=', 'Tinggi gunung seribu janji', 'Ready', '2022-05-19 16:32:47', 'https://www.supresso.com/sg/newsletter/?ltr=memang-lidah-tak-bertulang', 'EMP-000ALP0000'),
(2, 'NWS-573LTR2687', 'Coba tanya hatimu', 'Coba tanya hatimu sekali lagi', '<p>Sebelum engkau benar benar pergi</p>', 'Text', 'portalasset/newsletter/attachment/efead60450fa0b59c1ff5b3796e4ffef6ccee0ac984d851f2e8742d4405f1e10.png', '2022-05-27 17:25:00', 'supresso.com', 'Masikah ada aku didalamnya', 'Draft', '2022-05-27 17:20:29', 'supresso.comcoba-tanya-hatimu-sekali-lagi', 'EMP-000ALP0000');

-- --------------------------------------------------------

--
-- Table structure for table `blastemaillist`
--

CREATE TABLE `blastemaillist` (
  `blastemaillist_id` int(11) NOT NULL,
  `blastemaillist_code` text NOT NULL,
  `blastemaillist_email` text NOT NULL,
  `blastemaillist_name` text DEFAULT NULL,
  `blastemaillist_role` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastemaillist`
--

INSERT INTO `blastemaillist` (`blastemaillist_id`, `blastemaillist_code`, `blastemaillist_email`, `blastemaillist_name`, `blastemaillist_role`) VALUES
(1, 'EML-499MNL1423152', 'aldy.indraco@gmail.com', 'Aldy (Gmail)', 'Admin'),
(2, 'EML-185MNL5341825', 'aldy.indraco@outlook.co.id', 'Aldy (Outlook)', 'Internal');

-- --------------------------------------------------------

--
-- Table structure for table `blastemaillist_source`
--

CREATE TABLE `blastemaillist_source` (
  `blastemaillist_source_id` int(11) NOT NULL,
  `blastemaillist_code` text NOT NULL,
  `blastsource_code` text NOT NULL,
  `blastemaillist_source_subscribe` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastemaillist_source`
--

INSERT INTO `blastemaillist_source` (`blastemaillist_source_id`, `blastemaillist_code`, `blastsource_code`, `blastemaillist_source_subscribe`) VALUES
(1, 'EML-499MNL1423152', 'SRC-634CYW5903', 'Subscribe'),
(2, 'EML-499MNL1423152', 'SRC-376CYW6947', 'Subscribe'),
(3, 'EML-185MNL5341825', 'SRC-376CYW6947', 'Subscribe');

-- --------------------------------------------------------

--
-- Table structure for table `blastmedia`
--

CREATE TABLE `blastmedia` (
  `blastmedia_id` int(11) NOT NULL,
  `blastmedia_code` text NOT NULL,
  `blastmedia_title` text NOT NULL,
  `blastmedia_url` text NOT NULL,
  `blastmedia_desc` longtext DEFAULT NULL,
  `blastmedia_status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastmedia`
--

INSERT INTO `blastmedia` (`blastmedia_id`, `blastmedia_code`, `blastmedia_title`, `blastmedia_url`, `blastmedia_desc`, `blastmedia_status`) VALUES
(1, 'MDA-1978202205248723', 'TestImg1', 'portalasset/newsletter/media/4c4af6ddb1e1396338278793d41e3345ec80dc15790d73728899178033cc131a.jpg', 'Ini adalah test img 1', 'Unused'),
(3, 'MDA-8212202205271070', 'Test Media 2s', 'portalasset/newsletter/media/dc0bac163e459d3bdca2567a2f099e3e146e1bf20abec06e2ae61155e1b18d9e.jpg', 'Iki media ke-2', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `blastrelay`
--

CREATE TABLE `blastrelay` (
  `blastrelay_id` int(11) NOT NULL,
  `blastrelay_code` text NOT NULL,
  `blastrelay_name` text NOT NULL,
  `blastsource_code` text NOT NULL,
  `blastrelay_apiurl` text NOT NULL,
  `blastrelay_host` text NOT NULL,
  `blastrelay_username` text NOT NULL,
  `blastrelay_password` text NOT NULL,
  `blastrelay_smtpsecure` text NOT NULL,
  `blastrelay_port` text NOT NULL,
  `blastrelay_charset` text NOT NULL,
  `blastrelay_fromemail` text NOT NULL,
  `blastrelay_fromname` text NOT NULL,
  `blastrelay_status` text NOT NULL,
  `blastrelay_timecreated` datetime DEFAULT NULL,
  `blastrelay_timemodify` datetime DEFAULT NULL,
  `blastrelay_timedelete` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastrelay`
--

INSERT INTO `blastrelay` (`blastrelay_id`, `blastrelay_code`, `blastrelay_name`, `blastsource_code`, `blastrelay_apiurl`, `blastrelay_host`, `blastrelay_username`, `blastrelay_password`, `blastrelay_smtpsecure`, `blastrelay_port`, `blastrelay_charset`, `blastrelay_fromemail`, `blastrelay_fromname`, `blastrelay_status`, `blastrelay_timecreated`, `blastrelay_timemodify`, `blastrelay_timedelete`) VALUES
(1, 'RLY-114SB9527', 'SG 1', 'SRC-634CYW5903', 'https://www.supresso.com/sg/mailrelay/rl1.php', 'mail.supresso.com', 'no--reply@supresso.com', 'q$N%Rx]_-bE0', 'ssl', '465', 'UTF-8', 'no--reply@supresso.com', 'Supresso Coffee - Pakuwon Square', 'Active', NULL, NULL, NULL),
(2, 'RLY-274SB4846', 'SG 2', 'SRC-634CYW5903', 'https://www.supresso.com/sg/mailsender/rl2.php', 'mail.supresso.com', 'no.reply@supresso.com', 'p!8n0UCzT2aY', 'ssl', '465', 'UTF-8', 'no-reply@supresso.com', 'Supresso Coffee', 'Inactive', NULL, '2022-06-28 14:42:50', NULL),
(3, 'RLY-256SB3033', 'SG 3', 'SRC-634CYW5903', 'https://www.supresso.com/sg/mailblast/rl3.php', 'mail.supresso.com', 'noreply@supresso.com', 'z=VCWu*DM=WA', 'ssl', '465', 'UTF-8', 'no-reply@supresso.com', 'Supresso Coffee', 'Active', NULL, NULL, NULL),
(4, 'RLY-299SB6546', 'ID 1', 'SRC-376CYW6947', 'https://www.supresso.com/id/mailblast/rl1.php', 'mail.supresso.com', 'no--reply@supresso.com', 'q$N%Rx]_-bE0', 'ssl', '465', 'UTF-8', 'no--reply@supresso.com', 'Supresso Coffee - Pakuwon Square', 'Active', NULL, NULL, NULL),
(5, 'RLY-864SB7155', 'ID 2', 'SRC-376CYW6947', 'https://www.supresso.com/id/mailblast/relay.php', 'mail.supresso.com', 'no.-reply@supresso.com', '-]*d??m_z!Wl', 'ssl', '465', 'UTF-8', 'no--reply@supresso.com', 'Supresso Coffee - Pakuwon Square', 'Inactive', NULL, '2022-06-28 14:42:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blastsource`
--

CREATE TABLE `blastsource` (
  `blastsource_id` int(11) NOT NULL,
  `blastsource_code` text NOT NULL,
  `blastsource_name` text NOT NULL,
  `blastsource_url` text NOT NULL,
  `blastsource_status` text NOT NULL,
  `blastsource_datecreate` datetime DEFAULT NULL,
  `blastsource_datemodify` datetime DEFAULT NULL,
  `blastsource_datedelete` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blastsource`
--

INSERT INTO `blastsource` (`blastsource_id`, `blastsource_code`, `blastsource_name`, `blastsource_url`, `blastsource_status`, `blastsource_datecreate`, `blastsource_datemodify`, `blastsource_datedelete`) VALUES
(1, 'SRC-634CYW5903', 'Supresso SG', 'https://www.supresso.com/sg', 'Active', NULL, NULL, NULL),
(2, 'SRC-376CYW6947', 'Supresso ID', 'https://www.supresso.com/id', 'Active', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `emp`
--

CREATE TABLE `emp` (
  `emp_id` int(11) NOT NULL,
  `emp_code` text NOT NULL,
  `emp_uname` text NOT NULL,
  `emp_pwd` text NOT NULL,
  `role_code` text NOT NULL,
  `empdetail_code` text NOT NULL,
  `emp_status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `emp`
--

INSERT INTO `emp` (`emp_id`, `emp_code`, `emp_uname`, `emp_pwd`, `role_code`, `empdetail_code`, `emp_status`) VALUES
(1, 'EMP-000ALP0000', 'aldycydro', '4e730a12a5576b1a7529a3e87a4872b9bd8d3f64acb6f869ad2d85bf0ec730d3', 'DEV-000ROOT0010', '', 'EMD-000ALP0000');

-- --------------------------------------------------------

--
-- Table structure for table `empdetail`
--

CREATE TABLE `empdetail` (
  `empdetail_id` int(11) NOT NULL,
  `empdetail_code` text NOT NULL,
  `emp_code` text NOT NULL,
  `empdetail_nickname` text NOT NULL,
  `empdetail_fullname` text NOT NULL,
  `empdetail_firstname` text NOT NULL,
  `empdetail_midname` text NOT NULL,
  `empdetail_lastname` text NOT NULL,
  `empdetail_email` text NOT NULL,
  `empdetail_phone` text NOT NULL,
  `empdetail_office` text NOT NULL,
  `empdetail_pp` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `empdetail`
--

INSERT INTO `empdetail` (`empdetail_id`, `empdetail_code`, `emp_code`, `empdetail_nickname`, `empdetail_fullname`, `empdetail_firstname`, `empdetail_midname`, `empdetail_lastname`, `empdetail_email`, `empdetail_phone`, `empdetail_office`, `empdetail_pp`) VALUES
(1, 'EMD-000ALP0000', 'EMP-000ALP0000', 'cydro', 'Aldy Cydro', 'Aldy', 'Cydro', 'Ramadhan', 'aldy.indraco@gmail.com', '082231343808', 'HQ', 'asset/pp/cydro.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `hash`
--

CREATE TABLE `hash` (
  `hash_id` int(11) NOT NULL,
  `hash_code` text NOT NULL,
  `emp_code` text DEFAULT NULL,
  `hash_client` longtext NOT NULL,
  `hash_made` datetime NOT NULL,
  `hash_lastactive` datetime NOT NULL,
  `hash_status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hash`
--

INSERT INTO `hash` (`hash_id`, `hash_code`, `emp_code`, `hash_client`, `hash_made`, `hash_lastactive`, `hash_status`) VALUES
(78, 'b0cf618fec5e17b5eeabc688b810f9103dce8bf700cea0c3cfde0a803e27b3ab', 'EMP-000ALP0000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49', '2022-07-12 09:26:44', '2022-07-12 09:26:44', 'Logged In'),
(79, '1b872e82c711302401292981244450be935a0e0b52d13bc8be1a33a840b10a3b', 'EMP-000ALP0000', 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1 Edg/103.0.5060.114', '2022-07-12 09:31:29', '2022-07-12 09:41:14', 'Logged Out'),
(80, '065408890eee9896d2afcddb3f968f10abaa94b73d27e681929722453c2e8f83', 'EMP-000ALP0000', 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1 Edg/103.0.5060.114', '2022-07-12 09:41:19', '2022-07-12 09:41:37', 'Logged In'),
(81, '700b71d52a7f86d37f96b1abffc7c44d85c650011316395854469ec6680b8cb4', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49', '2022-07-12 09:50:46', '2022-07-12 09:50:46', 'Guest'),
(82, 'cc0f6a6189fa6e83036c131bbcc725b33a5c1c9a9471f069b5e5ef276d744552', 'EMP-000ALP0000', 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1 Edg/103.0.5060.114', '2022-07-12 09:50:55', '2022-07-12 09:54:46', 'Logged In');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `role_code` text NOT NULL,
  `role_name` text NOT NULL,
  `role_modulelist` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role_code`, `role_name`, `role_modulelist`) VALUES
(1, 'DEV-000ROOT0010', 'Root', 'Dashboard');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blastcontent`
--
ALTER TABLE `blastcontent`
  ADD PRIMARY KEY (`blastcontent_id`);

--
-- Indexes for table `blastemaillist`
--
ALTER TABLE `blastemaillist`
  ADD PRIMARY KEY (`blastemaillist_id`);

--
-- Indexes for table `blastemaillist_source`
--
ALTER TABLE `blastemaillist_source`
  ADD PRIMARY KEY (`blastemaillist_source_id`);

--
-- Indexes for table `blastmedia`
--
ALTER TABLE `blastmedia`
  ADD PRIMARY KEY (`blastmedia_id`);

--
-- Indexes for table `blastrelay`
--
ALTER TABLE `blastrelay`
  ADD PRIMARY KEY (`blastrelay_id`);

--
-- Indexes for table `blastsource`
--
ALTER TABLE `blastsource`
  ADD PRIMARY KEY (`blastsource_id`);

--
-- Indexes for table `emp`
--
ALTER TABLE `emp`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `empdetail`
--
ALTER TABLE `empdetail`
  ADD PRIMARY KEY (`empdetail_id`);

--
-- Indexes for table `hash`
--
ALTER TABLE `hash`
  ADD PRIMARY KEY (`hash_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blastcontent`
--
ALTER TABLE `blastcontent`
  MODIFY `blastcontent_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blastemaillist`
--
ALTER TABLE `blastemaillist`
  MODIFY `blastemaillist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blastemaillist_source`
--
ALTER TABLE `blastemaillist_source`
  MODIFY `blastemaillist_source_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `blastmedia`
--
ALTER TABLE `blastmedia`
  MODIFY `blastmedia_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `blastrelay`
--
ALTER TABLE `blastrelay`
  MODIFY `blastrelay_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `blastsource`
--
ALTER TABLE `blastsource`
  MODIFY `blastsource_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `emp`
--
ALTER TABLE `emp`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `empdetail`
--
ALTER TABLE `empdetail`
  MODIFY `empdetail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hash`
--
ALTER TABLE `hash`
  MODIFY `hash_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
