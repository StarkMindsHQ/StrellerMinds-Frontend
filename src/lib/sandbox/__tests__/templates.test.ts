import { describe, it, expect } from 'vitest';
import {
  codeTemplates,
  getTemplatesByLanguage,
  getTemplatesByCategory,
  getTemplateById,
  getDefaultTemplate,
  getTemplateCategories,
  getCategoryDisplayName,
} from '../templates';
import type { SupportedLanguage } from '../types';

describe('Code Templates', () => {
  describe('codeTemplates', () => {
    it('should have templates defined', () => {
      expect(codeTemplates).toBeDefined();
      expect(Array.isArray(codeTemplates)).toBe(true);
      expect(codeTemplates.length).toBeGreaterThan(0);
    });

    it('should have valid template structure', () => {
      for (const template of codeTemplates) {
        expect(template.id).toBeDefined();
        expect(typeof template.id).toBe('string');
        expect(template.name).toBeDefined();
        expect(typeof template.name).toBe('string');
        expect(template.description).toBeDefined();
        expect(typeof template.description).toBe('string');
        expect(template.language).toBeDefined();
        expect(['javascript', 'typescript', 'python']).toContain(
          template.language,
        );
        expect(template.code).toBeDefined();
        expect(typeof template.code).toBe('string');
        expect(template.category).toBeDefined();
      }
    });

    it('should have unique template IDs', () => {
      const ids = codeTemplates.map((t) => t.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getTemplatesByLanguage', () => {
    it('should return JavaScript templates', () => {
      const templates = getTemplatesByLanguage('javascript');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.language === 'javascript')).toBe(true);
    });

    it('should return TypeScript templates', () => {
      const templates = getTemplatesByLanguage('typescript');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.language === 'typescript')).toBe(true);
    });

    it('should return Python templates', () => {
      const templates = getTemplatesByLanguage('python');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.language === 'python')).toBe(true);
    });

    it('should return empty array for unsupported language', () => {
      const templates = getTemplatesByLanguage('rust' as SupportedLanguage);

      expect(templates).toEqual([]);
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should return basic templates', () => {
      const templates = getTemplatesByCategory('basic');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.category === 'basic')).toBe(true);
    });

    it('should return blockchain templates', () => {
      const templates = getTemplatesByCategory('blockchain');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.category === 'blockchain')).toBe(true);
    });

    it('should return algorithm templates', () => {
      const templates = getTemplatesByCategory('algorithm');

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.category === 'algorithm')).toBe(true);
    });
  });

  describe('getTemplateById', () => {
    it('should find template by ID', () => {
      const template = getTemplateById('js-blank');

      expect(template).toBeDefined();
      expect(template?.id).toBe('js-blank');
      expect(template?.language).toBe('javascript');
    });

    it('should return undefined for non-existent ID', () => {
      const template = getTemplateById('non-existent-id');

      expect(template).toBeUndefined();
    });
  });

  describe('getDefaultTemplate', () => {
    it('should return JavaScript default template', () => {
      const template = getDefaultTemplate('javascript');

      expect(template).toBeDefined();
      expect(template.language).toBe('javascript');
      expect(template.id).toBe('js-blank');
    });

    it('should return TypeScript default template', () => {
      const template = getDefaultTemplate('typescript');

      expect(template).toBeDefined();
      expect(template.language).toBe('typescript');
      expect(template.id).toBe('ts-blank');
    });

    it('should return Python default template', () => {
      const template = getDefaultTemplate('python');

      expect(template).toBeDefined();
      expect(template.language).toBe('python');
      expect(template.id).toBe('py-blank');
    });
  });

  describe('getTemplateCategories', () => {
    it('should return all categories', () => {
      const categories = getTemplateCategories();

      expect(categories).toContain('basic');
      expect(categories).toContain('blockchain');
      expect(categories).toContain('algorithm');
      expect(categories).toContain('data-structure');
    });
  });

  describe('getCategoryDisplayName', () => {
    it('should return display name for basic', () => {
      expect(getCategoryDisplayName('basic')).toBe('Basic');
    });

    it('should return display name for blockchain', () => {
      expect(getCategoryDisplayName('blockchain')).toBe('Blockchain');
    });

    it('should return display name for algorithm', () => {
      expect(getCategoryDisplayName('algorithm')).toBe('Algorithms');
    });

    it('should return display name for data-structure', () => {
      expect(getCategoryDisplayName('data-structure')).toBe('Data Structures');
    });
  });

  describe('Template content validation', () => {
    it('should have JavaScript blank template with valid content', () => {
      const template = getTemplateById('js-blank');

      expect(template?.code).toContain('console.log');
    });

    it('should have Stellar templates using require', () => {
      const stellarTemplates = getTemplatesByCategory('blockchain');

      for (const template of stellarTemplates.filter(
        (t) => t.language === 'javascript',
      )) {
        if (template.code.includes('StellarSdk')) {
          expect(template.code).toContain("require('stellar-sdk')");
        }
      }
    });

    it('should have Python blank template with valid content', () => {
      const template = getTemplateById('py-blank');

      expect(template?.code).toContain('print');
    });

    it('should have TypeScript blank template with valid content', () => {
      const template = getTemplateById('ts-blank');

      expect(template?.code).toContain('interface');
    });
  });
});
