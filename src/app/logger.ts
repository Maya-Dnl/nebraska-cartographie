import { environment } from '../environments/environment';

export function log(...args: any[]) {
  if (environment.debug) {
    console.log(...args);
  }
}