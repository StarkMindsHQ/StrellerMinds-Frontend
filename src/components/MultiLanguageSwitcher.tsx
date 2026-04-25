'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../services/i18n';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export function MultiLanguageSwitcher() {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="flex items-center gap-2">
      <span>{t('welcome')}</span>
      <select
        value={currentLang}
        onChange={(e) => switchLanguage(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
