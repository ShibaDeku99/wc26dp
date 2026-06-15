// ============================================
// World Cup 2026 - Official Open API Service
// Uses https://worldcup26.ir
// ============================================

import type { Team, Match, MatchStatus, Standing, MatchDetail, MatchEvent, Group } from '@/types/football';
import { FlashscoreScraper } from './flashscore-scraper';

const BASE_URL = 'https://worldcup26.ir';

// Internal caching to avoid hitting the API too much within a single request cycle
let teamsCache: any[] | null = null;
let stadiumsCache: any[] | null = null;

async function fetchRaw(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`[WorldCup26 API] Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

export async function fetchTeamsData() {
  if (teamsCache) return teamsCache;
  const data = await fetchRaw('/get/teams');
  if (data?.teams) {
    teamsCache = data.teams;
    return data.teams;
  }
  return [];
}

export async function fetchStadiumsData() {
  if (stadiumsCache) return stadiumsCache;
  const data = await fetchRaw('/get/stadiums');
  if (data?.stadiums) {
    stadiumsCache = data.stadiums;
    return data.stadiums;
  }
  return [];
}

export async function fetchFixtures(): Promise<Match[]> {
  const [gamesData, teams, stadiums] = await Promise.all([
    fetchRaw('/get/games'),
    fetchTeamsData(),
    fetchStadiumsData()
  ]);

  let zafMatchesData: any[] = [];
  const apiKey = process.env.ZAFRONIX_API_KEY;
  if (apiKey && apiKey !== 'your_zafronix_api_key_here') {
    try {
      const zafRes = await fetch('https://api.zafronix.com/fifa/worldcup/v1/matches?year=2026', {
        headers: { 'X-API-Key': apiKey },
        next: { revalidate: 60 }
      });
      if (zafRes.ok) {
        const json = await zafRes.json();
        zafMatchesData = json.data || [];
      }
    } catch (e) {
      console.error('Failed to fetch bulk Zafronix matches:', e);
    }
  }

  if (!gamesData?.games) return [];

  const teamMap = new Map(teams.map((t: any) => [String(t.id), t]));
  const stadiumMap = new Map(stadiums.map((s: any) => [String(s.id), s]));
  const zafStadiumMap = new Map(zafMatchesData.map((m: any) => {
    const parsedId = m.id.split('-')[1];
    
    let weatherStr = undefined;
    if (m.weather) {
      weatherStr = `${m.weather.tempC}°C, Humidity: ${m.weather.humidityPct}%, Wind: ${m.weather.windKmh} km/h`;
    }
    
    let attendanceStr = undefined;
    if (m.attendance) {
      attendanceStr = m.attendance.toLocaleString();
    }
    
    return [String(parseInt(parsedId || '0')), { 
      venue: m.stadium, 
      city: m.city,
      weather: weatherStr,
      attendance: attendanceStr
    }];
  }));

  return gamesData.games.map((game: any): Match => {
    const homeTeamRaw: any = teamMap.get(String(game.home_team_id)) || {};
    const awayTeamRaw: any = teamMap.get(String(game.away_team_id)) || {};
    const stadium: any = stadiumMap.get(String(game.stadium_id));
    const zafOverride = zafStadiumMap.get(String(game.id));

    let status: MatchStatus = 'scheduled';
    if (game.finished === 'TRUE') {
      status = 'finished';
    } else {
      // If time_elapsed is notstarted but the current time has passed the match time,
      // it might be live or finished. We can check the difference.
      if (game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished') {
        status = 'live';
      }
    }

    let homeScore = null;
    if (game.home_score && game.home_score !== 'null') {
      homeScore = parseInt(game.home_score);
    }

    let awayScore = null;
    if (game.away_score && game.away_score !== 'null') {
      awayScore = parseInt(game.away_score);
    }

    // Convert MM/DD/YYYY HH:mm to ISO 8601 with timezone offset
    let isoDate = game.local_date;
    if (game.local_date && game.local_date.includes('/')) {
      const [datePart, timePart] = game.local_date.split(' ');
      if (datePart && timePart) {
        const [mm, dd, yyyy] = datePart.split('/');
        
        // Determine UTC offset based on host city (during June/July)
        let offset = -4; // Default EDT (New York, Atlanta, Miami, Toronto, Boston, Philadelphia)
        if (stadium) {
          const city = stadium.city_en?.toLowerCase() || '';
          if (city.includes('vancouver') || city.includes('seattle') || city.includes('francisco') || city.includes('angeles') || city.includes('santa clara') || city.includes('inglewood')) {
            offset = -7; // PDT
          } else if (city.includes('guadalajara') || city.includes('mexico') || city.includes('monterrey')) {
            offset = -6; // CST (Mexico no longer uses DST)
          } else if (city.includes('dallas') || city.includes('houston') || city.includes('kansas') || city.includes('arlington')) {
            offset = -5; // CDT
          }
        }
        
        const offsetString = offset < 0 ? `-${String(Math.abs(offset)).padStart(2, '0')}:00` : `+${String(offset).padStart(2, '0')}:00`;
        isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${timePart}:00${offsetString}`;
      }
    }
    const matchTime = new Date(isoDate).getTime();
    let now = new Date().getTime();
    
    // Fix for Vercel/Production servers running in 2024: Simulating 2026 time
    if (new Date().getFullYear() < 2026) {
      const timeOffset = new Date('2026-06-14T00:00:00Z').getTime() - new Date('2024-06-14T00:00:00Z').getTime();
      now += timeOffset;
    }
    
    const elapsedMs = now - matchTime;
    
    // Auto-fix Status if API is lagging
    if (status !== 'finished') {
      if (elapsedMs > 115 * 60 * 1000) {
        // More than 115 minutes passed -> Force Finished
        status = 'finished';
      } else if (elapsedMs > 0 && elapsedMs <= 115 * 60 * 1000) {
        // Currently playing -> Force Live
        status = 'live';
      }
    }

    const homeTeamName = game.home_team_name_en || homeTeamRaw.name_en || 'TBD';
    const awayTeamName = game.away_team_name_en || awayTeamRaw.name_en || 'TBD';

    return {
      id: String(game.id),
      homeTeam: {
        id: String(game.home_team_id),
        name: homeTeamName,
        code: homeTeamRaw.fifa_code || homeTeamName.substring(0, 3).toUpperCase(),
        flag: homeTeamRaw.flag || '',
        group: game.group,
      },
      awayTeam: {
        id: String(game.away_team_id),
        name: awayTeamName,
        code: awayTeamRaw.fifa_code || awayTeamName.substring(0, 3).toUpperCase(),
        flag: awayTeamRaw.flag || '',
        group: game.group,
      },
      homeScore,
      awayScore,
      date: isoDate,
      venue: zafOverride ? zafOverride.venue : (stadium ? stadium.name_en : 'TBD Venue'),
      city: zafOverride ? zafOverride.city : (stadium ? stadium.city_en : 'TBD City'),
      weather: zafOverride?.weather,
      attendance: zafOverride?.attendance,
      group: `Group ${game.group}`,
      round: game.type === 'group' ? `Matchday ${game.matchday}` : game.type,
      status,
    };
  });
}

