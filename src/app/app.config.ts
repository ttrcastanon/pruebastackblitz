import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

import { AppConfig } from './app-config';
export { AppConfig } from './app-config';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const GLOBAL_CONFIG: AppConfig = {
    endpoints: environment.endpoints,
};
