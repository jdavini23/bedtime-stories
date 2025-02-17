declare module 'clsx' {
  type ClassValue = string | number | boolean | undefined | null;
  
  export default function clsx(...inputs: ClassValue[]): string;
  export function clsx(...inputs: ClassValue[]): string;
}


