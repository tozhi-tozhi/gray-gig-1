import { mulberry32 } from '../app/utils/rng';

let rng = mulberry32(0xC0FFEE);

export function seedRandom(seed: number): void {
  rng = mulberry32(seed);
}

export function rollPolice(risk: number): boolean {
  return rng() < risk;
}