
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

export const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      fixtures: "Fixtures",
      live: "Live Now",
      results: "Results",
      groups: "Groups",
      standings: "Standings",
      stats: "Statistics"
    },
    dashboard: {
      heroTitle: "World Cup 2026",
      heroSubtitle: "Live tracking & analytics dashboard",
      nextMatch: "Next Match",
      liveMatches: "Live Matches",
      groups: "Groups",
      tournamentInfo: "Tournament Info",
      format: "Format",
      dates: "Dates",
      venues: "Venues",
      hosts: "Hosts",
      final: "Final",
      viewAll: "View All",
      noMatches: "No matches at the moment"
    },
    match: {
      scheduled: "Scheduled",
      live: "Live",
      finished: "Finished",
      postponed: "Postponed",
      overview: "Overview",
      statistics: "Statistics",
      lineups: "Lineups",
      timeline: "Match Timeline",
      momentum: "Match Momentum",
      possession: "Possession",
      shots: "Shots",
      goals: "Goals",
      noEvents: "No events available",
      noStats: "No statistics available",
      noLineups: "Lineups not available yet",
      startingXI: "Starting XI",
      coach: "Coach",
      venue: "Venue",
      referee: "Referee",
      attendance: "Attendance",
      weather: "Weather"
    },
    standings: {
      title: "Group Standings",
      subtitle: "Current rankings for all groups",
      info: "Group stage standings • Top 2 teams + 8 best 3rd-placed teams qualify for Round of 32",
      played: "P",
      won: "W",
      drawn: "D",
      lost: "L",
      goalsFor: "GF",
      goalsAgainst: "GA",
      goalDiff: "GD",
      points: "Pts"
    },
    stats: {
      title: "Tournament Statistics",
      subtitle: "Top performers and team metrics",
      topScorers: "Top Scorers",
      topAssists: "Top Assists",
      topRating: "Highest Rating",
      goals: "Goals",
      assists: "Assists",
      rating: "Rating",
      noData: "No statistics available yet"
    }
  },
  vi: {
    nav: {
      dashboard: "Trang chủ",
      fixtures: "Lịch thi đấu",
      live: "Đang diễn ra",
      results: "Kết quả",
      groups: "Vòng bảng",
      standings: "Bảng xếp hạng",
      stats: "Thống kê"
    },
    dashboard: {
      heroTitle: "World Cup 2026",
      heroSubtitle: "Bảng điều khiển & phân tích trực tiếp",
      nextMatch: "Trận tiếp theo",
      liveMatches: "Đang diễn ra",
      groups: "Vòng bảng",
      tournamentInfo: "Thông tin giải đấu",
      format: "Thể thức",
      dates: "Thời gian",
      venues: "Sân vận động",
      hosts: "Chủ nhà",
      final: "Chung kết",
      viewAll: "Xem tất cả",
      noMatches: "Hiện không có trận nào"
    },
    match: {
      scheduled: "Sắp diễn ra",
      live: "Trực tiếp",
      finished: "Kết thúc",
      postponed: "Hoãn",
      overview: "Tổng quan",
      statistics: "Thống kê",
      lineups: "Đội hình",
      timeline: "Diễn biến trận đấu",
      momentum: "Động lượng",
      possession: "Kiểm soát bóng",
      shots: "Sút bóng",
      goals: "Bàn thắng",
      noEvents: "Chưa có sự kiện nào",
      noStats: "Chưa có thống kê",
      noLineups: "Chưa có đội hình",
      startingXI: "Đội hình xuất phát",
      coach: "Huấn luyện viên",
      venue: "Sân vận động",
      referee: "Trọng tài",
      attendance: "Khán giả",
      weather: "Thời tiết"
    },
    standings: {
      title: "Bảng xếp hạng",
      subtitle: "Vị trí hiện tại của các đội",
      info: "BXH Vòng bảng • 2 đội đứng đầu + 8 đội hạng 3 có thành tích tốt nhất sẽ vào Vòng 32 đội",
      played: "ST",
      won: "T",
      drawn: "H",
      lost: "B",
      goalsFor: "BT",
      goalsAgainst: "SBT",
      goalDiff: "HS",
      points: "Điểm"
    },
    stats: {
      title: "Thống kê giải đấu",
      subtitle: "Những cá nhân và đội tuyển xuất sắc nhất",
      topScorers: "Vua phá lưới",
      topAssists: "Kiến tạo nhiều nhất",
      topRating: "Đánh giá cao nhất",
      goals: "Bàn thắng",
      assists: "Kiến tạo",
      rating: "Điểm",
      noData: "Chưa có dữ liệu thống kê"
    }
  }
};

type Dictionary = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'vi')) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to english
        let fallback: any = translations['en'];
        for (const k of keys) fallback = fallback[k];
        return fallback || path;
      }
      current = current[key];
    }
    return current;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return dummy when not inside provider (e.g. server components sometimes if not careful, though this is client)
    return { language: 'en' as Language, setLanguage: () => {}, t: (p:string) => p.split('.').pop() || p };
  }
  return context;
}
