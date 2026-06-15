
/**
 * Flashscore / Sofascore Scraper Module
 * Integrates RapidAPI API Dojo Sofascore to fetch real match statistics.
 * Since WC 2026 matches haven't occurred, it fetches historical WC matches 
 * as placeholders to showcase the UI with 100% REAL data.
 */
export class FlashscoreScraper {
  private static readonly API_URL = 'https://sofascore.p.rapidapi.com/matches/get-statistics';
  private static readonly GRAPH_API_URL = 'https://sofascore.p.rapidapi.com/matches/get-graph';
  private static readonly LINEUPS_API_URL = 'https://sofascore.p.rapidapi.com/matches/get-lineups';
  // User provided RapidAPI key
  private static readonly RAPID_API_KEY = '6091cc7786mshb10d529b299ebeep114844jsne1d9933403f8';
  
  // Historical WC 2022 match IDs to act as realistic placeholders for WC 2026
  private static readonly PLACEHOLDER_MATCH_IDS = [
    '8897222', // Sample Match
    '10385740', // England vs France (WC 2022) - Has graph & lineups
    '10385742', // Netherlands vs Argentina (WC 2022) - Has graph & lineups
  ];

  // Hàm chuẩn chuẩn theo luồng (Pipeline) bạn yêu cầu:
  // Bước 1: Gọi danh sách trận theo giải đấu -> Bước 2: Bóc ID
  public static async autoFetchMatchId(homeTeam: string, awayTeam: string): Promise<string | null> {
    try {
      // Sử dụng endpoint chuẩn của RapidAPI: tournaments/get-last-matches
      // Truyền đúng tournamentId=16 (World Cup) và seasonId=58210 (WC 2026)
      const listUrl = `https://sofascore.p.rapidapi.com/tournaments/get-last-matches?tournamentId=16&seasonId=58210`;
      
      const res = await fetch(listUrl, {
        headers: {
          'x-rapidapi-host': 'sofascore.p.rapidapi.com',
          'x-rapidapi-key': this.RAPID_API_KEY
        },
        next: { revalidate: 3600 }
      });

      if (!res.ok) return null;
      
      // Do API trả về rỗng nếu chưa có trận đấu scheduled, cần handle parse JSON an toàn
      const text = await res.text();
      if (!text) return null;
      const data = JSON.parse(text);

      const events = data.events || data.matches || [];

      // Hàm chuẩn hóa tên đội (xử lý các trường hợp khác tên gọi)
      const normalize = (name: string) => {
        if (!name) return '';
        let n = name.toLowerCase().trim();
        if (n.includes('korea')) return 'korea';
        if (n.includes('czech')) return 'czech';
        if (n === 'usa' || n === 'united states') return 'usa';
        return n;
      };

      const normHome = normalize(homeTeam);
      const normAway = normalize(awayTeam);

      const match = events.find((e: any) => {
        const eHome = normalize(e.homeTeam?.name);
        const eAway = normalize(e.awayTeam?.name);
        return (eHome.includes(normHome) && eAway.includes(normAway)) ||
               (eHome.includes(normAway) && eAway.includes(normHome));
      });

      return match ? String(match.id) : null;
    } catch (e) {
      console.error('[Flashscore/Sofascore Scraper] Auto-fetch ID failed:', e);
      return null;
    }
  }
}
