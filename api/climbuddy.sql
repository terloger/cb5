-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 11, 2014 at 11:14 AM
-- Server version: 5.5.37-0ubuntu0.14.04.1
-- PHP Version: 5.5.11-2+deb.sury.org~saucy+2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `climbuddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `iso` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=242 ;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `name`, `iso`) VALUES
(1, 'Afghanistan', 'AF'),
(2, 'Albania', 'AL'),
(3, 'Algeria', 'DZ'),
(4, 'American Samoa', 'AS'),
(5, 'Andorra', 'AD'),
(6, 'Angola', 'AO'),
(7, 'Anguilla', 'AI'),
(8, 'Antarctica', 'AQ'),
(9, 'Antigua and Barbuda', 'AG'),
(10, 'Argentina', 'AR'),
(11, 'Armenia', 'AM'),
(12, 'Aruba', 'AW'),
(13, 'Australia', 'AU'),
(14, 'Austria', 'AT'),
(15, 'Azerbaijan', 'AZ'),
(16, 'Bahamas', 'BS'),
(17, 'Bahrain', 'BH'),
(18, 'Bangladesh', 'BD'),
(19, 'Barbados', 'BB'),
(20, 'Belarus', 'BY'),
(21, 'Belgium', 'BE'),
(22, 'Belize', 'BZ'),
(23, 'Benin', 'BJ'),
(24, 'Bermuda', 'BM'),
(25, 'Bhutan', 'BT'),
(26, 'Bolivia', 'BO'),
(27, 'Bosnia and Herzegovina', 'BA'),
(28, 'Botswana', 'BW'),
(29, 'Bouvet Island', 'BV'),
(30, 'Brazil', 'BR'),
(31, 'British Indian Ocean Territory', 'IO'),
(32, 'Brunei Darussalam', 'BN'),
(33, 'Bulgaria', 'BG'),
(34, 'Burkina Faso', 'BF'),
(35, 'Burundi', 'BI'),
(36, 'Cambodia', 'KH'),
(37, 'Cameroon', 'CM'),
(38, 'Canada', 'CA'),
(39, 'Cape Verde', 'CV'),
(40, 'Cayman Islands', 'KY'),
(41, 'Central African Republic', 'CF'),
(42, 'Chad', 'TD'),
(43, 'Chile', 'CL'),
(44, 'China', 'CN'),
(45, 'Christmas Island', 'CX'),
(46, 'Cocos (Keeling) Islands', 'CC'),
(47, 'Colombia', 'CO'),
(48, 'Comoros', 'KM'),
(49, 'Congo', 'CG'),
(50, 'Congo, the Democratic Republic of the', 'CD'),
(51, 'Cook Islands', 'CK'),
(52, 'Costa Rica', 'CR'),
(53, 'Cote D''Ivoire', 'CI'),
(54, 'Croatia', 'HR'),
(55, 'Cuba', 'CU'),
(56, 'Cyprus', 'CY'),
(57, 'Czech Republic', 'CZ'),
(58, 'Denmark', 'DK'),
(59, 'Djibouti', 'DJ'),
(60, 'Dominica', 'DM'),
(61, 'Dominican Republic', 'DO'),
(62, 'Ecuador', 'EC'),
(63, 'Egypt', 'EG'),
(64, 'El Salvador', 'SV'),
(65, 'Equatorial Guinea', 'GQ'),
(66, 'Eritrea', 'ER'),
(67, 'Estonia', 'EE'),
(68, 'Ethiopia', 'ET'),
(69, 'Falkland Islands (Malvinas)', 'FK'),
(70, 'Faroe Islands', 'FO'),
(71, 'Fiji', 'FJ'),
(72, 'Finland', 'FI'),
(73, 'France', 'FR'),
(74, 'French Guiana', 'GF'),
(75, 'French Polynesia', 'PF'),
(76, 'French Southern Territories', 'TF'),
(77, 'Gabon', 'GA'),
(78, 'Gambia', 'GM'),
(79, 'Georgia', 'GE'),
(80, 'Germany', 'DE'),
(81, 'Ghana', 'GH'),
(82, 'Gibraltar', 'GI'),
(83, 'Greece', 'GR'),
(84, 'Greenland', 'GL'),
(85, 'Grenada', 'GD'),
(86, 'Guadeloupe', 'GP'),
(87, 'Guam', 'GU'),
(88, 'Guatemala', 'GT'),
(89, 'Guinea', 'GN'),
(90, 'Guinea-Bissau', 'GW'),
(91, 'Guyana', 'GY'),
(92, 'Haiti', 'HT'),
(93, 'Heard Island and Mcdonald Islands', 'HM'),
(94, 'Holy See (Vatican City State)', 'VA'),
(95, 'Honduras', 'HN'),
(96, 'Hong Kong', 'HK'),
(97, 'Hungary', 'HU'),
(98, 'Iceland', 'IS'),
(99, 'India', 'IN'),
(100, 'Indonesia', 'ID'),
(101, 'Iran, Islamic Republic of', 'IR'),
(102, 'Iraq', 'IQ'),
(103, 'Ireland', 'IE'),
(104, 'Israel', 'IL'),
(105, 'Italy', 'IT'),
(106, 'Jamaica', 'JM'),
(107, 'Japan', 'JP'),
(108, 'Jordan', 'JO'),
(109, 'Kazakhstan', 'KZ'),
(110, 'Kenya', 'KE'),
(111, 'Kiribati', 'KI'),
(112, 'Korea, Democratic People''s Republic of', 'KP'),
(113, 'Korea, Republic of', 'KR'),
(114, 'Kuwait', 'KW'),
(115, 'Kyrgyzstan', 'KG'),
(116, 'Lao People''s Democratic Republic', 'LA'),
(117, 'Latvia', 'LV'),
(118, 'Lebanon', 'LB'),
(119, 'Lesotho', 'LS'),
(120, 'Liberia', 'LR'),
(121, 'Libyan Arab Jamahiriya', 'LY'),
(122, 'Liechtenstein', 'LI'),
(123, 'Lithuania', 'LT'),
(124, 'Luxembourg', 'LU'),
(125, 'Macao', 'MO'),
(126, 'Macedonia, the Former Yugoslav Republic of', 'MK'),
(127, 'Madagascar', 'MG'),
(128, 'Malawi', 'MW'),
(129, 'Malaysia', 'MY'),
(130, 'Maldives', 'MV'),
(131, 'Mali', 'ML'),
(132, 'Malta', 'MT'),
(133, 'Marshall Islands', 'MH'),
(134, 'Martinique', 'MQ'),
(135, 'Mauritania', 'MR'),
(136, 'Mauritius', 'MU'),
(137, 'Mayotte', 'YT'),
(138, 'Mexico', 'MX'),
(139, 'Micronesia, Federated States of', 'FM'),
(140, 'Moldova, Republic of', 'MD'),
(141, 'Monaco', 'MC'),
(142, 'Mongolia', 'MN'),
(143, 'Montserrat', 'MS'),
(144, 'Morocco', 'MA'),
(145, 'Mozambique', 'MZ'),
(146, 'Myanmar', 'MM'),
(147, 'Namibia', 'NA'),
(148, 'Nauru', 'NR'),
(149, 'Nepal', 'NP'),
(150, 'Netherlands', 'NL'),
(151, 'Netherlands Antilles', 'AN'),
(152, 'New Caledonia', 'NC'),
(153, 'New Zealand', 'NZ'),
(154, 'Nicaragua', 'NI'),
(155, 'Niger', 'NE'),
(156, 'Nigeria', 'NG'),
(157, 'Niue', 'NU'),
(158, 'Norfolk Island', 'NF'),
(159, 'Northern Mariana Islands', 'MP'),
(160, 'Norway', 'NO'),
(161, 'Oman', 'OM'),
(162, 'Pakistan', 'PK'),
(163, 'Palau', 'PW'),
(164, 'Palestinian Territory, Occupied', 'PS'),
(165, 'Panama', 'PA'),
(166, 'Papua New Guinea', 'PG'),
(167, 'Paraguay', 'PY'),
(168, 'Peru', 'PE'),
(169, 'Philippines', 'PH'),
(170, 'Pitcairn', 'PN'),
(171, 'Poland', 'PL'),
(172, 'Portugal', 'PT'),
(173, 'Puerto Rico', 'PR'),
(174, 'Qatar', 'QA'),
(175, 'Reunion', 'RE'),
(176, 'Romania', 'RO'),
(177, 'Russian Federation', 'RU'),
(178, 'Rwanda', 'RW'),
(179, 'Saint Helena', 'SH'),
(180, 'Saint Kitts and Nevis', 'KN'),
(181, 'Saint Lucia', 'LC'),
(182, 'Saint Pierre and Miquelon', 'PM'),
(183, 'Saint Vincent and the Grenadines', 'VC'),
(184, 'Samoa', 'WS'),
(185, 'San Marino', 'SM'),
(186, 'Sao Tome and Principe', 'ST'),
(187, 'Saudi Arabia', 'SA'),
(188, 'Senegal', 'SN'),
(189, 'Serbia and Montenegro', 'CS'),
(190, 'Seychelles', 'SC'),
(191, 'Sierra Leone', 'SL'),
(192, 'Singapore', 'SG'),
(193, 'Slovakia', 'SK'),
(194, 'Slovenia', 'SI'),
(195, 'Solomon Islands', 'SB'),
(196, 'Somalia', 'SO'),
(197, 'South Africa', 'ZA'),
(198, 'South Georgia and the South Sandwich Islands', 'GS'),
(199, 'Spain', 'ES'),
(200, 'Sri Lanka', 'LK'),
(201, 'Sudan', 'SD'),
(202, 'Suriname', 'SR'),
(203, 'Svalbard and Jan Mayen', 'SJ'),
(204, 'Swaziland', 'SZ'),
(205, 'Sweden', 'SE'),
(206, 'Switzerland', 'CH'),
(207, 'Syrian Arab Republic', 'SY'),
(208, 'Taiwan, Province of China', 'TW'),
(209, 'Tajikistan', 'TJ'),
(210, 'Tanzania, United Republic of', 'TZ'),
(211, 'Thailand', 'TH'),
(212, 'Timor-Leste', 'TL'),
(213, 'Togo', 'TG'),
(214, 'Tokelau', 'TK'),
(215, 'Tonga', 'TO'),
(216, 'Trinidad and Tobago', 'TT'),
(217, 'Tunisia', 'TN'),
(218, 'Turkey', 'TR'),
(219, 'Turkmenistan', 'TM'),
(220, 'Turks and Caicos Islands', 'TC'),
(221, 'Tuvalu', 'TV'),
(222, 'Uganda', 'UG'),
(223, 'Ukraine', 'UA'),
(224, 'United Arab Emirates', 'AE'),
(225, 'United Kingdom', 'GB'),
(226, 'United States', 'US'),
(227, 'United States Minor Outlying Islands', 'UM'),
(228, 'Uruguay', 'UY'),
(229, 'Uzbekistan', 'UZ'),
(230, 'Vanuatu', 'VU'),
(231, 'Venezuela', 'VE'),
(232, 'Viet Nam', 'VN'),
(233, 'Virgin Islands, British', 'VG'),
(234, 'Virgin Islands, U.s.', 'VI'),
(235, 'Wallis and Futuna', 'WF'),
(236, 'Western Sahara', 'EH'),
(237, 'Yemen', 'YE'),
(238, 'Zambia', 'ZM'),
(239, 'Zimbabwe', 'ZW'),
(240, 'Serbia', 'RS'),
(241, 'Undefined', 'NONE');

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE IF NOT EXISTS `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `extension` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mime_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8C9F3610A76ED395` (`user_id`),
  KEY `IDX_8C9F361064D218E` (`location_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=93 ;

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`id`, `user_id`, `location_id`, `name`, `file_name`, `extension`, `mime_type`, `created`) VALUES
(19, 1, 482, 'DSC03239.jpg', 'DSC03239', 'jpg', 'image/jpeg', '2013-06-19 21:49:00'),
(21, 1, 496, '1329637009_739920306.jpg', '1329637009_739920306', 'jpg', 'image/jpeg', '2013-06-19 22:03:40'),
(82, 1, 529, 'DSC05616.jpg', 'DSC05616', 'jpg', 'image/jpeg', '2014-07-04 18:53:53'),
(83, 1, 529, 'DSC05617.jpg', 'DSC05617', 'jpg', 'image/jpeg', '2014-07-04 18:53:54'),
(84, 1, 529, 'DSC05618.jpg', 'DSC05618', 'jpg', 'image/jpeg', '2014-07-04 18:53:55'),
(85, 1, 529, 'DSC05621.jpg', 'DSC05621', 'jpg', 'image/jpeg', '2014-07-04 18:53:56'),
(86, 1, 529, 'DSC05622.jpg', 'DSC05622', 'jpg', 'image/jpeg', '2014-07-04 18:53:57'),
(87, 1, 529, 'DSC05625.jpg', 'DSC05625', 'jpg', 'image/jpeg', '2014-07-04 18:53:58'),
(88, 1, 529, 'DSC05619.jpg', 'DSC05619', 'jpg', 'image/jpeg', '2014-07-04 18:53:58'),
(89, 1, 529, 'DSC05626.jpg', 'DSC05626', 'jpg', 'image/jpeg', '2014-07-04 18:53:59'),
(90, 1, 529, 'DSC05623.jpg', 'DSC05623', 'jpg', 'image/jpeg', '2014-07-04 18:54:01'),
(91, 1, 529, 'DSC05620.jpg', 'DSC05620', 'jpg', 'image/jpeg', '2014-07-04 18:54:01'),
(92, 1, 529, 'DSC05624.jpg', 'DSC05624', 'jpg', 'image/jpeg', '2014-07-04 18:54:03');

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE IF NOT EXISTS `grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `grade` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_595AAE34C54C8C93` (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=172 ;

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`id`, `type_id`, `score`, `grade`) VALUES
(1, 1, 4, 'I'),
(2, 1, 5, 'II'),
(3, 1, 6, 'III'),
(4, 1, 8, 'III+'),
(5, 1, 10, 'IV'),
(6, 1, 12, 'IV+'),
(7, 1, 14, 'V-'),
(8, 1, 15, 'V'),
(9, 1, 17, 'V+'),
(10, 1, 18, 'VI-'),
(11, 1, 19, 'VI'),
(12, 1, 21, 'VI+'),
(13, 1, 22, 'VII-'),
(14, 1, 24, 'VII'),
(15, 1, 25, 'VII+'),
(16, 1, 27, 'VIII-'),
(17, 1, 28, 'VIII'),
(18, 1, 29, 'VIII+'),
(19, 1, 30, 'IX-'),
(20, 1, 32, 'IX'),
(21, 1, 34, 'IX+'),
(22, 1, 35, 'X-'),
(23, 1, 37, 'X'),
(24, 1, 38, 'X+'),
(25, 1, 39, 'XI-'),
(26, 1, 40, 'XI'),
(27, 1, 41, 'XI+'),
(28, 2, 2, '5.0'),
(29, 2, 3, '5.1'),
(30, 2, 4, '5.2'),
(31, 2, 5, '5.3'),
(32, 2, 6, '5.4'),
(33, 2, 8, '5.5'),
(34, 2, 10, '5.6'),
(35, 2, 12, '5.7'),
(36, 2, 14, '5.8'),
(37, 2, 18, '5.9'),
(38, 2, 20, '5.10a'),
(39, 2, 22, '5.10b'),
(40, 2, 23, '5.10c'),
(41, 2, 24, '5.10d'),
(42, 2, 25, '5.11a'),
(43, 2, 26, '5.11b'),
(44, 2, 27, '5.11c'),
(45, 2, 28, '5.11d'),
(46, 2, 29, '5.12a'),
(47, 2, 30, '5.12b'),
(48, 2, 31, '5.12c'),
(49, 2, 32, '5.12d'),
(50, 2, 33, '5.13a'),
(51, 2, 34, '5.13b'),
(52, 2, 35, '5.13c'),
(53, 2, 36, '5.13d'),
(54, 2, 37, '5.14a'),
(55, 2, 38, '5.14b'),
(56, 2, 39, '5.14c'),
(57, 2, 40, '5.14d'),
(58, 2, 41, '5.15a'),
(59, 2, 42, '5.15b'),
(60, 3, 3, '1'),
(61, 3, 4, '2'),
(62, 3, 5, '3'),
(63, 3, 6, '4a'),
(64, 3, 7, '4a+'),
(65, 3, 8, '4b'),
(66, 3, 9, '4b+'),
(67, 3, 10, '4c'),
(68, 3, 11, '4c+'),
(69, 3, 12, '5a'),
(70, 3, 13, '5a+'),
(71, 3, 14, '5b'),
(72, 3, 15, '5b+'),
(73, 3, 18, '5c'),
(74, 3, 19, '5c+'),
(75, 3, 20, '6a'),
(76, 3, 22, '6a+'),
(77, 3, 23, '6b'),
(78, 3, 24, '6b+'),
(79, 3, 25, '6c'),
(80, 3, 26, '6c+'),
(81, 3, 27, '7a'),
(82, 3, 28, '7a+'),
(83, 3, 29, '7b'),
(84, 3, 30, '7b+'),
(85, 3, 31, '7c'),
(86, 3, 32, '7c+'),
(87, 3, 33, '8a'),
(88, 3, 34, '8a+'),
(89, 3, 35, '8b'),
(90, 3, 37, '8b+'),
(91, 3, 38, '8c'),
(92, 3, 39, '8c+'),
(93, 3, 40, '9a'),
(94, 3, 41, '9a+'),
(95, 3, 42, '9b'),
(96, 4, 18, '3'),
(97, 4, 20, '4-'),
(98, 4, 21, '4'),
(99, 4, 22, '4+'),
(100, 4, 23, '5'),
(101, 4, 24, '5+'),
(102, 4, 25, '6A'),
(103, 4, 26, '6A+'),
(104, 4, 27, '6B'),
(105, 4, 28, '6B+'),
(106, 4, 29, '6C'),
(107, 4, 30, '6C+'),
(108, 4, 31, '7A'),
(109, 4, 32, '7A+'),
(110, 4, 33, '7B'),
(111, 4, 34, '7B+'),
(112, 4, 35, '7C'),
(113, 4, 36, '7C+'),
(114, 4, 37, '8A'),
(115, 4, 38, '8A+'),
(116, 4, 39, '8B'),
(117, 4, 40, '8B+'),
(118, 4, 41, '8C'),
(119, 4, 42, '8C+'),
(120, 5, 18, 'VB'),
(121, 5, 20, 'V0-'),
(122, 5, 21, 'V0'),
(123, 5, 22, 'V0+'),
(124, 5, 23, 'V1'),
(125, 5, 24, 'V2'),
(126, 5, 25, 'V3'),
(127, 5, 27, 'V4'),
(128, 5, 29, 'V5'),
(129, 5, 31, 'V6'),
(130, 5, 32, 'V7'),
(131, 5, 33, 'V8'),
(132, 5, 35, 'V9'),
(133, 5, 36, 'V10'),
(134, 5, 37, 'V11'),
(135, 5, 38, 'V12'),
(136, 5, 39, 'V13'),
(137, 5, 40, 'V14'),
(138, 5, 41, 'V15'),
(139, 5, 42, 'V16'),
(140, 6, 10, 'WI3'),
(141, 6, 14, 'WI4'),
(142, 6, 15, 'WI4+'),
(143, 6, 18, 'WI5'),
(144, 6, 19, 'WI5+'),
(145, 6, 20, 'WI6'),
(146, 6, 25, 'WI7'),
(147, 6, 29, 'WI8'),
(148, 6, 31, 'WI9'),
(149, 6, 33, 'WI10'),
(150, 6, 35, 'WI11'),
(151, 7, 8, 'M1'),
(152, 7, 10, 'M2'),
(153, 7, 12, 'M3'),
(154, 7, 14, 'M4'),
(155, 7, 15, 'M4+'),
(156, 7, 18, 'M5'),
(157, 7, 19, 'M5+'),
(158, 7, 20, 'M6'),
(159, 7, 25, 'M7'),
(160, 7, 29, 'M8'),
(161, 7, 31, 'M9'),
(162, 7, 33, 'M10'),
(163, 7, 35, 'M11'),
(164, 7, 37, 'M12'),
(165, 7, 39, 'M13'),
(166, 8, 2, 'A0'),
(167, 8, 3, 'A1'),
(168, 8, 4, 'A2'),
(169, 8, 5, 'A3'),
(170, 8, 6, 'A4'),
(171, 8, 8, 'A5');

