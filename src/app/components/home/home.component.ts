import { Component, OnInit, inject } from '@angular/core';
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
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">Featured Listings</h2>
          <p class="text-gray-500">Discover our handpicked premium properties.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        @for (property of propertyService.filteredProperties(); track property.id) {
          <app-property-card [property]="property"></app-property-card>
        } @empty {
          <div class="col-span-full text-center py-20 text-gray-500">
            No properties found matching your criteria.
          </div>
        }
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  propertyService = inject(PropertyService);
  
  filters = { type: '', status: '' };

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
}