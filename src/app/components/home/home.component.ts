import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, RouterLink],
  template: `
    <!-- HERO LOGO ALIGNMENT AND TAGLINE -->
    <section class="relative h-[85vh] flex items-center justify-center">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" class="w-full h-full object-cover" alt="Nexora Masterpiece Elements">
        <div class="absolute inset-0 bg-primary/75 mix-blend-multiply"></div>
      </div>
      
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
        <span class="inline-block bg-accent/20 text-accent border border-accent/40 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
          Building Today, Creating Tomorrow
        </span>
        <h1 class="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-lg tracking-tight">
          Discover Premium Living with <span class="text-accent font-light">NEXORA</span>
        </h1>
        <p class="text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
          Architecting elite independent houses, villas, and landmark spaces across Hyderabad.
        </p>
        
        <!-- Interactive Search Controller Form -->
        <div class="glass border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 shadow-2xl backdrop-blur-md">
          <select [(ngModel)]="filters.type" class="flex-1 bg-white/95 border-0 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-accent outline-none font-medium">
            <option value="">Property Type</option>
            <option value="Independent House">Independent House</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>
          
          <select [(ngModel)]="filters.status" class="flex-1 bg-white/95 border-0 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-accent outline-none font-medium">
            <option value="">Status</option>
            <option value="Available">Available</option>
            <option value="Under Construction">Under Construction</option>
          </select>
          
          <button (click)="applyFilters()" class="bg-accent hover:bg-amber-600 text-primary font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-0.5">
            Search Properties
          </button>
          <button (click)="clearFilters()" class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors border border-white/20">
            Clear
          </button>
        </div>
      </div>
    </section>

    <!-- ARCHIVE VIEW GRID SECTIONS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="mb-12 border-l-4 border-accent pl-4 flex justify-between items-end">
        <div>
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 tracking-tight">Featured Masterpieces</h2>
          <p class="text-gray-500 font-medium">Live architectural portfolios pulled straight from our active registry.</p>
        </div>
        <a routerLink="/admin-console" class="text-xs font-semibold text-accent/60 hover:text-accent border border-accent/20 hover:border-accent rounded-lg px-3 py-1.5 transition-all">Console Login</a>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- SIDEBAR FILTERS (Area sq. yards filtering occurs locally on top of backend lists) -->
        <aside class="w-full lg:w-1/4">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <h3 class="text-lg font-heading font-bold text-primary mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Plot Area (Sq.Yd)
            </h3>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(0, 500, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>Under 500 Sq.Yd</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(500, 1000, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>500 - 1000 Sq.Yd</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(1000, 999999, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>1000+ Sq.Yd</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- PROPERTY ENGINE GRID MAPPINGS -->
        <main class="w-full lg:w-3/4">
          @if (propertyService.isLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              @for (i of [1,2,3]; track i) {
                <div class="bg-gray-100 rounded-2xl h-80 animate-pulse border border-gray-200"></div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              @for (property of displayedProperties(); track property.id) {
                <!-- Clicking cards pushes router navigation profile paths to detail view -->
                <div [routerLink]="['/properties', property.id]" class="cursor-pointer group">
                  <app-property-card [property]="property"></app-property-card>
                </div>
              } @empty {
                <div class="col-span-full text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  No properties active inside the system query definitions.
                </div>
              }
            </div>
          }
        </main>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  propertyService = inject(PropertyService);
  
  filters = { type: '', status: '' };
  activeAreaFilters = signal<{ min: number, max: number }[]>([]);

  displayedProperties = computed(() => {
    const baseProperties = this.propertyService.filteredProperties();
    const activeRanges = this.activeAreaFilters();

    if (activeRanges.length === 0) return baseProperties;

    // Local filter operation layer handling secondary metrics (area arrays fallback parsing)
    return baseProperties.filter(p => 
      activeRanges.some(r => (p as any).areaSqYards >= r.min && (p as any).areaSqYards <= r.max)
    );
  });

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.propertyService.loadProperties(this.filters);
  }

  clearFilters() {
    this.filters = { type: '', status: '' };
    this.applyFilters();
  }

  toggleAreaFilter(min: number, max: number, event: any) {
    const isChecked = event.target.checked;
    const current = this.activeAreaFilters();

    if (isChecked) {
      this.activeAreaFilters.set([...current, { min, max }]);
    } else {
      this.activeAreaFilters.set(current.filter(r => r.min !== min || r.max !== max));
    }
  }
}