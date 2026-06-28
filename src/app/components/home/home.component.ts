import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  template: `
    <section class="relative h-[80vh] flex items-center justify-center">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" class="w-full h-full object-cover" alt="Luxury Real Estate">
        <div class="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
      </div>
      
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
        <h1 class="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-lg">Find Your <span class="text-accent">Dream</span> Property</h1>
        <p class="text-xl text-gray-200 mb-10 font-light">Exclusive independent houses, villas, and premium plots in Hyderabad.</p>
        
        <div class="glass rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 shadow-2xl">
          <select [(ngModel)]="filters.type" class="flex-1 bg-white/90 border-0 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-accent outline-none">
            <option value="">Property Type</option>
            <option value="Independent House">Independent House</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>
          
          <select [(ngModel)]="filters.status" class="flex-1 bg-white/90 border-0 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-accent outline-none">
            <option value="">Status</option>
            <option value="Available">Available</option>
            <option value="Under Construction">Under Construction</option>
          </select>
          
          <button (click)="applyFilters()" class="bg-accent hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg">Search</button>
          <button (click)="clearFilters()" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors">Clear</button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">Featured Listings</h2>
        <p class="text-gray-500">Discover our handpicked premium properties.</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        <aside class="w-full lg:w-1/4">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <h3 class="text-lg font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Plot Area (Sq.Yd)
            </h3>
            
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-primary transition-colors font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(0, 500, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>Under 500 Sq.Yd</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-primary transition-colors font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(500, 1000, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>500 - 1000 Sq.Yd</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-primary transition-colors font-medium">
                <input type="checkbox" (change)="toggleAreaFilter(1000, 999999, $event)" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
                <span>1000+ Sq.Yd</span>
              </label>
            </div>
          </div>
        </aside>

        <main class="w-full lg:w-3/4">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            @for (property of displayedProperties(); track property.id) {
              <app-property-card [property]="property"></app-property-card>
            } @empty {
              <div class="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                No properties found matching your criteria.
              </div>
            }
          </div>
        </main>

      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  propertyService = inject(PropertyService);
  
  filters = { type: '', status: '' };
  
  // Track active area checkbox filter ranges locally
  activeAreaFilters = signal<{ min: number, max: number }[]>([]);

  // Dynamically calculate which properties show up on screen
  displayedProperties = computed(() => {
    const baseProperties = this.propertyService.filteredProperties();
    const activeRanges = this.activeAreaFilters();

    // If no checkboxes are checked, pass through the service's current filtered properties list
    if (activeRanges.length === 0) {
      return baseProperties;
    }

    // Filter properties matching ANY checked range criteria
    return baseProperties.filter(property => 
      activeRanges.some(range => property.areaSqYards >= range.min && property.areaSqYards <= range.max)
    );
  });

  ngOnInit() {
    this.propertyService.loadProperties().subscribe();
  }

  applyFilters() {
    this.propertyService.filterProperties(this.filters);
  }

  clearFilters() {
    this.filters = { type: '', status: '' };
    this.applyFilters();
  }

  toggleAreaFilter(min: number, max: number, event: any) {
    const isChecked = event.target.checked;
    const currentFilters = this.activeAreaFilters();

    if (isChecked) {
      this.activeAreaFilters.set([...currentFilters, { min, max }]);
    } else {
      this.activeAreaFilters.set(
        currentFilters.filter(range => range.min !== min || range.max !== max)
      );
    }
  }
}