-- --------------------------------------------------------

--
-- Table structure for table `grade_type`
--

CREATE TABLE IF NOT EXISTS `grade_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `grade_type`
--

INSERT INTO `grade_type` (`id`, `name`, `type`) VALUES
(1, 'UIAA', 'uiaa'),
(2, 'Yosemite', 'usa'),
(3, 'French', 'french'),
(4, 'Font', 'font'),
(5, 'Hueco', 'hueco'),
(6, 'Water-Ice', 'waterice'),
(7, 'Mixed', 'mixed'),
(8, 'Aid', 'aid');

-- --------------------------------------------------------

--
-- Table structure for table `layer`
--

CREATE TABLE IF NOT EXISTS `layer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `route_id` int(11) NOT NULL,
  `data` longtext COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_E4DB211AA76ED395` (`user_id`),
  KEY `IDX_E4DB211A93CB796C` (`file_id`),
  KEY `IDX_E4DB211A34ECB4E6` (`route_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=17 ;

--
-- Dumping data for table `layer`
--

INSERT INTO `layer` (`id`, `user_id`, `file_id`, `route_id`, `data`, `created`) VALUES
(5, 1, 19, 24, '{"paths":[[{"point":{"x":213.18669550604594,"y":443.0423095907537},"handleIn":{"x":0,"y":0},"handleOut":{"x":-1.821763731535924,"y":0}},{"point":{"x":211.4320724977658,"y":441.28768658247355},"handleIn":{"x":1.7210870747780405,"y":0.8605435373890487},"handleOut":{"x":-2.2189758253474565,"y":-1.1094879126735009}},{"point":{"x":206.168203472925,"y":433.39188304521275},"handleIn":{"x":2.278284196883675,"y":2.278284196883476},"handleOut":{"x":-0.40317717437272904,"y":-0.40317717437289957}},{"point":{"x":203.53626896050474,"y":431.6372600369325},"handleIn":{"x":0.6913100691843965,"y":0.6913100691844534},"handleOut":{"x":-1.0037775752343805,"y":-1.0037775752344373}},{"point":{"x":200.90433444808443,"y":429.8826370286523},"handleIn":{"x":1.593397513265586,"y":0.5311325044219757},"handleOut":{"x":-3.1398958522476335,"y":-1.0466319507493154}},{"point":{"x":190.3765963984032,"y":427.250702516232},"handleIn":{"x":2.9455303509907367,"y":1.472765175495283},"handleOut":{"x":-3.35255688807959,"y":-1.6762784440398377}},{"point":{"x":190.3765963984032,"y":412.33640694585},"handleIn":{"x":-4.118004190510447,"y":1.372668063503511},"handleOut":{"x":26.09573540936816,"y":-8.698578469789311}},{"point":{"x":271.96656628343294,"y":355.31115917674316},"handleIn":{"x":-19.429006567722553,"y":19.429006567722695},"handleOut":{"x":8.039368272963998,"y":-8.039368272963827}},{"point":{"x":301.7951574241967,"y":338.6422405980811},"handleIn":{"x":-4.895354683476626,"y":9.790709366953536},"handleOut":{"x":0.4637745407615057,"y":-0.9275490815232388}},{"point":{"x":300.9178459200565,"y":335.13299458152073},"handleIn":{"x":0.92523994767771,"y":0.46261997383879816},"handleOut":{"x":-1.4754892855192452,"y":-0.737744642759651}},{"point":{"x":275.47581229999355,"y":291.2674193745154},"handleIn":{"x":2.6282823311522634,"y":5.2565646623046405},"handleOut":{"x":-4.276652546080754,"y":-8.553305092161338}},{"point":{"x":262.3161397378919,"y":249.15646717579037},"handleIn":{"x":6.379838651310365,"y":6.37983865131028},"handleOut":{"x":-5.31693867586722,"y":-5.316938675867277}},{"point":{"x":240.38335213438927,"y":248.27915567165016},"handleIn":{"x":5.418590684861556,"y":-5.4185906848615275},"handleOut":{"x":-0.1367238707751426,"y":0.1367238707751426}},{"point":{"x":236.87410611782883,"y":248.27915567165016},"handleIn":{"x":0.13672387077494363,"y":0.1367238707751426},"handleOut":{"x":-0.7367897480657177,"y":-0.7367897480657746}},{"point":{"x":237.75141762196893,"y":245.64722115922987},"handleIn":{"x":-0.13672387077500048,"y":0.1367238707750289},"handleOut":{"x":6.368027017062701,"y":-6.368027017062758}},{"point":{"x":250.9110901840705,"y":221.0824990433069},"handleIn":{"x":-6.801097168166848,"y":6.801097168166876},"handleOut":{"x":5.092788166742565,"y":-5.092788166742565}},{"point":{"x":254.420336200631,"y":192.1312194066834},"handleIn":{"x":-2.303271808147599,"y":2.3032718081472865},"handleOut":{"x":3.6998984063028217,"y":-3.6998984063027933}},{"point":{"x":262.3161397378919,"y":181.6034813570021},"handleIn":{"x":-3.391574392169275,"y":3.3915743921692467},"handleOut":{"x":10.668330091916289,"y":-10.668330091916118}},{"point":{"x":331.62374856496024,"y":152.65220172037863},"handleIn":{"x":-19.303996370928246,"y":19.30399637092819},"handleOut":{"x":13.070370248628478,"y":-13.070370248628365}},{"point":{"x":360.57502820158385,"y":101.76813448025237},"handleIn":{"x":-8.0127905200967,"y":16.0255810401936},"handleOut":{"x":4.708192075093223,"y":-9.416384150186062}},{"point":{"x":370.22545474712507,"y":74.57147785190908},"handleIn":{"x":-7.532313432169644,"y":7.53231343216946},"handleOut":{"x":3.4480152859291024,"y":-3.4480152859293156}},{"point":{"x":371.102766251265,"y":57.02524776910693},"handleIn":{"x":-3.05989485321993,"y":3.0598948532200794},"handleOut":{"x":7.2212820184934685,"y":-7.221282018493412}},{"point":{"x":400.9313573920287,"y":35.969771669744375},"handleIn":{"x":-10.207317198393866,"y":0},"handleOut":{"x":2.4088853925679246,"y":0}},{"point":{"x":404.44060340858937,"y":33.33783715732407},"handleIn":{"x":0,"y":2.7266464219065085},"handleOut":{"x":0,"y":0}}]],"icons":[{"icon":"piton","x":305,"y":349},{"icon":"overhang","x":181,"y":420},{"icon":"slab","x":206,"y":395},{"icon":"slab","x":233,"y":377},{"icon":"dihedral","x":250,"y":255},{"icon":"chimney","x":262,"y":266},{"icon":"piton","x":230,"y":251},{"icon":"dihedral","x":266,"y":284},{"icon":"piton","x":269,"y":297},{"icon":"dihedral","x":262,"y":205},{"icon":"ramp","x":290,"y":180},{"icon":"dihedral","x":324,"y":167},{"icon":"chimney","x":346,"y":145},{"icon":"dihedral","x":355,"y":128},{"icon":"hole","x":311,"y":335},{"icon":"dihedral","x":280,"y":315},{"icon":"dihedral","x":238,"y":225},{"icon":"chockstone","x":365,"y":114},{"icon":"slab","x":372,"y":95},{"icon":"crux","x":386,"y":95},{"icon":"chimney","x":381,"y":72},{"icon":"ramp","x":388,"y":53}]}', '2013-06-19 21:52:56'),
(14, 1, 21, 29, '{"paths":[[{"point":{"x":632.4200932397081,"y":565.81179179599},"handleIn":{"x":0,"y":0},"handleOut":{"x":-23.742180725228877,"y":-35.613271087842804}},{"point":{"x":611.4268951238666,"y":412.299030573903},"handleIn":{"x":-21.01720831722014,"y":42.03441663443954},"handleOut":{"x":5.757545506208544,"y":-11.515091012417713}},{"point":{"x":631.1080183574675,"y":378.1850836356615},"handleIn":{"x":-5.083383640493594,"y":10.166767280986164},"handleOut":{"x":8.235607423268107,"y":-16.471214846536157}},{"point":{"x":645.5408420621085,"y":317.82963905261886},"handleIn":{"x":-6.42814824883601,"y":19.284444746507177},"handleOut":{"x":6.283563252048452,"y":-18.850689756147915}},{"point":{"x":642.9166922976282,"y":250.91382005837588},"handleIn":{"x":0,"y":20.034132274573466},"handleOut":{"x":0,"y":-41.642469224021255}},{"point":{"x":662.5978155312287,"y":89.52860954284887},"handleIn":{"x":-12.165890016716162,"y":36.497670050150475},"handleOut":{"x":4.545718699487111,"y":-13.637156098460977}},{"point":{"x":687.5272382937901,"y":42.29391378220684},"handleIn":{"x":-10.12725378868197,"y":10.127253788681749},"handleOut":{"x":2.730199239589524,"y":-2.730199239589396}},{"point":{"x":700.647987116191,"y":31.797314724286373},"handleIn":{"x":-5.0015429449620115,"y":2.500771472480949},"handleOut":{"x":2.117584464413767,"y":-1.0587922322070256}},{"point":{"x":708.5204364096305,"y":30.48523984204632},"handleIn":{"x":0,"y":3.1264051317393395},"handleOut":{"x":0,"y":0}}]],"icons":[{"icon":"anchor","x":677.8230819863966,"y":66.12789195250981},{"icon":"anchor","x":664.4725614958921,"y":93.42012238231062},{"icon":"anchor","x":659.5206489675517,"y":120.17330383480825},{"icon":"anchor","x":655.0368731563422,"y":152.97566371681415}]}', '2014-04-01 22:50:36'),
(15, 1, 21, 30, '{"paths":[[{"point":{"x":623.235569064027,"y":491.02352350830637},"handleIn":{"x":0,"y":0},"handleOut":{"x":3.464220785045086,"y":-17.32110392522611}},{"point":{"x":636.3563178864276,"y":437.22845333646393},"handleIn":{"x":-9.683218779851586,"y":14.524828169777038},"handleOut":{"x":11.687326077913553,"y":-17.530989116870217}},{"point":{"x":743.9464582301124,"y":393.92998222254226},"handleIn":{"x":-23.673826343741666,"y":23.673826343742064},"handleOut":{"x":16.57296066537674,"y":-16.572960665376343}},{"point":{"x":704.5842117629109,"y":296.83644093677793},"handleIn":{"x":7.771222884190706,"y":15.542445768381981},"handleOut":{"x":-3.236684155909529,"y":-6.473368311819115}},{"point":{"x":722.9532601142718,"y":223.3602475313347},"handleIn":{"x":14.152733687249452,"y":14.152733687249906},"handleOut":{"x":-18.215689000908583,"y":-18.215689000908526}},{"point":{"x":708.5204364096305,"y":180.06177641741297},"handleIn":{"x":9.110606174327017,"y":18.22121234865355},"handleOut":{"x":-3.289349029366008,"y":-6.578698058733181}},{"point":{"x":692.7755378227503,"y":159.0685783015718},"handleIn":{"x":2.1917760861607576,"y":6.575328258481903},"handleOut":{"x":-7.785943220167837,"y":-23.3578296605032}},{"point":{"x":684.9030885293095,"y":72.47163607372812},"handleIn":{"x":-5.478715966365485,"y":27.393579831831076},"handleOut":{"x":2.034498718360169,"y":-10.172493591797995}},{"point":{"x":694.0876127049906,"y":40.98183889996677},"handleIn":{"x":0,"y":10.256450044997585},"handleOut":{"x":0,"y":0}}]],"icons":[]}', '2014-04-01 22:50:49'),
(16, 1, 21, 31, '{"paths":[[{"point":{"x":805.6139776953956,"y":620.9189368500722},"handleIn":{"x":0,"y":0},"handleOut":{"x":0,"y":-20.568693059432576}},{"point":{"x":800.3656781664346,"y":467.40617562798565},"handleIn":{"x":-3.7899450275415347,"y":11.369835082626537},"handleOut":{"x":9.11941996352482,"y":-27.358259890573493}},{"point":{"x":802.9898279309151,"y":345.3832115796599},"handleIn":{"x":12.887915912341214,"y":25.775831824682484},"handleOut":{"x":-8.750190502422925,"y":-17.500381004845565}},{"point":{"x":757.067207052513,"y":317.829639052619},"handleIn":{"x":6.231291410929089,"y":37.38774846557442},"handleOut":{"x":-3.0648906540872076,"y":-18.38934392452478}},{"point":{"x":749.1947577590727,"y":253.537969822856},"handleIn":{"x":-6.384862537122331,"y":19.154587611366907},"handleOut":{"x":6.873443344403086,"y":-20.62033003320883}},{"point":{"x":751.8189075235531,"y":182.685926181893},"handleIn":{"x":6.90888029722953,"y":20.726640891686003},"handleOut":{"x":-3.978645077404053,"y":-11.935935232210596}},{"point":{"x":750.506832641313,"y":143.3236797146914},"handleIn":{"x":4.037893882170124,"y":12.113681646510912},"handleOut":{"x":-9.4914390504008,"y":-28.474317151200893}},{"point":{"x":721.6411852320314,"y":59.35088725132759},"handleIn":{"x":9.571442673110823,"y":28.71432801933196},"handleOut":{"x":-1.6213110531523398,"y":-4.863933159457801}},{"point":{"x":721.6411852320314,"y":23.924865430846044},"handleIn":{"x":1.2609230055193166,"y":0},"handleOut":{"x":0,"y":0}}],[{"point":{"x":730.2460445159567,"y":79.20689192813094},"handleIn":{"x":0,"y":0},"handleOut":{"x":0.4651171437335506,"y":-2.5581442905360348}},{"point":{"x":732.3913917940472,"y":71.69817645481369},"handleIn":{"x":-0.823840424102741,"y":2.471521272306987},"handleOut":{"x":0,"y":0}}],[{"point":{"x":731.9623223384291,"y":67.83655135425053},"handleIn":{"x":0,"y":0},"handleOut":{"x":0.1831176284541698,"y":-1.831176284541371}},{"point":{"x":732.3913917940472,"y":62.04411370340578},"handleIn":{"x":0,"y":1.7818275060416653},"handleOut":{"x":0,"y":0}}],[{"point":{"x":732.3913917940472,"y":58.39702333065164},"handleIn":{"x":0,"y":0},"handleOut":{"x":0,"y":-1.2156967909178675}},{"point":{"x":732.3913917940472,"y":54.7499329578976},"handleIn":{"x":0,"y":1.2156967909180167},"handleOut":{"x":0,"y":0}}],[{"point":{"x":732.3913917940472,"y":48.0993563958166},"handleIn":{"x":0,"y":0},"handleOut":{"x":0,"y":-1.5345110560017048}},{"point":{"x":732.1768570662379,"y":44.023196567444366},"handleIn":{"x":0,"y":1.416306617769429},"handleOut":{"x":0,"y":0}}],[{"point":{"x":731.9623223384291,"y":40.80517565030842},"handleIn":{"x":0,"y":0},"handleOut":{"x":0,"y":-1.0726736390451777}},{"point":{"x":731.9623223384291,"y":37.58715473317248},"handleIn":{"x":0,"y":1.07267363904527},"handleOut":{"x":0,"y":0}}],[{"point":{"x":731.7477876106204,"y":33.08192544918213},"handleIn":{"x":0,"y":0},"handleOut":{"x":0,"y":-1.4302315187271368}},{"point":{"x":731.7477876106204,"y":28.791230893000826},"handleIn":{"x":0,"y":1.430231518727119},"handleOut":{"x":0,"y":0}}],[{"point":{"x":731.104183427193,"y":26.64588361491018},"handleIn":{"x":0,"y":0},"handleOut":{"x":-0.2862102741255512,"y":-0.9540342470834453}},{"point":{"x":730.0315097881476,"y":23.856932153392343},"handleIn":{"x":0.9960409959546723,"y":0},"handleOut":{"x":0,"y":0}}]],"icons":[]}', '2014-04-01 22:51:09');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8_unicode_ci NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_5E9E89CBA76ED395` (`user_id`),
  KEY `IDX_5E9E89CBF92F3E70` (`country_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=530 ;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `user_id`, `country_id`, `name`, `description`, `lat`, `lng`, `created`) VALUES
