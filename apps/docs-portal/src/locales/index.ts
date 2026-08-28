import { Language, Translations } from './types';
import { km } from './km';
import { en } from './en';
import { th } from './th';
import { vi } from './vi';
import { zh } from './zh';

export * from './types';

export const TRANSLATIONS: Record<Language, Translations> = {
  km,
  en,
  th,
  vi,
  zh,
};
