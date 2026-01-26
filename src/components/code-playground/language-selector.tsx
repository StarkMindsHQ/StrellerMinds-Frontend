'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getSupportedLanguages,
  getLanguageDisplayName,
  type SupportedLanguage,
} from '@/lib/sandbox';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

const languageIcons: Record<SupportedLanguage, string> = {
  javascript: '🟨',
  typescript: '🔷',
  python: '🐍',
};

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const languages = getSupportedLanguages();

  return (
    <Select
      value={selectedLanguage}
      onValueChange={(value) => onLanguageChange(value as SupportedLanguage)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px] sm:w-[160px] min-h-[36px] sm:min-h-0 touch-manipulation">
        <SelectValue placeholder="Select language">
          <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span>{languageIcons[selectedLanguage]}</span>
            <span>{getLanguageDisplayName(selectedLanguage)}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            <span className="flex items-center gap-2">
              <span>{languageIcons[lang]}</span>
              <span>{getLanguageDisplayName(lang)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