(2, 1, 194, 'Bitenj potok', '51 smeri (5a do 8a)', 46.2911, 13.9899, '2010-12-08 07:34:25'),
(3, 1, 194, 'Bitnje', '49 smeri (4a do 8b)', 46.2858, 13.9636, '2010-12-08 07:34:25'),
(4, 1, 194, 'Blažčeva skala', '19 smeri (5b do 7c+)', 46.4691, 13.973, '2010-12-08 07:34:25'),
(5, 1, 194, 'Boč', '20 smeri (4c do 7c+)', 46.2834, 15.6336, '2010-12-08 07:34:25'),
(6, 1, 194, 'Bodešče', '41 smeri (5a do 7b+)', 46.3423, 14.139, '2010-12-08 07:34:25'),
(7, 1, 194, 'Bohinj', '90 smeri (3 do 7c)', 46.2758, 13.8837, '2010-12-08 07:34:25'),
(8, 1, 194, 'Bohinjska Bela', '79 smeri (3 do 8c+)', 46.3481, 14.0591, '2010-12-08 07:34:25'),
(9, 1, 194, 'Buncove skale', '47 smeri (4a+/b do 7b)', 46.4517, 15.5464, '2010-12-08 07:34:25'),
(10, 1, 194, 'Burjakove peči', '68 smeri (3 do 8c)', 46.4713, 14.7894, '2010-12-08 07:34:25'),
(11, 1, 194, 'Čerjan', '20 smeri (6a+ do 8a)', 46.1206, 15.0376, '2010-12-08 07:34:25'),
(12, 1, 194, 'Čolnišče', '23 smeri (5b+ do 7b)', 46.126, 14.9641, '2010-12-08 07:34:25'),
(13, 1, 194, 'Črni Kal', '269 smeri (3 do 8a)', 45.5512, 13.8817, '2010-12-08 07:34:25'),
(14, 1, 194, 'Dolge njive', '43 smeri (4a+/b do 8a)', 45.9911, 13.6449, '2010-12-08 07:34:25'),
(15, 1, 194, 'Dolžanova soteska', '40 smeri (6a do 7c+)', 46.385, 14.3321, '2010-12-08 07:34:25'),
(16, 1, 194, 'Gore', '36 smeri (3 do 7c+)', 46.008, 14.0524, '2010-12-08 07:34:25'),
(17, 1, 194, 'Gorje', '18 smeri (4a do 7a+)', 46.3732, 14.0699, '2010-12-08 07:34:25'),
(18, 1, 194, 'Gornji Ig', '49 smeri (4b do 7c+)', 45.9143, 14.4937, '2010-12-08 07:34:25'),
(19, 1, 194, 'Gromberg', '11 smeri (5b do 7b+)', 46.4448, 15.5838, '2010-12-08 07:34:25'),
(20, 1, 194, 'Igla', '22 smeri (5b do 7a+)', 46.3789, 14.7281, '2010-12-08 07:34:25'),
(21, 1, 194, 'Iški Vintgar', '38 smeri (3 do 8a)', 45.909, 14.4955, '2010-12-08 07:34:25'),
(22, 1, 194, 'Kal-Koritnica', '33 smeri (4a do 7b)', 46.3422, 13.5843, '2010-12-08 07:34:25'),
(23, 1, 194, 'Kamnik', '58 smeri (3 do 7a+/b)', 46.2078, 15.1247, '2010-12-08 07:34:25'),
(24, 1, 194, 'Kamniška bistrica', '21 smeri (6a do 8a+)', 46.3398, 14.5748, '2010-12-08 07:34:25'),
(25, 1, 194, 'Kamnitnik', '39 smeri (4a/a+ do 7a/a+)', 46.1692, 14.3113, '2010-12-08 07:34:25'),
(26, 1, 194, 'Korošica', '53 smeri (2 do 7c)', 46.3556, 14.6396, '2010-12-08 07:34:25'),
(27, 1, 194, 'Kot nad Prevaljami', '35 smeri (4a do 7c)', 46.503, 14.9196, '2010-12-08 07:34:25'),
(28, 1, 194, 'Kotečnik', '303 smeri (4b do 8c)', 46.1995, 15.1789, '2010-12-08 07:34:25'),
(29, 1, 194, 'Kovačevec', '14 smeri (4b+ do 7b+)', 46.4505, 14.0375, '2010-12-08 07:34:25'),
(30, 1, 194, 'Križevska vas', '30 smeri (5a do 8a)', 46.1083, 14.7223, '2010-12-08 07:34:25'),
(31, 1, 194, 'Krvavec', '13 smeri (4c+ do 7c+)', 46.2835, 14.4936, '2010-12-08 07:34:25'),
(32, 1, 194, 'Kupljenik', '30 smeri (5a+ do 8a+)', 46.3373, 14.0768, '2010-12-08 07:34:25'),
(33, 1, 194, 'Lijak', '28 smeri (4b do 8a+)', 45.9596, 13.7205, '2010-12-08 07:34:25'),
(34, 1, 194, 'Lipje', '10 smeri (6a do 7c)', 46.3508, 15.1666, '2010-12-08 07:34:25'),
(35, 1, 194, 'Logarska dolina', '25 smeri (4a do 7b+/c)', 46.4195, 14.6387, '2010-12-08 07:34:25'),
(36, 1, 194, 'Luknja', '35 smeri (4c do 7b+)<br><br><font color="#ff0000">neki asdf ff</font><br>', 45.8173, 15.0956, '2010-12-08 07:34:25'),
(37, 1, 194, 'Lutne Skale', '64 smeri (3 do 8a)', 46.126, 13.9152, '2010-12-08 07:34:25'),
(38, 1, 194, 'Male bele stene', '51 smeri (4c do 7c+)', 45.6923, 14.6824, '2010-12-08 07:34:25'),
(39, 1, 194, 'Matjaževe kamre', '18 smeri (5c do 7c)', 46.0049, 14.1378, '2010-12-08 07:34:25'),
(40, 1, 194, 'Matvoz', '37 smeri (4a do 7a)', 46.466, 14.8701, '2010-12-08 07:34:25'),
(41, 1, 194, 'Mišja peč', '183 smeri (4a do 9a)', 45.5679, 13.8627, '2010-12-08 07:34:25'),
(42, 1, 194, 'Mlinarjeva peč', '11 smeri (4a do 7a)', 46.4074, 14.5184, '2010-12-08 07:34:25'),
(43, 1, 194, 'Močilnik', '17 smeri (4a do 7c)', 45.9538, 14.292, '2010-12-08 07:34:25'),
(44, 1, 194, 'Nad Savo', '19 smeri (5c do 8a)', 45.9856, 15.4585, '2010-12-08 07:34:25'),
(45, 1, 194, 'Nadiža', '14 smeri (4a do 7b+/c)', 46.2449, 13.5051, '2010-12-08 07:34:25'),
(46, 1, 194, 'Osp', '205 smeri (3 do 8c+)\r', 45.5723, 13.86, '2010-12-08 07:34:25'),
(47, 1, 194, 'Peč pri Bohinju', '37 smeri (4a do 7c)', 46.2779, 13.8974, '2010-12-08 07:34:25'),
(48, 1, 194, 'Pisano čelo', '9 smeri (6a+ do 7c)', 46.1708, 13.8736, '2010-12-08 07:34:25'),
(49, 1, 194, 'Plezališče Lavorček', '7 smeri (5b do 6c)', 46.2275, 14.6199, '2010-12-08 07:34:25'),
(50, 1, 194, 'Pod Kopitcem', '11 smeri (4c do 6b+)', 46.2626, 13.5916, '2010-12-08 07:34:25'),
(51, 1, 194, 'Pod Reško planino', '63 smeri (4a+/b do 8a)', 46.2096, 15.0487, '2010-12-08 07:34:25'),
(52, 1, 194, 'Pod Sušo', '8 smeri (6a do 8a+)', 46.2063, 14.1204, '2010-12-08 07:34:25'),
(53, 1, 194, 'Porezen', '10 smeri (6a do 7b+)', 46.1878, 13.9484, '2010-12-08 07:34:25'),
(54, 1, 194, 'Preddvor', '53 smeri (4a do 8b)', 46.3235, 14.4458, '2010-12-08 07:34:25'),
(55, 1, 194, 'Pri Čiginju', '45 smeri (3 do 7c)', 46.1692, 13.7144, '2010-12-08 07:34:25'),
(56, 1, 194, 'Pri Pavru', '15 smeri (4a do 7a+)', 46.3971, 13.7416, '2010-12-08 07:34:25'),
(57, 1, 194, 'Pri Žvikarju', '11 smeri (5a do 7b+)', 46.3211, 13.4862, '2010-12-08 07:34:25'),
(58, 1, 194, 'Radlje', '13 smeri (4c+ do 7a+)', 46.6189, 15.2119, '2010-12-08 07:34:25'),
(59, 1, 194, 'Radovna', '10 smeri (6a+ do 7c)', 46.4104, 13.9936, '2010-12-08 07:34:25'),
(60, 1, 194, 'Rakitnica', '7 smeri (5c do 6c)', 45.6799, 14.7363, '2010-12-08 07:34:25'),
(61, 1, 194, 'Renke', '44 smeri (5a do 7c/c+)', 46.0972, 14.9408, '2010-12-08 07:34:25'),
(62, 1, 194, 'Retovje', '25 smeri (5a do 8b/b+)', 45.9516, 14.2981, '2010-12-08 07:34:25'),
(63, 1, 194, 'Risnik', '14 smeri (4c do 8a)', 45.6776, 13.9662, '2010-12-08 07:34:25'),
(64, 1, 194, 'Rudnica', '11 smeri (6a do 7b)', 46.2801, 13.9181, '2010-12-08 07:34:25'),
(65, 1, 194, 'Šeginov potok', '10 smeri (5b do 8a+)', 46.2985, 15.6561, '2010-12-08 07:34:25'),
(66, 1, 194, 'Sele', '42 smeri (4a do 7c+)', 46.5093, 15.0499, '2010-12-08 07:34:25'),
(67, 1, 194, 'Senica', '37 smeri (4a do 7c)', 46.1608, 13.7754, '2010-12-08 07:34:25'),
(68, 1, 194, 'Slap ob Idrijci', '17 smeri (4a do 7a+)', 46.1099, 13.8128, '2010-12-08 07:34:25'),
(69, 1, 194, 'Slomnik', '24 smeri (5a do 7c)', 46.2059, 15.2103, '2010-12-08 07:34:25'),
(70, 1, 194, 'Šnitov rob', '15 smeri (5c do 7a+)', 46.0401, 14.0391, '2010-12-08 07:34:25'),
(71, 1, 194, 'Socka', '15 smeri (5b do 7a)', 46.3587, 15.2758, '2010-12-08 07:34:25'),
(72, 1, 194, 'Šoder graben', '25 smeri (4a do 7c)', 46.2942, 15.6571, '2010-12-08 07:34:25'),
(73, 1, 194, 'Sopota', '15 smeri (6a do 7a+)', 46.1454, 15.2968, '2010-12-08 07:34:25'),
(74, 1, 194, 'Štenge', '25 smeri (4a do 7c)', 46.5092, 14.8244, '2010-12-08 07:34:25'),
(75, 1, 194, 'Strug', '53 smeri (3 do 7c+)', 45.9688, 14.0094, '2010-12-08 07:34:25'),
(76, 1, 194, 'Trenta', '27 smeri (4a do 7b)', 46.3623, 13.7173, '2010-12-08 07:34:25'),
(77, 1, 194, 'Turnc', '75 smeri (3 do 7b)', 46.1283, 14.4465, '2010-12-08 07:34:25'),
(78, 1, 194, 'Vipava', '252 smeri (2 do 7c+)', 45.8316, 13.9706, '2010-12-08 07:34:25'),
(79, 1, 194, 'Vipavska Bela', '122 smeri (2 do 8c/c+)', 45.8722, 13.9724, '2010-12-08 07:34:25'),
(80, 1, 194, 'Vranja peč', '10 smeri (4b+ do 7a+)', 46.2107, 14.6714, '2010-12-08 07:34:25'),
(81, 1, 194, 'Vransko', '16 smeri (4a do 6a)', 46.2478, 14.9529, '2010-12-08 07:34:25'),
(82, 1, 194, 'Vršič', '35 smeri (4a do 7b)', 46.4305, 13.7407, '2010-12-08 07:34:25'),
(83, 1, 194, 'Završnica', '37 smeri (5a do 7c+/8a)', 46.4072, 14.1536, '2010-12-08 07:34:25'),
(84, 1, 194, 'Zelenc pri Izlakah', '8 smeri (5c do 7c)', 46.1503, 14.9434, '2010-12-08 07:34:25'),
(85, 1, 194, 'Zminec', '24 smeri (5c do 8a)', 46.1535, 14.2902, '2010-12-08 07:34:25'),
(86, 1, 194, 'Glence', 'Bouldering spot\n84 boulder problems(4a - 8b+)<br><br><br>', 46.4051, 14.2845, '2010-12-08 07:34:25'),
(87, 1, 194, 'Sinji slap', 'Very nice and easy waterfall', 46.373, 14.5499, '2010-12-08 07:34:25'),
(90, 1, 194, 'Ledinski slap', 'Very nice two-part waterfall. Lower and higher Ledinec!', 46.3761, 14.5551, '2010-12-08 07:34:25'),
(92, 1, 194, 'Centralni slap', 'Central waterfall in Tamar.', 46.4439, 13.7189, '2010-12-08 07:34:25'),
(93, 1, 194, 'Lucifer', 'Famous Slovenian waterfall.', 46.4756, 13.8577, '2010-12-08 07:34:25'),
(94, 1, 194, 'Plezališče Snovik', '12 smeri\ntežavnost: 6a-8b+\ndostop: 5min', 46.2381, 14.7103, '2010-12-08 07:34:25'),
(95, 1, 105, 'Val Rosandra - Glinščica', '464 smeri\nod 3b do 8b', 45.6257, 13.8667, '2010-12-08 07:34:25'),
(96, 1, 105, 'Val Rosandra - Glinščica', '464 rutes(3b - 8b)', 45.6257, 13.8667, '2010-12-08 07:34:25'),
(97, 1, 105, 'Val Rosandra - Glinščica', '464 rutes(3b - 8b)', 45.6245, 13.8673, '2010-12-08 07:34:25'),
(98, 1, 194, 'Znojile', '23 smeri (D4 - D8+)', 46.1863, 14.9973, '2010-12-08 07:34:25'),
(99, 1, 194, 'Ob Savi', '33 smeri(D5 - D9-)', 46.1157, 14.9852, '2010-12-08 07:34:25'),
(101, 1, 194, 'Ander-Prem', '6 rutes and more combinations(M7 - M12)\r', 46.4242, 14.2712, '2010-12-08 07:34:25'),
(102, 1, 194, 'Na Ljubelj', 'Some problems(6a - 7c)', 46.4304, 14.2603, '2010-12-08 07:34:25'),
(103, 1, 194, 'Dovžanka', 'Boulder spot', 46.3838, 14.3319, '2010-12-08 07:34:25'),
(104, 1, 194, 'Trenta', 'Boulder spot', 46.3616, 13.7166, '2010-12-08 07:34:25'),
(105, 1, 194, 'Radovna', 'Boulder spot', 46.411, 13.996, '2010-12-08 07:34:25'),
(106, 1, 194, 'Orehk', 'Traverses on a bridge by railway<br><br>Very polished<br>', 46.2136, 14.3642, '2010-12-08 07:34:25'),
(107, 1, 194, 'Smeri pri Bornovih tunelih', '9 rutes(3 - 7-)', 46.4247, 14.2666, '2010-12-08 07:34:25'),
(108, 1, 194, 'Lambada', 'Wrong location?', 46.4331, 13.7611, '2010-12-08 07:34:25'),
(109, 1, 54, 'Nugla', '22 rutes(6a+ - 8a)', 45.4189, 14.0235, '2010-12-08 07:34:25'),
(110, 1, 54, 'Krkuž', '10 rutes(5c - 8a)', 45.4, 14.0552, '2010-12-08 07:34:25'),
(111, 1, 105, 'Rabeljski slap', 'From left to right: \nPožled(M7,WI 5+), \nThe harder left(WI 6+), \nLeft variant(WI 5+),\n Middle one(WI 5), \nČez previs(M8/M8+, WI 5), \nRight variant(WI 4+)', 46.4378, 13.5749, '2010-12-08 07:34:25'),
(113, 1, 194, 'Škratova skala', '1. Kobariški štruklji   5b    16m\n2. Na Gradič           5b    16m\n3. Pijem tokaj         4b    20m\n4. Brez konkurence  P     20m\n5. The way beyond 6b+  20m\n6. Huljeva               5b   30m\n7. Huljeva varianta    7a   20m\n8. Škratovi zobje      6a   15m', 46.2463, 13.5842, '2010-12-08 07:34:25'),
(482, 1, 194, 'Planja', '\r', 46.4071, 13.7972, '2010-12-08 07:34:25'),
(488, 1, 193, 'name 456', 'description 456', 46.1235, 13.1234, '2013-05-12 20:42:07'),
(489, 1, 193, 'name 456', 'description 456', 46.1235, 13.1234, '2013-05-12 20:44:07'),
(496, 1, 194, 'Grand Capucin', '', 45.852246219254, 6.8986737728119, '2013-06-19 22:03:37'),
(507, 1, 194, 'asdf', '', 46.248086686576, 14.345333576202, '2014-06-29 13:02:18'),
(529, 1, 73, 'Test', 'Tes', 47.45780853075, 4.6142578125, '2014-07-04 18:53:53');

