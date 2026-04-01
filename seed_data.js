/**
 * Seed data - World Cup 2026 official teams and group stage matches
 * Based on the FIFA World Cup 2026 Final Draw (December 5, 2025)
 */
const { getDb, initDb } = require('./database');
const { hashPassword } = require('./auth');

// Official 48 teams from FIFA World Cup 2026 draw
// (name, code, group, flag_emoji)
const TEAMS = [
  // Group A - Mexico City / Guadalajara
  ["México", "MEX", "A", "🇲🇽"],
  ["Corea del Sur", "KOR", "A", "🇰🇷"],
  ["Sudáfrica", "RSA", "A", "🇿🇦"],
  ["UEFA Playoff D", "UPD", "A", "🏳️"],

  // Group B - Toronto / Vancouver
  ["Canadá", "CAN", "B", "🇨🇦"],
  ["Suiza", "SUI", "B", "🇨🇭"],
  ["Qatar", "QAT", "B", "🇶🇦"],
  ["UEFA Playoff A", "UPA", "B", "🏳️"],

  // Group C - Various US cities
  ["Brasil", "BRA", "C", "🇧🇷"],
  ["Marruecos", "MAR", "C", "🇲🇦"],
  ["Haití", "HAI", "C", "🇭🇹"],
  ["Escocia", "SCO", "C", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],

  // Group D - Los Angeles / other US cities
  ["Estados Unidos", "USA", "D", "🇺🇸"],
  ["Paraguay", "PAR", "D", "🇵🇾"],
  ["Australia", "AUS", "D", "🇦🇺"],
  ["UEFA Playoff C", "UPC", "D", "🏳️"],

  // Group E - Various US cities
  ["Alemania", "GER", "E", "🇩🇪"],
  ["Curazao", "CUW", "E", "🇨🇼"],
  ["Costa de Marfil", "CIV", "E", "🇨🇮"],
  ["Ecuador", "ECU", "E", "🇪🇨"],

  // Group F - Various cities
  ["Países Bajos", "NED", "F", "🇳🇱"],
  ["Japón", "JPN", "F", "🇯🇵"],
  ["UEFA Playoff B", "UPB", "F", "🏳️"],
  ["Túnez", "TUN", "F", "🇹🇳"],

  // Group G - Various US cities
  ["Bélgica", "BEL", "G", "🇧🇪"],
  ["Egipto", "EGY", "G", "🇪🇬"],
  ["Irán", "IRN", "G", "🇮🇷"],
  ["Nueva Zelanda", "NZL", "G", "🇳🇿"],

  // Group H - Various cities
  ["España", "ESP", "H", "🇪🇸"],
  ["Cabo Verde", "CPV", "H", "🇨🇻"],
  ["Arabia Saudita", "KSA", "H", "🇸🇦"],
  ["Uruguay", "URU", "H", "🇺🇾"],

  // Group I - Various cities
  ["Francia", "FRA", "I", "🇫🇷"],
  ["Senegal", "SEN", "I", "🇸🇳"],
  ["Playoff Intercon. 2", "IC2", "I", "🏳️"],
  ["Noruega", "NOR", "I", "🇳🇴"],

  // Group J - Various US cities
  ["Argentina", "ARG", "J", "🇦🇷"],
  ["Argelia", "ALG", "J", "🇩🇿"],
  ["Austria", "AUT", "J", "🇦🇹"],
  ["Jordania", "JOR", "J", "🇯🇴"],

  // Group K - Various cities
  ["Portugal", "POR", "K", "🇵🇹"],
  ["Playoff Intercon. 1", "IC1", "K", "🏳️"],
  ["Uzbekistán", "UZB", "K", "🇺🇿"],
  ["Colombia", "COL", "K", "🇨🇴"],

  // Group L - Various US cities
  ["Inglaterra", "ENG", "L", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"],
  ["Croatia", "CRO", "L", "🇭🇷"],
  ["Ghana", "GHA", "L", "🇬🇭"],
  ["Panamá", "PAN", "L", "🇵🇦"]
];

// Official group stage match schedule
const MATCHES = [
  // === Matchday 1 (June 11-14) ===
  // June 11
  ["A", 0, 2, "2026-06-11", "12:00", "Ciudad de México"],
  ["A", 1, 3, "2026-06-11", "21:00", "Guadalajara"],

  // June 12
  ["B", 0, 3, "2026-06-12", "12:00", "Toronto"],
  ["D", 0, 2, "2026-06-12", "15:00", "Los Ángeles"],
  ["C", 0, 2, "2026-06-12", "18:00", "Houston"],
  ["B", 1, 2, "2026-06-12", "21:00", "Vancouver"],

  // June 13
  ["E", 0, 1, "2026-06-13", "12:00", "Atlanta"],
  ["C", 1, 3, "2026-06-13", "15:00", "Filadelfia"],
  ["D", 2, 3, "2026-06-13", "18:00", "Miami"],
  ["E", 2, 3, "2026-06-13", "21:00", "Dallas"],

  // June 14
  ["F", 0, 3, "2026-06-14", "12:00", "Boston"],
  ["G", 0, 3, "2026-06-14", "15:00", "Seattle"],
  ["F", 1, 2, "2026-06-14", "18:00", "Kansas City"],
  ["G", 1, 2, "2026-06-14", "21:00", "San Francisco"],

  // June 15
  ["H", 0, 1, "2026-06-15", "12:00", "Nueva York"],
  ["I", 0, 1, "2026-06-15", "15:00", "Dallas"],
  ["H", 2, 3, "2026-06-15", "18:00", "Monterrey"],
  ["I", 2, 3, "2026-06-15", "21:00", "Miami"],

  // June 16
  ["J", 0, 3, "2026-06-16", "12:00", "Atlanta"],
  ["K", 0, 1, "2026-06-16", "15:00", "Houston"],
  ["J", 1, 2, "2026-06-16", "18:00", "Filadelfia"],
  ["K", 2, 3, "2026-06-16", "21:00", "Seattle"],

  // June 17
  ["L", 0, 2, "2026-06-17", "12:00", "Boston"],
  ["L", 1, 3, "2026-06-17", "18:00", "Kansas City"],

  // === Matchday 2 (June 18-21) ===
  // June 18
  ["A", 3, 2, "2026-06-18", "12:00", "Atlanta"],
  ["A", 0, 1, "2026-06-18", "22:00", "Guadalajara"],

  // June 19
  ["B", 3, 2, "2026-06-19", "12:00", "Toronto"],
  ["D", 0, 3, "2026-06-19", "15:00", "Nueva York"],
  ["C", 0, 1, "2026-06-19", "18:00", "Los Ángeles"],
  ["B", 0, 1, "2026-06-19", "21:00", "Vancouver"],

  // June 20
  ["D", 1, 2, "2026-06-20", "12:00", "Miami"],
  ["E", 0, 2, "2026-06-20", "15:00", "Dallas"],
  ["C", 2, 3, "2026-06-20", "18:00", "San Francisco"],
  ["E", 1, 3, "2026-06-20", "21:00", "Filadelfia"],

  // June 21
  ["F", 0, 2, "2026-06-21", "12:00", "Houston"],
  ["G", 0, 2, "2026-06-21", "15:00", "Seattle"],
  ["F", 1, 3, "2026-06-21", "18:00", "Kansas City"],
  ["G", 1, 3, "2026-06-21", "21:00", "Boston"],

  // June 22
  ["H", 0, 2, "2026-06-22", "12:00", "Monterrey"],
  ["I", 0, 2, "2026-06-22", "15:00", "Miami"],
  ["H", 1, 3, "2026-06-22", "18:00", "Nueva York"],
  ["I", 1, 3, "2026-06-22", "21:00", "Atlanta"],

  // June 23
  ["J", 0, 2, "2026-06-23", "12:00", "Filadelfia"],
  ["K", 0, 2, "2026-06-23", "15:00", "Dallas"],
  ["J", 1, 3, "2026-06-23", "18:00", "San Francisco"],
  ["K", 1, 3, "2026-06-23", "21:00", "Seattle"],

  // June 24
  ["L", 0, 1, "2026-06-24", "15:00", "Boston"],
  ["L", 2, 3, "2026-06-24", "18:00", "Houston"],

  // === Matchday 3 (June 25-27) ===
  // June 25
  ["A", 2, 1, "2026-06-25", "18:00", "Guadalajara"],
  ["A", 3, 0, "2026-06-25", "18:00", "Ciudad de México"],
  ["B", 2, 0, "2026-06-25", "21:00", "Toronto"],
  ["B", 3, 1, "2026-06-25", "21:00", "Vancouver"],

  // June 26
  ["C", 2, 1, "2026-06-26", "15:00", "Houston"],
  ["C", 3, 0, "2026-06-26", "15:00", "Los Ángeles"],
  ["D", 2, 0, "2026-06-26", "18:00", "Nueva York"],
  ["D", 3, 1, "2026-06-26", "18:00", "Miami"],
  ["E", 1, 2, "2026-06-26", "21:00", "Dallas"],
  ["E", 3, 0, "2026-06-26", "21:00", "Atlanta"],

  // June 27
  ["F", 3, 1, "2026-06-27", "12:00", "Kansas City"],
  ["F", 2, 0, "2026-06-27", "12:00", "Boston"],
  ["G", 2, 0, "2026-06-27", "15:00", "San Francisco"],
  ["G", 3, 1, "2026-06-27", "15:00", "Seattle"],
  ["H", 3, 0, "2026-06-27", "18:00", "Monterrey"],
  ["H", 1, 2, "2026-06-27", "18:00", "Nueva York"],
  ["I", 3, 0, "2026-06-27", "21:00", "Dallas"],
  ["I", 1, 2, "2026-06-27", "21:00", "Miami"],

  // June 28 (last group matches)
  ["J", 3, 1, "2026-06-28", "12:00", "San Francisco"],
  ["J", 2, 0, "2026-06-28", "12:00", "Atlanta"],
  ["K", 3, 0, "2026-06-28", "15:00", "Houston"],
  ["K", 1, 2, "2026-06-28", "15:00", "Seattle"],
  ["L", 3, 0, "2026-06-28", "18:00", "Boston"],
  ["L", 2, 1, "2026-06-28", "18:00", "Kansas City"]
];

/**
 * Seed teams and matches (preserves users and leagues)
 */
function seedTeamsAndMatches(db) {
  // Insert teams
  const insertTeam = db.prepare('INSERT INTO teams (name, code, group_letter, flag) VALUES (?, ?, ?, ?)');
  for (const [name, code, group, flag] of TEAMS) {
    insertTeam.run(name, code, group, flag);
  }

  // Build team lookup
  const teams = db.prepare('SELECT id, name, code, group_letter, flag FROM teams ORDER BY id').all();
  const groups = {};
  for (const team of teams) {
    if (!groups[team.group_letter]) {
      groups[team.group_letter] = [];
    }
    groups[team.group_letter].push(team);
  }

  // Insert official matches
  const insertMatch = db.prepare(`
    INSERT INTO matches (home_team_id, away_team_id, group_letter, phase, match_date, match_time, match_day)
    VALUES (?, ?, ?, 'Fase de Grupos', ?, ?, ?)
  `);

  let matchDayNum = 1;
  let prevDate = null;

  for (const [groupLetter, homeIdx, awayIdx, matchDate, matchTime] of MATCHES) {
    const teamList = groups[groupLetter];
    const home = teamList[homeIdx];
    const away = teamList[awayIdx];

    if (matchDate !== prevDate) {
      matchDayNum += 1;
      prevDate = matchDate;
    }

    insertMatch.run(home.id, away.id, groupLetter, matchDate, matchTime, matchDayNum);
  }

  return MATCHES.length;
}

/**
 * Seed users and leagues (only for first-time setup)
 */
function seedUsersAndLeagues(db) {
  // Create admin user
  const [pwHash, salt] = hashPassword('admin123');
  const insertUser = db.prepare(`
    INSERT INTO users (email, password_hash, salt, nickname, first_name, last_name, phone, contact_type, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const adminResult = insertUser.run(
    'admin@mundial2026.com', pwHash, salt, 'AdminGral', 'Carlos', 'García',
    '+52 55 1234 5678', 'whatsapp', 'admin'
  );
  const adminId = adminResult.lastInsertRowid;

  // Create demo league admin
  const [pwHash2, salt2] = hashPassword('liga123');
  const leagueAdminResult = insertUser.run(
    'liga@mundial2026.com', pwHash2, salt2, 'LigaAdmin', 'María', 'López',
    '+52 55 8765 4321', 'whatsapp', 'league_admin'
  );
  const leagueAdminId = leagueAdminResult.lastInsertRowid;

  // Create demo players
  const demoPlayers = [
    ['player1@demo.com', 'player1', 'ElCrack', 'Antonio', 'Morales', '+52 55 1111 2222', 'telegram'],
    ['player2@demo.com', 'player2', 'PedroGol', 'Pedro', 'Ramírez', '+52 55 3333 4444', 'whatsapp'],
    ['player3@demo.com', 'player3', 'AnaBR', 'Ana', 'Hernández', '+52 55 5555 6666', 'telegram'],
    ['player4@demo.com', 'player4', 'LuisMX', 'Luis', 'Torres', '+52 55 7777 8888', 'whatsapp']
  C!