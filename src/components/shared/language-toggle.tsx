
'use client';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
      className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs"
      title="Đổi ngôn ngữ"
    >
      {language === 'en' ? 'VI' : 'EN'}
    </Button>
  );
}
