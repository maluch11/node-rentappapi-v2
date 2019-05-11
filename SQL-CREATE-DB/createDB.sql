-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: u12.atthost.pl
-- Czas generowania: 01 Sie 2018, 16:54
-- Wersja serwera: 10.1.31-MariaDB-cll-lve
-- Wersja PHP: 5.6.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `7137_testapi`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tasks`
--

CREATE TABLE `tasks` (
  `taskid` varchar(45) NOT NULL,
  `taskautoinc` int(45) NOT NULL,
  `taskname` varchar(160) NOT NULL,
  `taskdesc` varchar(1000) NOT NULL,
  `istaskquick` tinyint(1) NOT NULL,
  `dtcreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dtmod` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `tasks`
--

INSERT INTO `tasks` (`taskid`, `taskautoinc`, `taskname`, `taskdesc`, `istaskquick`, `dtcreate`, `dtmod`, `userid`) VALUES
('DC76ONWBK0BU8YLGHWM1UQ5XRSG0W4JV', 5, 'taskname 3', 'description', 0, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('FAAP9M3UN3PBRCU2Q3WIYNLXSU43P4LJ', 7, 'taskname 41', 'description', 1, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('I00VWBXX1UCIXTO3JEWX83VS0D1N7YTJ', 13, 'taskname 90', '', 1, '2018-07-31 20:07:45', '2018-08-01 12:00:00', 'VX5B3PN2CO4A2ELG3FQDQW51MUFQMJAX'),
('JL6GXG2DI9DBOA9O2M5QHFC9SBDBWKIW', 8, 'taskname 42', 'description', 1, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('KM53TXPVRV2V4CWA64XUWMV0KB4TK4UH', 4, 'taskname 2', 'description', 0, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('M44DTD2PLQFVIIR58DI7QA68SJEQ3RTR', 10, 'taskname 4', 'description', 1, '2018-07-31 19:55:34', '2018-08-01 12:00:00', 'VX5B3PN2CO4A2ELG3FQDQW51MUFQMJAX'),
('P9GARJFTTIX0B8BM0I5CAFT2582R0TVX', 3, 'taskname 2', 'description', 0, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('R4I6G3RQPP35FD2GWOSC4AB3XXB9960N', 14, 'taskname 90', '', 1, '2018-08-01 16:44:39', '2018-08-01 12:00:00', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('T2G3CTANMSLENCAFR1AD7FTHXFL3SCNA', 16, 'taskname 90', '', 1, '2018-08-01 16:45:44', '2018-08-01 12:00:00', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('T6NTIHIEXVXDCE9IR4VULLHTW84NMHIS', 6, 'taskname 43 updated', 'description', 1, '2018-07-31 19:52:43', '2018-07-31 19:54:29', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83'),
('UL0VITLLG5XJNYGQ99OMDPCERJY1EL3R', 9, 'taskname 4', 'description', 1, '2018-07-31 19:55:14', '2018-08-01 00:00:00', 'VX5B3PN2CO4A2ELG3FQDQW51MUFQMJAX'),
('X4A1BR45DM3ONGY4HFAU0J3YNAG90WFH', 2, 'taskname 90', 'description', 1, '2018-07-31 19:52:43', '2018-08-01 12:00:00', 'WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tests`
--

CREATE TABLE `tests` (
  `testid` varchar(64) NOT NULL,
  `testautoinc` int(40) NOT NULL,
  `testname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `tests`
--

INSERT INTO `tests` (`testid`, `testautoinc`, `testname`) VALUES
('IPTP89CA93MKMEC6FA0VJIQD3SP9H07X', 5, ''),
('N1XXI7LINAEWDIMSYT9QK42RXPHW62BU', 2, 'test name updated aaa'),
('NA1PVXO8UBRWTQ9G840IX2O41HN57FH1', 4, ''),
('VPI2T2V5E826Y1UR0V0PXLGJQW47XX90', 3, 'test name updated aaa'),
('X4UHJRIVQK40FX2N44940NIRHXKHCUCU', 1, 'ala-ma-kota');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `userid` varchar(45) NOT NULL,
  `userautoinc` int(40) NOT NULL,
  `userlogin` varchar(100) NOT NULL,
  `username` varchar(300) NOT NULL,
  `userpassword` varchar(300) NOT NULL,
  `isuseradmin` tinyint(1) NOT NULL DEFAULT '0',
  `isusermanager` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`userid`, `userautoinc`, `userlogin`, `username`, `userpassword`, `isuseradmin`, `isusermanager`) VALUES
('BK373IDAFXGKTJKBREI29O0GOX26EIUG', 2, 'admin2', 'Admin ', 'b039179a8a4ce2c252aa6f2f25798251c19b75fc1508d9d511a191e0487d64a7', 1, 0),
('C6EFRGR50J55XEY32DNUUL9DB21B262I', 7, 'admin7', 'Admin ', 'a', 1, 0),
('CCDVDKTRIIT80GNN7WS3WFCWDR2SFW63', 6, 'admin5', 'Admin ', 'a', 1, 0),
('FP9V6R03WKJPJSIS9GEWC4FAI9QMK1F1', 5, 'admin4', 'Admin ', 'a', 1, 0),
('IPEHP3V0AKBOTEP759EI52CYD01CFHN3', 13, 'admin14', 'Admin ', 'a', 1, 0),
('KJJN0CVC5V9YWV9DGBP06Q18G0MKOI7U', 17, 'admin90', 'Admin ', '3eb1eb1a65a610cbe162f557569352e242a7e2db10d61605cb66c0fe53dfb6c0', 1, 0),
('L60DPRPX6X51NCV87VE0EKAUEE9MW5VS', 3, 'admin3', 'Admin ', 'a', 1, 0),
('LBWIVGTSYR7RCPN83UDUYFSX36FG761L', 16, 'undefined', 'undefined', 'c962d174df057264b67a5fe7124387a6daa6fb665e0d6f6ebef29987877737b0', 0, 0),
('N7J5EP3VV0WEMOMA13T2QPVV302UWU2F', 10, 'admin9', 'Admin ', 'a', 1, 0),
('OP50JPR6OY8XEU5RNIM7TJBHWYRCDNTK', 12, 'admin13', 'Admin ', 'a', 1, 0),
('RDGJHTEAPKH4PBLTBDWL8GBSK0BYOITQ', 11, 'admin11', 'Admin ', 'a', 1, 0),
('TFPGRBCAXBVWQBFQUGPX8SXPRMYX64XK', 8, 'admin8', 'Admin ', 'a', 1, 0),
('VX5B3PN2CO4A2ELG3FQDQW51MUFQMJAX', 15, 'admin77', 'Admin ', 'adminpassword', 1, 0),
('WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83', 1, 'admin', 'Admin  Name', '3eb1eb1a65a610cbe162f557569352e242a7e2db10d61605cb66c0fe53dfb6c0', 1, 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`taskid`),
  ADD UNIQUE KEY `taskautoinc` (`taskautoinc`),
  ADD KEY `tasks_userid_fk` (`userid`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`testid`),
  ADD UNIQUE KEY `testautoinc` (`testautoinc`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `userautoinc` (`userautoinc`),
  ADD UNIQUE KEY `userlogin` (`userlogin`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `tasks`
--
ALTER TABLE `tasks`
  MODIFY `taskautoinc` int(45) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT dla tabeli `tests`
--
ALTER TABLE `tests`
  MODIFY `testautoinc` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `userautoinc` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_userid_fk` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE NO ACTION ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
