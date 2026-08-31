import { Language, Translations } from './types';
import { km } from './km';
import { en } from './en';

export * from './types';

export const TRANSLATIONS: Record<Language, Translations> = {
  km,
  en,
};
