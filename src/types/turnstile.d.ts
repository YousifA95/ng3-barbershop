export {};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string | number;
      remove?: (id: string | number) => void;
      reset?: (id?: string | number) => void;
    };
  }
}
