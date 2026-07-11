import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <!-- Image Viewport -->
      <div class="relative h-56 bg-gray-100 overflow-hidden">
        <img [src]="property?.images?.[0] || property?.thumbnailImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'" 
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
             [alt]="property?.title">
        <span class="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {{ property?.propertyType || 'Property' }}
        </span>
        <span class="absolute top-4 right-4 bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {{ property?.status || 'Available' }}
        </span>
      </div>

      <!-- Core Content Details -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="text-xs font-bold text-accent tracking-wider uppercase mb-1">
            INR {{ (property?.price | number) || 'Price on Request' }}
          </div>
          <h3 class="text-lg font-heading font-bold text-primary line-clamp-1 mb-1 group-hover:text-accent transition-colors">
            {{ property?.title || 'Premium Listing' }}
          </h3>
          <p class="text-gray-400 text-xs font-medium flex items-center gap-1 mb-4">
            <svg class="w-3.5 h-3.5 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
            <span class="line-clamp-1">{{ property?.address }}, {{ property?.city }}</span>
          </p>
        </div>

        <!-- Structural Metrics Grid -->
        <div class="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 text-center text-xs">
          <div class="bg-gray-50/60 rounded-xl py-2">
            <span class="block text-[10px] uppercase font-bold text-gray-400 tracking-tight">Beds</span>
            <span class="font-bold text-primary">{{ property?.bedrooms || 0 }}</span>
          </div>
          <div class="bg-gray-50/60 rounded-xl py-2">
            <span class="block text-[10px] uppercase font-bold text-gray-400 tracking-tight">Baths</span>
            <span class="font-bold text-primary">{{ property?.bathrooms || 0 }}</span>
          </div>
          <div class="bg-gray-50/60 rounded-xl py-2">
            <span class="block text-[10px] uppercase font-bold text-gray-400 tracking-tight">Plot Area</span>
            <span class="font-bold text-primary text-[11px] truncate block px-1">{{ property?.areaSqYards || 0 }} Sq.Yd</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PropertyCardComponent {
  @Input() property: any;
}