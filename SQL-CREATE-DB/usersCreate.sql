CREATE TABLE `users` (
  `userid` varchar(45) NOT NULL,
  `userautoinc` int(40) NOT NULL,
  `userlogin` varchar(100) NOT NULL,
  `username` varchar(300) NOT NULL,
  `userpassword` varchar(300) NOT NULL,
  `isuseradmin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`userid`, `userautoinc`, `userlogin`, `username`, `userpassword`, `isuseradmin`) VALUES
('WLFE2JGHC7L121CMOMU8G1BVWTQ1NI83', 1, 'admin', 'Admin', 'adminpassword', 1);

--
-- Indeksy dla zrzutów tabel
--

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
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `userautoinc` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;