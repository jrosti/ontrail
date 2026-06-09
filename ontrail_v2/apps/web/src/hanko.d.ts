// Global JSX type declarations for Hanko custom elements
import type { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hanko-auth': HTMLAttributes<HTMLElement> & { lang?: string };
      'hanko-profile': HTMLAttributes<HTMLElement> & { lang?: string };
      'hanko-events': HTMLAttributes<HTMLElement>;
    }
  }
}
