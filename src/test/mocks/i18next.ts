const i18n = {
  language: 'en',
  use() {
    return this;
  },
  init(config: {
    resources?: Record<string, { translation?: Record<string, string> }>;
    lng?: string;
  }) {
    this.language = config.lng || 'en';
    this.resources = config.resources || {};
    return this;
  },
  changeLanguage(nextLanguage: string) {
    this.language = nextLanguage;
    return Promise.resolve(nextLanguage);
  },
  t(key: string) {
    return (
      this.resources?.[this.language]?.translation?.[key] ||
      this.resources?.en?.translation?.[key] ||
      key
    );
  },
  resources: {} as Record<string, { translation?: Record<string, string> }>,
};

export default i18n;
