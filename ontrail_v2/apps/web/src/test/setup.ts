import { parseHTML } from 'linkedom';
import { afterEach } from 'bun:test';

const { window, document } = parseHTML('<!doctype html><html><body></body></html>');
Object.defineProperty(window, 'location', {
  value: new URL('http://localhost:5173/'),
});
Object.defineProperty(window, 'history', {
  value: {
    state: null,
    pushState: () => {},
    replaceState: () => {},
    back: () => {},
    forward: () => {},
    go: () => {},
  },
});
Object.defineProperty(window, 'devicePixelRatio', {
  value: 1,
});
Object.defineProperty(window, 'screen', {
  value: {
    deviceXDPI: 1,
    logicalXDPI: 1,
  },
});
Object.defineProperty(window.navigator, 'platform', {
  value: 'MacIntel',
});
Object.defineProperty(globalThis.navigator, 'platform', {
  value: 'MacIntel',
  configurable: true,
});
Object.defineProperty(globalThis, 'navigator', {
  value: globalThis.navigator,
  configurable: true,
});

const localStorageShim = {
  store: new Map<string, string>(),
  getItem(key: string) {
    return this.store.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    this.store.set(key, value);
  },
  removeItem(key: string) {
    this.store.delete(key);
  },
  clear() {
    this.store.clear();
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageShim,
  configurable: true,
});
Object.defineProperty(window, 'localStorage', {
  value: localStorageShim,
  configurable: true,
});

class TestFileReader extends EventTarget {
  result: string | ArrayBuffer | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsText(file: Blob) {
    file.text().then((text) => {
      this.result = text;
      const event = new Event('load') as ProgressEvent<FileReader>;
      Object.defineProperty(event, 'target', { value: this });
      this.onload?.(event);
    });
  }
}

Object.assign(globalThis, {
  window,
  document,
  HTMLElement: window.HTMLElement,
  HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement,
  HTMLButtonElement: window.HTMLButtonElement,
  File: globalThis.File,
  FileReader: TestFileReader,
  DOMParser: window.DOMParser,
  Event: window.Event,
  MouseEvent: window.MouseEvent,
  KeyboardEvent: window.KeyboardEvent,
  getComputedStyle:
    window.getComputedStyle?.bind(window) ??
    (() => ({
      getPropertyValue: () => '',
    })),
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(callback, 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
});

const { cleanup } = await import('@testing-library/react');

afterEach(() => {
  cleanup();
});
