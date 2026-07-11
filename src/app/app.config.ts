import { ApplicationConfig,InjectionToken, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { environment } from '../environments/environment'; // <-- IMPORT THIS

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(),
    provideAnimations(),

  { 
      provide: API_BASE_URL, 
      useValue: 'https://shde1sevyl.execute-api.ap-south-2.amazonaws.com/Prod' 
    }
  ]
};