export async function fetchStandings(): Promise<Record<string, Standing[]>> {
  const [groupsData, teams, matches] = await Promise.all([
    fetchRaw('/get/groups'),
    fetchTeamsData(),
    fetchFixtures() // Call fetchFixtures to get real-time scores
  ]);

  if (!groupsData?.groups) return {};

  const teamMap = new Map(teams.map((t: any) => [String(t.id), t]));
  const result: Record<string, Standing[]> = {};

  // First, initialize the standings from the groups structure with 0s
  for (const group of groupsData.groups) {
    const groupName = `Group ${group.name}`;
    result[groupName] = group.teams.map((t: any): Standing => {
      const teamRaw: any = teamMap.get(String(t.team_id)) || {};
      return {
        team: {
          id: String(t.team_id),
          name: teamRaw.name_en || 'TBD',
          code: teamRaw.fifa_code || 'TBD',
          flag: teamRaw.flag || '',
          group: group.name,
        },
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      };
    });
  }

  // Then, apply real-time match results to the standings
  if (matches && matches.length > 0) {
    matches.forEach(match => {
      // Only process group stage matches that have started
      if (match.round.startsWith('Matchday') && (match.status === 'live' || match.status === 'finished')) {
        const groupName = match.group;
        if (!groupName || !result[groupName]) return;

        const homeStanding = result[groupName].find(s => s.team.id === match.homeTeam.id);
        const awayStanding = result[groupName].find(s => s.team.id === match.awayTeam.id);

        if (homeStanding && awayStanding && match.homeScore !== null && match.awayScore !== null) {
          // Update played count
          homeStanding.played += 1;
          awayStanding.played += 1;

          // Update goals
          homeStanding.goalsFor += match.homeScore;
          homeStanding.goalsAgainst += match.awayScore;
          awayStanding.goalsFor += match.awayScore;
          awayStanding.goalsAgainst += match.homeScore;

          // Update goal difference
          homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
          awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;

          // Update points and W/D/L
          if (match.homeScore > match.awayScore) {
            homeStanding.won += 1;
            homeStanding.points += 3;
            awayStanding.lost += 1;
          } else if (match.homeScore < match.awayScore) {
            awayStanding.won += 1;
            awayStanding.points += 3;
            homeStanding.lost += 1;
          } else {
            homeStanding.drawn += 1;
            awayStanding.drawn += 1;
            homeStanding.points += 1;
            awayStanding.points += 1;
          }
        }
      }
    });
  }

  // Finally, sort each group
  for (const groupName in result) {
    result[groupName].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }

  return result;
}

