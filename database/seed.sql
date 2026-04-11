-- database/seed.sql
-- Populating the database with test data

-- Users (password for everyone: "password123")
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@football.com', '$2b$12$Dk0ttuDKjuF1cUbM1H9NueJPTCN82wZNlWIzDfrMnaPu266Rg/T1y', 'admin'),
('manager1', 'manager1@football.com', '$2b$12$Dk0ttuDKjuF1cUbM1H9NueJPTCN82wZNlWIzDfrMnaPu266Rg/T1y', 'manager'),
('manager2', 'manager2@football.com', '$2b$12$Dk0ttuDKjuF1cUbM1H9NueJPTCN82wZNlWIzDfrMnaPu266Rg/T1y', 'manager');

-- Stadiums
INSERT INTO stadiums (name, city, capacity) VALUES
('Old Trafford', 'Manchester', 74310),
('Santiago Bernabeu', 'Madrid', 81044),
('My Dinh', 'Hanoi', 40192),
('Thong Nhat', 'Ho Chi Minh City', 15000),
('Camp Nou', 'Barcelona', 99354),
('San Siro', 'Milan', 75923),
('Wembley', 'London', 90000),
('Allianz Arena', 'Munich', 75000),
('Anfield', 'Liverpool', 61276),
('Emirates Stadium', 'London', 60704);

-- Teams with last season's places
INSERT INTO teams (name, city, coach, last_season_place) VALUES
('Manchester United', 'Manchester', 'Erik ten Hag', 1),
('Real Madrid', 'Madrid', 'Carlo Ancelotti', 2),
('Vietnam National Team', 'Hanoi', 'Philippe Troussier', 3),
('Barcelona', 'Barcelona', 'Xavi Hernandez', 4),
('AC Milan', 'Milan', 'Stefano Pioli', 5),
('Hanoi FC', 'Hanoi', 'Daiki Iwamasa', 6),
('Bayern Munich', 'Munich', 'Thomas Tuchel', 7),
('Liverpool', 'Liverpool', 'Jurgen Klopp', 8),
('Arsenal', 'London', 'Mikel Arteta', 9),
('Chelsea', 'London', 'Mauricio Pochettino', 10),
('Juventus', 'Turin', 'Massimiliano Allegri', 11),
('Inter Milan', 'Milan', 'Simone Inzaghi', 12),
('Hoang Anh Gia Lai', 'Pleiku', 'Kiatisuk Senamuang', 13),
('PSG', 'Paris', 'Luis Enrique', 14),
('Manchester City', 'Manchester', 'Pep Guardiola', 15),
('Viettel FC', 'Hanoi', 'Nguyen Duc Thang', 16);

-- Players for teams
INSERT INTO players (team_id, first_name, last_name, age, jersey_number, position) VALUES
-- Manchester United
(1, 'Marcus', 'Rashford', 26, 10, 'FWD'),
(1, 'Bruno', 'Fernandes', 29, 8, 'MID'),
(1, 'Andre', 'Onana', 27, 24, 'GK'),
(1, 'Luke', 'Shaw', 28, 23, 'DEF'),
(1, 'Alejandro', 'Garnacho', 19, 17, 'FWD'),

-- Real Madrid
(2, 'Cristiano', 'Ronaldo', 39, 7, 'FWD'),
(2, 'Jude', 'Bellingham', 20, 5, 'MID'),
(2, 'Thibaut', 'Courtois', 31, 1, 'GK'),
(2, 'Vinicius', 'Junior', 23, 11, 'FWD'),
(2, 'Antonio', 'Rudiger', 31, 22, 'DEF'),

-- Vietnam National Team
(3, 'Nguyen', 'Quang Hai', 27, 19, 'MID'),
(3, 'Dang', 'Van Lam', 30, 23, 'GK'),
(3, 'Do', 'Hung Dung', 30, 8, 'MID'),
(3, 'Pham', 'Tuan Hai', 26, 10, 'FWD'),
(3, 'Que', 'Ngoc Hai', 30, 3, 'DEF'),