-- --------------------------------------------------------

--
-- Table structure for table `location_type`
--

CREATE TABLE IF NOT EXISTS `location_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Dumping data for table `location_type`
--

INSERT INTO `location_type` (`id`, `name`, `type`) VALUES
(1, 'Sport climbing', 'sport'),
(2, 'Bouldering', 'bouldering'),
(3, 'Multipitch climbing', 'multipitch'),
(4, 'Trad climbing', 'trad'),
(5, 'Alpine climbing', 'alpine'),
(6, 'Water-ice', 'waterice'),
(7, 'Deep Water Soloing', 'dws'),
(8, 'Dry-tooling', 'drytooling'),
(9, 'Indoor gym', 'indoor');

-- --------------------------------------------------------

--
-- Table structure for table `location_types`
--

CREATE TABLE IF NOT EXISTS `location_types` (
  `location_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`location_id`,`type_id`),
  KEY `IDX_2F6CCC1564D218E` (`location_id`),
  KEY `IDX_2F6CCC15C54C8C93` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `location_types`
--

INSERT INTO `location_types` (`location_id`, `type_id`) VALUES
(2, 1),
(3, 1),
(4, 1),
(4, 4),
(5, 1),
(5, 5),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(31, 8),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(46, 3),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(63, 1),
(64, 1),
(65, 1),
(66, 1),
(67, 1),
(68, 1),
(69, 1),
(70, 1),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(77, 1),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 2),
(87, 6),
(90, 6),
(92, 6),
(93, 6),
(94, 1),
(95, 1),
(96, 1),
(97, 1),
(98, 8),
(99, 8),
(101, 8),
(102, 2),
(103, 2),
(104, 2),
(105, 2),
(106, 2),
(107, 3),
(108, 6),
(109, 1),
(110, 1),
(111, 6),
(113, 1),
(482, 5),
(488, 2),
(488, 5),
(489, 2),
(489, 5),
(496, 5),
(529, 2),
(529, 3);

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE IF NOT EXISTS `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `pos` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2C42079A76ED395` (`user_id`),
  KEY `IDX_2C4207964D218E` (`location_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=32 ;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`id`, `user_id`, `location_id`, `pos`, `file_id`, `name`, `created`) VALUES
(8, 1, 488, 0, 0, 'Test route 789 one and only', '2013-05-12 20:42:11'),
(10, 1, 489, 0, 0, 'Test route 789 one and only', '2013-05-12 20:44:11'),
(24, 1, 482, 0, 0, 'Mansarda', '2013-06-19 21:50:07'),
(25, 1, 482, 0, 0, 'GroÅ¡ljeva smer', '2013-06-19 21:57:22'),
(26, 1, 482, 0, 0, 'Obraz', '2013-06-19 21:57:22'),
(29, 1, 496, 0, 0, 'Swiss route', '2013-06-19 22:03:37'),
(30, 1, 496, 0, 0, 'Bonatti route', '2013-06-19 22:05:51'),
(31, 1, 496, 0, 0, 'O sole mio', '2013-06-19 22:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `route_grades`
--

CREATE TABLE IF NOT EXISTS `route_grades` (
  `route_id` int(11) NOT NULL,
  `grade_id` int(11) NOT NULL,
  PRIMARY KEY (`route_id`,`grade_id`),
  KEY `IDX_B1090CD34ECB4E6` (`route_id`),
  KEY `IDX_B1090CDFE19A1A8` (`grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `route_grades`
--

INSERT INTO `route_grades` (`route_id`, `grade_id`) VALUES
(8, 5),
(10, 5),
(24, 12),
(29, 83),
(31, 78);

-- --------------------------------------------------------

--
-- Table structure for table `sector`
--

CREATE TABLE IF NOT EXISTS `sector` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE IF NOT EXISTS `token` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`id`, `type`, `value`, `expires`) VALUES
('3f9ec228320775fae26cece4ee8c9b6f', '0', '1', '2015-03-31 19:17:39'),
('7827a2de51f1763e00dc11f30d4e9924', '0', '1', '2015-06-14 14:01:47'),
('8e39e4b0a77c66e8312dbcebee32c71c', '0', '1', '2015-06-15 01:39:16');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `permission` int(11) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `first_name`, `last_name`, `email`, `permission`, `created`) VALUES
(1, 'HriBB', '58b405272fb0b03f27a6c84f68b2d6b9', 'Bojan', 'Hribernik', 'bojan.hribernik@gmail.com', 6, '2010-11-19 18:57:20');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `FK_8C9F361064D218E` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  ADD CONSTRAINT `FK_8C9F3610A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `FK_595AAE34C54C8C93` FOREIGN KEY (`type_id`) REFERENCES `grade_type` (`id`);

--
-- Constraints for table `layer`
--
ALTER TABLE `layer`
  ADD CONSTRAINT `FK_E4DB211A34ECB4E6` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`),
  ADD CONSTRAINT `FK_E4DB211A93CB796C` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`),
  ADD CONSTRAINT `FK_E4DB211AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `FK_5E9E89CBA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_5E9E89CBF92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`);

--
-- Constraints for table `location_types`
--
ALTER TABLE `location_types`
  ADD CONSTRAINT `FK_2F6CCC1564D218E` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  ADD CONSTRAINT `FK_2F6CCC15C54C8C93` FOREIGN KEY (`type_id`) REFERENCES `location_type` (`id`);

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `FK_2C4207964D218E` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  ADD CONSTRAINT `FK_2C42079A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `route_grades`
--
ALTER TABLE `route_grades`
  ADD CONSTRAINT `FK_B1090CD34ECB4E6` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`),
  ADD CONSTRAINT `FK_B1090CDFE19A1A8` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
