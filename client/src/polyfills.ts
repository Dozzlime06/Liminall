import { Buffer } from 'buffer';

// Polyfill global Buffer for ethers.js v5
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = { env: {} };
}
