import i18n from './i18next';

export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
};

export function useTranslation() {
  return {
    t: (key: string) => i18n.t(key),
    i18n,
  };
}