-- Barcelona
(4, 'Lionel', 'Messi', 36, 10, 'FWD'),
(4, 'Marc-Andre', 'ter Stegen', 31, 1, 'GK'),
(4, 'Frenkie', 'de Jong', 26, 21, 'MID'),
(4, 'Ronald', 'Araujo', 25, 4, 'DEF'),
(4, 'Lamine', 'Yamal', 16, 27, 'FWD'),

-- AC Milan
(5, 'Rafael', 'Leao', 24, 10, 'FWD'),
(5, 'Mike', 'Maignan', 28, 16, 'GK'),
(5, 'Theo', 'Hernandez', 26, 19, 'DEF'),
(5, 'Christian', 'Pulisic', 25, 11, 'MID'),
(5, 'Olivier', 'Giroud', 37, 9, 'FWD'),

-- Hanoi FC
(6, 'Nguyen', 'Van Quyet', 32, 10, 'FWD'),
(6, 'Bui', 'Tien Dung', 27, 1, 'GK'),
(6, 'Do', 'Duy Manh', 27, 2, 'DEF'),
(6, 'Pham', 'Xuan Manh', 28, 7, 'DEF'),
(6, 'Joel', 'Tagueu', 30, 95, 'FWD'),

-- Bayern Munich
(7, 'Harry', 'Kane', 30, 9, 'FWD'),
(7, 'Manuel', 'Neuer', 38, 1, 'GK'),
(7, 'Jamal', 'Musiala', 21, 42, 'MID'),
(7, 'Leroy', 'Sane', 28, 10, 'FWD'),

-- Liverpool
(8, 'Mohamed', 'Salah', 31, 11, 'FWD'),
(8, 'Alisson', 'Becker', 31, 1, 'GK'),
(8, 'Virgil', 'van Dijk', 32, 4, 'DEF'),
(8, 'Trent', 'Alexander-Arnold', 25, 66, 'DEF');

-- Matches (first round of the championship)
INSERT INTO matches (date, home_team_id, away_team_id, stadium_id, status) VALUES
('2024-08-10 19:00:00', 1, 2, 1, 'scheduled'),
('2024-08-10 21:30:00', 3, 4, 3, 'scheduled'),
('2024-08-11 16:00:00', 5, 6, 6, 'scheduled'),
('2024-08-11 18:30:00', 7, 8, 8, 'scheduled'),
('2024-08-11 19:00:00', 9, 10, 10, 'scheduled'),
('2024-08-12 19:00:00', 11, 12, 6, 'scheduled'),
('2024-08-12 21:30:00', 13, 14, 4, 'scheduled'),
('2024-08-13 19:00:00', 15, 16, 7, 'scheduled');

-- Several completed matches with results
INSERT INTO matches (date, home_team_id, away_team_id, stadium_id, home_goals, away_goals, status) VALUES
('2024-07-28 19:00:00', 1, 3, 1, 2, 1, 'finished'),
('2024-07-29 19:00:00', 2, 4, 2, 1, 0, 'finished'),
('2024-07-30 19:00:00', 5, 7, 6, 3, 2, 'finished');

-- Match tickets
INSERT INTO tickets (match_id, category, price) VALUES
(1, 'VIP', 3500.00), (1, 'Standard', 1400.00), (1, 'Economy', 980.00),
(2, 'VIP', 3200.00), (2, 'Standard', 1280.00), (2, 'Economy', 896.00),
(3, 'VIP', 2800.00), (3, 'Standard', 1120.00), (3, 'Economy', 784.00),
(9, 'VIP', 4000.00), (9, 'Standard', 1600.00), (9, 'Economy', 1120.00);

-- Audit log entries
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'CREATE', 'team', 1, 'Created team: Manchester United'),
(1, 'CREATE', 'team', 2, 'Created team: Real Madrid'),
(2, 'CREATE', 'match', 1, 'Created match: Manchester United vs Real Madrid');

-- Additional commands for checking
SELECT 'Database seeded successfully!' as status;