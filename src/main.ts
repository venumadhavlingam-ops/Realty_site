import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// 1. Correct the import path and component name
import { AppComponent } from './app/app.component';

// 2. Bootstrap the correct component
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));