'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getTemplatesByLanguage,
  getTemplateCategories,
  getCategoryDisplayName,
  type CodeTemplate,
} from '@/lib/sandbox/templates';
import type { SupportedLanguage } from '@/lib/sandbox';

interface EnhancedTemplateSelectorProps {
  language: SupportedLanguage;
  selectedTemplateId: string;
  onTemplateChange: (template: CodeTemplate) => void;
  disabled?: boolean;
}

export default function EnhancedTemplateSelector({
  language,
  selectedTemplateId,
  onTemplateChange,
  disabled = false,
}: EnhancedTemplateSelectorProps) {
  const templates = getTemplatesByLanguage(language);
  const categories = getTemplateCategories();

  // Group templates by category
  const templatesByCategory = categories.reduce(
    (acc, category) => {
      const categoryTemplates = templates.filter(
        (t) => t.category === category,
      );
      if (categoryTemplates.length > 0) {
        acc[category] = categoryTemplates;
      }
      return acc;
    },
    {} as Record<string, CodeTemplate[]>,
  );

  const handleChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      onTemplateChange(template);
    }
  };

  // Find current template name for display
  const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <Select
      value={selectedTemplateId}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select template">
          {currentTemplate?.name || 'Select template'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(templatesByCategory).map(
          ([category, categoryTemplates]) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-xs uppercase text-muted-foreground">
                {getCategoryDisplayName(category as CodeTemplate['category'])}
              </SelectLabel>
              {categoryTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex flex-col">
                    <span>{template.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {template.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
