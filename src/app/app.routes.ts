import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), 
    title: 'Home | Luxury Estates' 
  },
  { 
    path: 'admin-console', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component')
                          .then(m => m.AdminDashboardComponent)
  },
  { 
    path: 'properties/:id', 
    loadComponent: () => import('./components/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  { 
    path: 'property/:id', 
    loadComponent: () => import('./pages/property-details/property-details.component').then(m => m.PropertyDetailsComponent) 
  },
  { path: '**', redirectTo: '' }
];