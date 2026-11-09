export interface Effect { name: string; title: string; description: string; fragment: string; vertex?: string; vertices?: number; impact?: boolean; family?: string; useCase?: string; detailLabel?: string }
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'difference' | 'exclusion' | 'darken' | 'lighten';
export interface Layer { effect: Effect; amount?: number; detail?: number; blendMode?: BlendMode; enabled?: boolean }
export interface Options { effect?: Effect; layers?: Layer[]; blendMode?: BlendMode; trigger?: 'loop' | 'hover' | 'click' | 'scroll' | 'still'; amount?: number; detail?: number; duration?: number; phase?: number; pixelRatio?: number; onError?: (error: Error) => void }
export interface Controller { canvas: HTMLCanvasElement; preview(layer?: Layer | null): void; set(options: Partial<Options>): void; pause(): void; play(): void; trigger(): void; reset(): void; destroy(): void; readonly stats: { frames: number; cpuMs: number; width: number; height: number; active: boolean; fallback: boolean; programs: number; intermediateTextures: number } }
export function createEffect(media: HTMLImageElement | HTMLVideoElement, options: Options): Controller;
export const prism: Effect;
export const liquid: Effect;
export const ripple: Effect;
export const fluted: Effect;
export const halftone: Effect;
export const vortex: Effect;
export const dither: Effect;
export const pixelate: Effect;
export const rgbSplit: Effect;
export const glassBreak: Effect;
export const duotone: Effect;
export const scanlines: Effect;
export const retroTv: Effect;
export const matrix: Effect;
export const vhs: Effect;
export const glitch: Effect;
export const ascii: Effect;
export const thermal: Effect;
export const noise: Effect;
export const zoomIn: Effect;
export const zoomOut: Effect;
export const vibration: Effect;
export const pan: Effect;
export const handheld: Effect;
export const tiltShift: Effect;
