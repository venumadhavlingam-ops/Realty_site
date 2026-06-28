import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (property) {
      <section class="w-full bg-primary pt-4 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <swiper-container class="h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden shadow-2xl" 
                            navigation="true" pagination="true" loop="true" autoplay-delay="4000" keyboard="true">
            @for (img of property.images; track img) {
              <swiper-slide>
                <img [src]="img" class="w-full h-full object-cover">
              </swiper-slide>
            }
            <swiper-slide>
              <video [src]="property.video" controls class="w-full h-full object-cover bg-black"></video>
            </swiper-slide>
          </swiper-container>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        <div class="lg:w-2/3 space-y-12">
          
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">{{ property.propertyType }}</span>
              <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{{ property.status }}</span>
            </div>
            <h1 class="text-4xl font-heading font-bold text-primary mb-4">{{ property.title }}</h1>
            <p class="text-2xl font-bold text-accent mb-2">{{ property.price | currency:'INR':'symbol':'1.0-0' }}</p>
            <p class="text-gray-500 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              {{ property.address }}
            </p>
          </div>

          <div>
            <h3 class="text-2xl font-heading font-bold text-primary mb-4">Description</h3>
            <p class="text-gray-600 leading-relaxed">{{ property.description }}</p>
          </div>

          <div>
            <h3 class="text-2xl font-heading font-bold text-primary mb-6">Specifications</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Plot Area</span>
                <span class="font-bold text-primary">{{ property.areaSqYards }} Sq.Yd</span>
              </div>
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Built-up Area</span>
                <span class="font-bold text-primary">{{ property.builtupSqFt }} Sq.Ft</span>
              </div>
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Bedrooms</span>
                <span class="font-bold text-primary">{{ property.bedrooms }}</span>
              </div>
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Bathrooms</span>
                <span class="font-bold text-primary">{{ property.bathrooms }}</span>
              </div>
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Facing</span>
                <span class="font-bold text-primary">{{ property.facing }}</span>
              </div>
              <div class="bg-background p-4 rounded-xl border border-gray-100">
                <span class="block text-gray-400 text-sm mb-1">Parking</span>
                <span class="font-bold text-primary">{{ property.parking }} Cars</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-heading font-bold text-primary mb-6">Amenities</h3>
            <div class="flex flex-wrap gap-4">
              @for (amenity of property.amenities; track amenity) {
                <span class="px-5 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-700 font-medium flex items-center gap-2">
                  <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  {{ amenity }}
                </span>
              }
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-heading font-bold text-primary mb-6">Location</h3>
            <div id="map" class="w-full h-[400px] rounded-2xl z-0 shadow-inner border border-gray-200"></div>
          </div>
        </div>

        <div class="lg:w-1/3">
          <div class="sticky top-28 bg-white p-6 rounded-2xl shadow-premium border border-gray-100">
            <h3 class="text-xl font-heading font-bold text-primary mb-2">Interested in this property?</h3>
            <p class="text-3xl font-bold text-accent mb-6">{{ property.price | currency:'INR':'symbol':'1.0-0' }}</p>
            
            <form class="space-y-4">
              <input type="text" placeholder="Your Name" class="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
              <input type="tel" placeholder="Phone Number" class="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
              <input type="email" placeholder="Email Address" class="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none">
              <textarea placeholder="I am interested in..." rows="3" class="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent outline-none"></textarea>
              
              <button class="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg">Send Enquiry</button>
              
              <div class="grid grid-cols-2 gap-4 mt-4">
                <button class="flex items-center justify-center gap-2 bg-success text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  WhatsApp
                </button>
                <button class="flex items-center justify-center gap-2 border border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors">
                  Call Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }
  `
})
export class PropertyDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  // 1. Inject ChangeDetectorRef
  private cdr = inject(ChangeDetectorRef); 
  
  property?: Property;
  map!: L.Map;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getPropertyById(id).subscribe({
        next: (data) => {
          this.property = data;
          // 2. Force Angular to render the @if block and DOM right now
          this.cdr.detectChanges(); 
          // 3. The div now definitively exists. Initialize Leaflet safely.
          this.initMap(); 
        },
        error: (err) => console.error(err)
      });
    }
  }

  private initMap(): void {
    if (!this.property) return;
    
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl, iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map').setView([this.property.latitude, this.property.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    L.marker([this.property.latitude, this.property.longitude])
      .addTo(this.map)
      .bindPopup(this.property.title)
      .openPopup();
  }
}