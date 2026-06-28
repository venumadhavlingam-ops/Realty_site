import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
      <div class="relative overflow-hidden aspect-[4/3]">
        <img [src]="property.images[0]" [alt]="property.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
        <div class="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {{ property.propertyType }}
        </div>
        <div *ngIf="property.featured" class="absolute top-4 right-4 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
          Featured
        </div>
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl font-heading font-bold text-primary mb-2 line-clamp-1">{{ property.title }}</h3>
        <p class="text-gray-500 text-sm mb-4 flex items-center gap-1">
          <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {{ property.address }}
        </p>
        <div class="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-4 text-sm text-gray-600">
          <div class="flex flex-col items-center"><span class="font-bold text-primary">{{ property.bedrooms }}</span> Beds</div>
          <div class="flex flex-col items-center border-x border-gray-100"><span class="font-bold text-primary">{{ property.bathrooms }}</span> Baths</div>
          <div class="flex flex-col items-center"><span class="font-bold text-primary">{{ property.areaSqYards }}</span> Sq.Yd</div>
        </div>
        <div class="mt-auto flex justify-between items-center">
          <div class="text-2xl font-bold text-primary">{{ property.price | currency:'INR':'symbol':'1.0-0' }}</div>
          <a [routerLink]="['/property', property.id]" class="bg-primary/5 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-lg font-medium transition-colors">Details</a>
        </div>
      </div>
    </div>
  `
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
}