export async function fetchMatchDetail(id: string): Promise<MatchDetail | null> {
  const fixtures = await fetchFixtures();
  const match = fixtures.find(f => f.id === id);
  if (!match) return null;

  // Fetch from Zafronix
  let zafronixData = null;
  const apiKey = process.env.ZAFRONIX_API_KEY;
  if (apiKey && apiKey !== 'your_zafronix_api_key_here') {
    const zafId = `2026-${id.padStart(3, '0')}`;
    try {
      const res = await fetch(`https://api.zafronix.com/fifa/worldcup/v1/matches/${zafId}`, {
        headers: { 'X-API-Key': apiKey },
        next: { revalidate: 60 }
      });
      if (res.ok) {
        const json = await res.json();
        // The endpoint returns the match object directly at the root, or wrapped in 'data'
        zafronixData = json.data ? json.data : json;
      }
    } catch(e) { console.error('Zafronix error', e) }
  }

  let events: MatchEvent[] = [];
  let statistics: any = [];
  let lineups: any = null;
  let attendance: string | undefined;
  let weather: string | undefined;
  let referee: string | undefined;
  
  if (zafronixData) {
    if (zafronixData.stadium) {
      match.venue = zafronixData.stadium;
      match.city = zafronixData.city || match.city;
    }
    
    let eventId = 1;

    if (zafronixData.goals) {
      zafronixData.goals.forEach((g: any) => {
        events.push({
          id: `evt-${eventId++}`,
          time: g.minute,
          extraTime: undefined,
          team: g.team === 'home' ? 'home' : 'away',
          player: g.scorer,
          assist: undefined,
          type: 'goal',
          detail: 'Goal'
        });
      });
    }

    if (zafronixData.cards) {
      zafronixData.cards.forEach((c: any) => {
        events.push({
          id: `evt-${eventId++}`,
          time: c.minute,
          extraTime: c.addedMinute || undefined,
          team: c.team === 'home' ? 'home' : 'away',
          player: c.player,
          assist: undefined,
          type: c.color === 'yellow' ? 'yellow_card' : 'red_card',
          detail: c.color === 'yellow' ? 'Yellow Card' : 'Red Card'
        });
      });
    }

    if (zafronixData.substitutions) {
      zafronixData.substitutions.forEach((s: any) => {
        events.push({
          id: `evt-${eventId++}`,
          time: s.minute,
          extraTime: undefined,
          team: s.team === 'home' ? 'home' : 'away',
          player: s.on,
          assist: s.off,
          type: 'substitution',
          detail: 'Substitution'
        });
      });
    }

    events.sort((a, b) => a.time - b.time);

    if (zafronixData.attendance) attendance = zafronixData.attendance.toLocaleString();
    if (zafronixData.weather) {
      weather = `${zafronixData.weather.tempC}°C, Humidity: ${zafronixData.weather.humidityPct}%, Wind: ${zafronixData.weather.windKmh} km/h`;
    }
    if (zafronixData.referee) referee = zafronixData.referee.name;
    
    // For lineups, the type `MatchDetail` expects `lineups?: { home: string[]; away: string[]; };`
    // Wait, let's check `src/types/football.ts`
    // It says `lineups?: { home: string[]; away: string[]; };`
    if (zafronixData.lineups) {
      const homePlayers = zafronixData.lineups.home?.map((p:any) => `${p.number} - ${p.player} (${p.position})`) || [];
      const awayPlayers = zafronixData.lineups.away?.map((p:any) => `${p.number} - ${p.player} (${p.position})`) || [];
      lineups = { home: homePlayers, away: awayPlayers } as any;
    }
  }

  // Only crawl Match Events and Lineups if the match is live or finished
  if (match.status !== 'scheduled') {
    // Use Sofascore RapidAPI for both LIVE and FINISHED matches to ensure events show up
    if (match.status === 'live' || match.status === 'finished') {
      try {
        // AUTO FETCH ID of the ongoing match pair!
        let liveMatchId = await FlashscoreScraper.autoFetchMatchId(match.homeTeam.name, match.awayTeam.name);
        
        if (liveMatchId) {
          // Optimize: Run RapidAPI call concurrently to reduce latency and increase cache to 60s to limit API usage
        const fetchOpts = {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'sofascore6.p.rapidapi.com',
            'x-rapidapi-key': '6091cc7786mshb10d529b299ebeep114844jsne1d9933403f8'
          },
          next: { revalidate: 60 } // Hạn chế call API nhiều lần bằng cách cache 60s
        };

        const incidentsRes = await fetch(`https://sofascore6.p.rapidapi.com/api/sofascore/v1/match/incidents?match_id=${liveMatchId}`, fetchOpts);


        if (incidentsRes.ok) {
          const incidentsJson = await incidentsRes.json();
          if (Array.isArray(incidentsJson)) {
            const parsedEvents: MatchEvent[] = [];
            incidentsJson.forEach((incident: any) => {
              const team = incident.isHome ? 'home' : 'away';
              const time = incident.time;
              const extraTime = incident.addedTime ? incident.addedTime : undefined;
              
              if (incident.incidentType === 'goal') {
                parsedEvents.push({
                  id: String(incident.id || Math.random()),
                  type: 'goal',
                  time,
                  extraTime,
                  team,
                  player: incident.player?.name || 'Unknown',
                  assist: incident.assist1?.name,
                  detail: `Goal scored by ${incident.player?.name || 'Unknown'}`
                });
              } else if (incident.incidentType === 'card') {
                const cardType = incident.incidentClass === 'yellow' ? 'yellow_card' : 'red_card';
                parsedEvents.push({
                  id: String(incident.id || Math.random()),
                  type: cardType,
                  time,
                  extraTime,
                  team,
                  player: incident.player?.name || 'Unknown',
                  detail: `${incident.incidentClass === 'yellow' ? 'Yellow' : 'Red'} card for ${incident.player?.name || 'Unknown'}`
                });
              } else if (incident.incidentType === 'substitution') {
                parsedEvents.push({
                  id: String(incident.id || Math.random()),
                  type: 'substitution',
                  time,
                  extraTime,
                  team,
                  player: incident.playerIn?.name || 'Unknown',
                  detail: `In: ${incident.playerIn?.name || 'Unknown'} | Out: ${incident.playerOut?.name || 'Unknown'}`
                });
              }
            });
            // Reverse so newest is first
            events = parsedEvents.sort((a, b) => b.time - a.time);
          }
        }
        } // close if (liveMatchId)
      } catch (e) {
        console.error('Failed to fetch from Sofascore RapidAPI', e);
      }
    }

    return {
      ...match,
      events,
      ...(lineups ? { lineups } : {}), // Zafronix lineups
      attendance,
      weather,
      referee
    };
  }

  return {
    ...match,
    events,
    ...(lineups ? { lineups } : {}),
    attendance,
    weather,
    referee
  };
}

export async function fetchGroups(): Promise<Group[]> {
  const teams = await fetchTeamsData();
  const groupMap = new Map<string, Team[]>();

  teams.forEach((t: any) => {
    const group = t.groups;
    if (!group) return;
    if (!groupMap.has(group)) groupMap.set(group, []);
    groupMap.get(group)!.push({
      id: String(t.id),
      name: t.name_en,
      code: t.fifa_code || t.name_en.substring(0, 3).toUpperCase(),
      flag: t.flag || '',
      group: group,
    });
  });

  return Array.from(groupMap.keys())
    .sort()
    .map(name => ({
      name: `Group ${name}`,
      teams: groupMap.get(name)!,
    }));
}

export function isApiConfigured(): boolean {
  return true; // worldcup26.ir is free and requires no key
}
