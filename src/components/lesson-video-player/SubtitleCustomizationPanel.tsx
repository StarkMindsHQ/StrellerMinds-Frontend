'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Type, Palette } from 'lucide-react';

/**
 * Issue #358: Subtitle Customization Panel Component
 * 
 * Allows users to customize subtitle appearance for improved accessibility.
 * Features:
 * - Adjust font size/color
 * - Toggle subtitles
 * - Save preferences to localStorage
 */

export interface SubtitlePreferences {
  enabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontColor: string;
  backgroundColor: string;
  fontFamily: 'sans-serif' | 'serif' | 'monospace';
  opacity: number;
}

export interface SubtitleCustomizationPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onPreferencesChange?: (preferences: SubtitlePreferences) => void;
  storageKey?: string;
}

const DEFAULT_PREFERENCES: SubtitlePreferences = {
  enabled: true,
  fontSize: 'medium',
  fontColor: '#FFFFFF',
  backgroundColor: '#000000',
  fontFamily: 'sans-serif',
  opacity: 0.8,
};

const FONT_SIZE_MAP = {
  small: '14px',
  medium: '18px',
  large: '24px',
  'extra-large': '32px',
};

const COLOR_PRESETS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Magenta', value: '#FF00FF' },
];

const BACKGROUND_PRESETS = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#333333' },
  { name: 'Transparent', value: 'transparent' },
];

export const SubtitleCustomizationPanel: React.FC<SubtitleCustomizationPanelProps> = ({
  videoRef,
  onPreferencesChange,
  storageKey = 'subtitle-preferences',
}) => {
  const [preferences, setPreferences] = useState<SubtitlePreferences>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Error loading subtitle preferences:', error);
    }
  }, [storageKey]);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: SubtitlePreferences) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      onPreferencesChange?.(newPreferences);
    } catch (error) {
      console.error('Error saving subtitle preferences:', error);
    }
  };

  // Apply subtitle styles to video element
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const tracks = video.textTracks;

    // Enable/disable subtitles
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.kind === 'subtitles' || track.kind === 'captions') {
        track.mode = preferences.enabled ? 'showing' : 'hidden';
      }
    }

    // Apply custom styles using CSS
    const styleId = 'subtitle-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const bgColor = preferences.backgroundColor === 'transparent' 
      ? 'transparent' 
      : `${preferences.backgroundColor}${Math.round(preferences.opacity * 255).toString(16).padStart(2, '0')}`;

    styleElement.textContent = `
      video::cue {
        font-size: ${FONT_SIZE_MAP[preferences.fontSize]} !important;
        color: ${preferences.fontColor} !important;
        background-color: ${bgColor} !important;
        font-family: ${preferences.fontFamily} !important;
        line-height: 1.4 !important;
        padding: 0.2em 0.5em !important;
      }
    `;

    return () => {
      // Cleanup on unmount
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [preferences, videoRef]);

  const updatePreference = <K extends keyof SubtitlePreferences>(
    key: K,
    value: SubtitlePreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        title="Subtitle Settings"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <Card className="absolute bottom-full right-0 mb-2 w-80 z-50 shadow-xl border-white/10 bg-black/95 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Subtitle Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Customize subtitle appearance for better accessibility
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Enable/Disable Subtitles */}
            <div className="flex items-center justify-between">
              <Label htmlFor="subtitle-toggle" className="text-sm font-medium">
                Enable Subtitles
              </Label>
              <Switch
                id="subtitle-toggle"
                checked={preferences.enabled}
                onCheckedChange={(checked) => updatePreference('enabled', checked)}
              />
            </div>

            <Separator className="bg-white/10" />

            {/* Font Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </Label>
              <Select
                value={preferences.fontSize}
                onValueChange={(value) => updatePreference('fontSize', value as SubtitlePreferences['fontSize'])}
              >
                <SelectTrigger className="bg-black/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Family</Label>
              <Select
                value={preferences.fontFamily}
                onValueChange={(value) => updatePreference('fontFamily', value as SubtitlePreferences['fontFamily'])}
              >
                <SelectTrigger className="bg-black/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Text Color
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updatePreference('fontColor', color.value)}
                    className={`h-10 rounded border-2 transition-all ${
                      preferences.fontColor === color.value
                        ? 'border-white scale-110'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background</Label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updatePreference('backgroundColor', color.value)}
                    className={`h-10 rounded border-2 transition-all ${
                      preferences.backgroundColor === color.value
                        ? 'border-white scale-105'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ 
                      backgroundColor: color.value === 'transparent' ? '#333' : color.value,
                      backgroundImage: color.value === 'transparent' 
                        ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,.1) 5px, rgba(255,255,255,.1) 10px)'
                        : 'none'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Background Opacity: {Math.round(preferences.opacity * 100)}%
              </Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.opacity}
                onChange={(e) => updatePreference('opacity', parseFloat(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Preview */}
            <div className="mt-4 p-3 rounded bg-gray-900 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Preview:</p>
              <div
                className="text-center py-2 px-3 rounded"
                style={{
                  fontSize: FONT_SIZE_MAP[preferences.fontSize],
                  color: preferences.fontColor,
                  backgroundColor: preferences.backgroundColor === 'transparent' 
                    ? 'transparent' 
                    : `${preferences.backgroundColor}${Math.round(preferences.opacity * 255).toString(16).padStart(2, '0')}`,
                  fontFamily: preferences.fontFamily,
                }}
              >
                Sample Subtitle Text
              </div>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => savePreferences(DEFAULT_PREFERENCES)}
              className="w-full border-white/20 hover:bg-white/10"
            >
              Reset to Default
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubtitleCustomizationPanel;
