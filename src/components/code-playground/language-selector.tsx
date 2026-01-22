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
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select language">
          <span className="flex items-center gap-2">
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
