export function getTeamKitColor(teamName: string, isHome: boolean): { bg: string, text: string } {
  const normalize = (name: string) => name.toLowerCase().trim();
  
  const colors: Record<string, { home: string, away: string }> = {
    'argentina': { home: '#74acdf', away: '#4b0082' },
    'algeria': { home: '#ffffff', away: '#22c55e' },
    'australia': { home: '#eab308', away: '#15803d' },
    'austria': { home: '#ef4444', away: '#ffffff' },
    'belgium': { home: '#e30613', away: '#ffffff' },
    'bosnia and herzegovina': { home: '#002f6c', away: '#ffffff' },
    'brazil': { home: '#ffdc02', away: '#192e5b' },
    'canada': { home: '#ff0000', away: '#ffffff' },
    'cape verde': { home: '#003893', away: '#ffffff' },
    'colombia': { home: '#fcd116', away: '#0f172a' },
    'croatia': { home: '#ffffff', away: '#1d4ed8' },
    'curacao': { home: '#002b7f', away: '#ffffff' },
    'czech republic': { home: '#ed1b24', away: '#ffffff' },
    'dr congo': { home: '#007fff', away: '#ffffff' },
    'ecuador': { home: '#ffdd00', away: '#00205b' },
    'egypt': { home: '#ce1126', away: '#ffffff' },
    'england': { home: '#ffffff', away: '#cf081f' },
    'france': { home: '#002395', away: '#ffffff' },
    'germany': { home: '#ffffff', away: '#171717' },
    'ghana': { home: '#ffffff', away: '#ce1126' },
    'haiti': { home: '#00209f', away: '#ffffff' },
    'iran': { home: '#ffffff', away: '#da0000' },
    'iraq': { home: '#007a3d', away: '#ffffff' },
    'ivory coast': { home: '#f77f00', away: '#ffffff' },
    'japan': { home: '#000555', away: '#fefce8' },
    'jordan': { home: '#ce1126', away: '#ffffff' },
    'mexico': { home: '#006847', away: '#ffffff' },
    'morocco': { home: '#c1272d', away: '#ffffff' },
    'netherlands': { home: '#f36c21', away: '#ffffff' },
    'new zealand': { home: '#ffffff', away: '#171717' },
    'norway': { home: '#ba0c2f', away: '#ffffff' },
    'panama': { home: '#da291c', away: '#ffffff' },
    'paraguay': { home: '#d52b1e', away: '#0038a8' },
    'portugal': { home: '#e42518', away: '#ffffff' },
    'qatar': { home: '#8a1538', away: '#ffffff' },
    'saudi arabia': { home: '#006c35', away: '#ffffff' },
    'scotland': { home: '#005eb8', away: '#ffffff' },
    'senegal': { home: '#ffffff', away: '#00853f' },
    'south africa': { home: '#ffb612', away: '#ffffff' },
    'south korea': { home: '#e30a17', away: '#ffffff' },
    'spain': { home: '#ad1519', away: '#fefce8' },
    'sweden': { home: '#ffc61e', away: '#006aa7' },
    'switzerland': { home: '#da291c', away: '#ffffff' },
    'tunisia': { home: '#e70013', away: '#ffffff' },
    'turkey': { home: '#e30a17', away: '#ffffff' },
    'united states': { home: '#ffffff', away: '#002868' },
    'usa': { home: '#ffffff', away: '#002868' },
    'uruguay': { home: '#55b5e5', away: '#ffffff' },
    'uzbekistan': { home: '#ffffff', away: '#0054a6' },
  };

  const key = normalize(teamName);
  const bg = colors[key] ? (isHome ? colors[key].home : colors[key].away) : '#0f0f0f';

  // Calculate perceived brightness
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  const text = yiq >= 128 ? '#000000' : '#ffffff';

  return { bg, text };
}
