export interface Language {
  code: string;
  badge: string;
  label: string;
  flagEmoji: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', badge: 'US', label: 'English', flagEmoji: '🇺🇸' },
  { code: 'es', badge: 'ES', label: 'Español', flagEmoji: '🇪🇸' },
  { code: 'pt', badge: 'BR', label: 'Português', flagEmoji: '🇧🇷' },
  { code: 'de', badge: 'DE', label: 'Deutsch', flagEmoji: '🇩🇪' },
  { code: 'fr', badge: 'FR', label: 'Français', flagEmoji: '🇫🇷' },
  { code: 'ja', badge: 'JP', label: '日本語', flagEmoji: '🇯🇵' },
  { code: 'zh', badge: 'CN', label: '简体中文', flagEmoji: '🇨🇳' },
];

export const DEFAULT_LANGUAGE = 'en';

export type SupportedLanguageCode = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja' | 'zh';
