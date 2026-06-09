import { register, type RegisterResult } from '@teamhanko/hanko-elements';
import { en } from '@teamhanko/hanko-elements/i18n/en';
import { hankoFi } from './hankoTranslations';

export const HANKO_URL = import.meta.env.VITE_HANKO_URL || 'http://localhost:8000';

let registration: Promise<RegisterResult> | null = null;

export function registerHankoElements(): Promise<RegisterResult> {
  registration ??= register(HANKO_URL, {
    fallbackLanguage: 'en',
    translations: { en, fi: hankoFi },
  });
  return registration;
}
