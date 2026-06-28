import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), 
    title: 'Home | Luxury Estates' 
  },
  { 
    path: 'property/:id', 
    loadComponent: () => import('./pages/property-details/property-details.component').then(m => m.PropertyDetailsComponent) 
  },
  { path: '**', redirectTo: '' }
];