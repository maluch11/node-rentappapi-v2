CREATE TABLE `tests` (
  `testid` varchar(64) NOT NULL,
  `testautoinc` int(40) NOT NULL,
  `testname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



--
-- Indeksy dla zrzutów tabel
--

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`testid`);
  ADD UNIQUE KEY `testautoinc` (`testautoinc`);

ALTER TABLE `tests`
  MODIFY `testautoinc` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Zrzut danych tabeli `tests`
--

--INSERT INTO `tests` (`testid`, `testname`) VALUES
--('N1XXI7LINAEWDIMSYT9QK42RXPHW62BU', 'test name updated aaa'),
--('VPI2T2V5E826Y1UR0V0PXLGJQW47XX90', 'test name updated aaa'),
--('X4UHJRIVQK40FX2N44940NIRHXKHCUCU', 'test name updated aaa');