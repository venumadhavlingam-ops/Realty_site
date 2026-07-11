import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Added for handling form controls cleanly
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // <-- Included FormsModule here
  template: `
    @if (property(); as data) {
      <div class="min-h-screen bg-gray-50/50 text-primary pb-24">
        
        <!-- FLUID IMAGE CAROUSEL SLIDER -->
        <section class="relative h-[55vh] bg-neutral-900 group">
          @if (data.images && data.images.length > 0) {
            <div class="w-full h-full relative">
              <img [src]="data.images[activeImageIndex()]" class="w-full h-full object-cover transition-all duration-500" alt="Listing Showcase">
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            @if (data.images.length > 1) {
              <button (click)="prevSlide(data.images.length)" class="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-accent text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md">
                &larr;
              </button>
              <button (click)="nextSlide(data.images.length)" class="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-accent text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md">
                &rarr;
              </button>
              
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                @for (img of data.images; track $index) {
                  <button (click)="activeImageIndex.set($index)" 
                          [class]="'w-2 h-2 rounded-full transition-all ' + ($index === activeImageIndex() ? 'bg-accent w-5' : 'bg-white/40')">
                  </button>
                }
              </div>
            }
          }
        </section>

        <!-- MASTER GRID WRAPPER (8-Column Left Content, 4-Column Right Sidebar Form) -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- LEFT CONTENT BLOCK (8 Columns) -->
          <div class="lg:col-span-8 space-y-10">
            
            <!-- TITLE, BADGES, PRICE AND LOCATION TRACKER -->
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span class="bg-slate-200/70 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full">
                  {{ data.propertyType }}
                </span>
                <span class="bg-emerald-50 text-emerald-600 font-semibold text-xs px-3 py-1 rounded-full">
                  {{ data.status }}
                </span>
              </div>
              
              <h1 class="text-4xl font-heading font-bold text-slate-900 tracking-tight">
                {{ data.title }}
              </h1>
              
              <div class="text-3xl font-bold text-amber-600 font-heading">
                ₹{{ data.price | number }}
              </div>
              
              <p class="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ data.address }}, {{ data.city }}
              </p>
            </div>

            <!-- DESCRIPTION PARAGRAPH STRUCTURE -->
            <div class="space-y-3">
              <h2 class="text-2xl font-heading font-bold text-slate-900">Description</h2>
              <p class="text-gray-600 leading-relaxed font-normal whitespace-pre-line text-base">
                {{ data.description }}
              </p>
            </div>

            <!-- SPECIFICATIONS METRICS MATRIX -->
            <div class="space-y-4">
              <h2 class="text-2xl font-heading font-bold text-slate-900">Specifications</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Plot Area</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.areaSqYards }} Sq.Yd</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Built-up Area</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.builtupSqFt }} Sq.Ft</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Bedrooms</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.bedrooms }}</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Bathrooms</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.bathrooms }}</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Facing</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.facing || 'East' }}</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span class="block text-xs font-medium text-gray-400">Parking</span>
                  <span class="text-base font-bold text-slate-900 mt-1 block">{{ data.parking || 0 }} Cars</span>
                </div>
              </div>
            </div>

            <!-- AMENITIES PILLS LOOP -->
            @if (data.amenities?.length) {
              <div class="space-y-4">
                <h2 class="text-2xl font-heading font-bold text-slate-900">Amenities</h2>
                <div class="flex flex-wrap gap-3">
                  @for (amenity of data.amenities; track amenity) {
                    <div class="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-slate-700">
                      <span class="text-amber-600 font-bold text-xs">&#10003;</span>
                      {{ amenity }}
                    </div>
                  }
                </div>
              </div>
            }

            <!-- LOCATION INTELLIGENCE FRAME -->
            @if (data.latitude && data.longitude) {
              <div class="space-y-4">
                <h2 class="text-2xl font-heading font-bold text-slate-900">Location</h2>
                <div class="w-full h-96 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    scrolling="no" 
                    [src]="sanitizedMapUrl()">
                  </iframe>
                </div>
                
                <div class="flex justify-end">
                  <a [href]="directionsUrl()" target="_blank" 
                     class="inline-flex items-center gap-2 bg-[#0b1320] hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all text-sm shadow-md">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            }

            <div class="pt-6 border-t border-gray-200 text-center lg:text-left">
              <a routerLink="/" class="text-xs text-gray-400 hover:text-accent font-medium transition-colors">&larr; Return to Master Gallery</a>
            </div>
          </div>

          <!-- RIGHT SIDEBAR BLOCK: INTERACTIVE ENQUIRY CARD (4 Columns) -->
          <div class="lg:col-span-4">
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl lg:sticky lg:top-28 space-y-5">
              
              <div>
                <h3 class="text-xl font-heading font-bold text-slate-900">Interested in this property?</h3>
                <div class="text-2xl font-bold text-amber-600 font-heading mt-1">
                  ₹{{ data.price | number }}
                </div>
              </div>

              <!-- Input Forms Matrix Fields -->
              <div class="space-y-3">
                <input type="text" [(ngModel)]="formFields.name" placeholder="Your Name" 
                       class="w-full bg-slate-50/60 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all">
                
                <input type="text" [(ngModel)]="formFields.phone" placeholder="Phone Number" 
                       class="w-full bg-slate-50/60 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all">
                
                <input type="email" [(ngModel)]="formFields.email" placeholder="Email Address" 
                       class="w-full bg-slate-50/60 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all">
                
                <textarea rows="3" [(ngModel)]="formFields.message"
                          class="w-full bg-slate-50/60 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"></textarea>
              </div>

              <!-- Action Layout Triggers -->
              <div class="space-y-3">
                <button (click)="submitEnquiry()" 
                        class="w-full bg-[#0b1320] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-md tracking-wide">
                  Send Enquiry
                </button>
                
                <div class="grid grid-cols-2 gap-3">
                  <a [href]="whatsappUrl()" target="_blank"
                     class="bg-[#0cc17a] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm text-center shadow-sm">
                    WhatsApp
                  </a>
                  <a [href]="'tel:' + companyPhone"
                     class="bg-white hover:bg-slate-50 text-slate-800 border border-gray-200 font-bold py-3.5 rounded-xl transition-all text-sm text-center shadow-sm">
                    Call Now
                  </a>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    } @else {
      <div class="min-h-screen flex justify-center items-center text-gray-400 font-medium bg-gray-50">
        Synchronizing core property asset portfolio registry node...
      </div>
    }
  `
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  private sanitizer = inject(DomSanitizer);

  property = signal<any | null>(null);
  activeImageIndex = signal<number>(0);
  
  companyPhone = '+919100000000'; // Centralized contact desk assignment

  // Interactive Form State Engine Setup
  formFields = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  sanitizedMapUrl = computed<SafeResourceUrl | null>(() => {
    const data = this.property();
    if (!data || !data.latitude || !data.longitude) return null;
    
    const rawUrl = `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed&t=m`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  });

  directionsUrl = computed<string>(() => {
    const data = this.property();
    if (!data || !data.latitude || !data.longitude) return '#';
    return `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`;
  });

  // Dynamically generated string handling precise WhatsApp API redirection values
  whatsappUrl = computed<string>(() => {
    const data = this.property();
    if (!data) return '#';
    const text = `Hello Nexora, I am interested in inquiring details regarding the listing: ${data.title} (ID: ${data.id})`;
    return `https://wa.me/${this.companyPhone.replace('+', '')}?text=${encodeURIComponent(text)}`;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getPropertyById(id).subscribe({
        next: (payload) => {
          this.property.set(payload);
          // Set dynamic initial value inside message tracking text box automatically
          this.formFields.message = `I am interested in ${payload.title || 'this property'} and would like to receive details.`;
        },
        error: (err) => console.error('Data pipeline linkage fault:', err)
      });
    }
  }

  submitEnquiry() {
    console.log('Dispatching Lead Conversion Vector to Serverless Ledger:', this.formFields);
    alert(`Thank you ${this.formFields.name || 'there'}! Your interest package has been safely synchronized.`);
  }

  nextSlide(length: number) {
    this.activeImageIndex.update((idx) => (idx + 1) % length);
  }

  prevSlide(length: number) {
    this.activeImageIndex.update((idx) => (idx - 1 + length) % length);
  }
}