import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyAdminService, PropertyRequest } from '../../services/property-admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 text-primary">
      <!-- Admin Top Nav -->
      <header class="bg-primary text-white py-4 px-8 shadow-md flex justify-between items-center border-b border-accent/20">
        <div class="flex items-center gap-3">
          <div class="flex flex-col">
            <span class="text-xl font-bold tracking-wider font-heading">NEXORA</span>
            <span class="text-[10px] uppercase tracking-widest text-accent font-semibold">Management Console</span>
          </div>
        </div>
        <span class="text-sm font-medium text-gray-400">Enterprise Serverless Active Engine</span>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <!-- INVENTORY TRACKING TABLE (xl:col-span-5) -->
        <div class="xl:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)] sticky top-6">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 class="font-heading font-bold text-lg text-primary">Active Portfolio Registry</h2>
            <button (click)="resetFormForCreate()" class="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              + New Post
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto">
            @if (isLoadingList()) {
              <div class="flex justify-center items-center h-48 text-gray-400 text-sm">Synchronizing ledger matrix...</div>
            } @else {
              <div class="divide-y divide-gray-100">
                @for (item of propertiesList(); track item.id) {
                  <div class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                       [ngClass]="{'border-l-4 border-accent bg-amber-50/20': selectedId() === item.id}">
                    <div class="flex-1 min-w-0 pr-4">
                      <h4 class="font-semibold text-sm truncate text-gray-900">{{ item.title }}</h4>
                      <p class="text-xs text-gray-500 mt-0.5">{{ item.city }} | {{ item.propertyType }}</p>
                      <div class="flex gap-2 mt-2">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                              [ngClass]="item.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                          {{ item.status }}
                        </span>
                        @if (item.featured) {
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">Featured</span>
                        }
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <button (click)="loadItemToForm(item.id)" class="text-xs font-medium text-gray-600 hover:text-accent p-2 transition-colors">Edit</button>
                      <button (click)="deleteItem(item.id)" class="text-xs font-medium text-red-500 hover:text-red-700 p-2 transition-colors">Delete</button>
                    </div>
                  </div>
                } @empty {
                  <div class="text-center py-12 text-gray-400 text-sm">No assets deployed to standard registry.</div>
                }
              </div>
            }
          </div>
        </div>

        <!-- FORM ENGINE BLOCK (xl:col-span-7) -->
        <div class="xl:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-2xl font-heading font-bold text-primary">
              {{ isEditMode() ? 'Mutate Property Listing' : 'Publish New Masterpiece Space' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">Populate parameters layout configurations schema model elements.</p>
          </div>

          <form [formGroup]="propertyForm" (ngInject)="submitForm()" class="space-y-6">
            
            <!-- SECTION 1: CORE INFRASTRUCTURE DESCRIPTION -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-accent border-b border-gray-100 pb-1">1. Primary Profile Specification</h3>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Listing Headline Title *</label>
                <input type="text" formControlName="title" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Granular Description Layout *</label>
                <textarea formControlName="description" rows="4" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all"></textarea>
              </div>
            </div>

            <!-- SECTION 2: ATTRIBUTE MATRICES -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-accent border-b border-gray-100 pb-1">2. Financials & Architecture Layout</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Property Type *</label>
                  <select formControlName="propertyType" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Price (INR) *</label>
                  <input type="number" formControlName="price" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Status Matrix *</label>
                  <select formControlName="status" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                    <option value="Available">Available</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Plot Area (Sq.Yards) *</label>
                  <input type="number" formControlName="areaSqYards" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Built-up Area (Sq.Ft) *</label>
                  <input type="number" formControlName="builtupSqFt" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                </div>
              </div>
            </div>

            <!-- SECTION 3: TECH MATRIX DETAILS -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-accent border-b border-gray-100 pb-1">3. Structural Metrics Configuration</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Bedrooms *</label>
                  <input type="number" formControlName="bedrooms" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Bathrooms *</label>
                  <input type="number" formControlName="bathrooms" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Parking Units *</label>
                  <input type="number" formControlName="parking" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Total Floors *</label>
                  <input type="number" formControlName="floors" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Structural Facing Orientation *</label>
                <select formControlName="facing" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent">
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>

            <!-- SECTION 4: LOCATION CAPABILITY MATRIX -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-accent border-b border-gray-100 pb-1">4. Geographical Mapping Vectors</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-1">
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">City Node Cluster *</label>
                  <input type="text" formControlName="city" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Full Mapping Address *</label>
                  <input type="text" formControlName="address" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Latitude Coordinates *</label>
                  <input type="number" step="any" formControlName="latitude" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Longitude Coordinates *</label>
                  <input type="number" step="any" formControlName="longitude" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                </div>
              </div>
            </div>

            <!-- SECTION 5: BINARY INGRESS PIPE MANAGER -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-accent border-b border-gray-100 pb-1">5. Secure Cloud Media Storage Ingress</h3>
              
              <div class="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-accent/50 transition-colors bg-gray-50/50">
                <input type="file" multiple (change)="onFileSelected($event)" id="fileDrop" class="hidden">
                <label for="fileDrop" class="cursor-pointer block">
                  <svg class="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-sm font-semibold text-primary block">Select Premium Listing Media</span>
                  <span class="text-xs text-gray-400 block mt-1">Directly signs and streams binary arrays payload to AWS S3 elements bucket bypass loop</span>
                </label>
              </div>

              @if (isUploadingMedia()) {
                <div class="text-xs text-accent font-semibold flex items-center gap-2 animate-pulse">
                  <span class="w-2 h-2 rounded-full bg-accent animate-ping"></span> 
                  Cryptographic streaming synchronization loop execution...
                </div>
              }

              <!-- Image Link List View Panel -->
              <div class="grid grid-cols-4 gap-4 mt-2">
                @for (imgUrl of uploadedImages(); track imgUrl) {
                  <div class="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group">
                    <img [src]="imgUrl" class="w-full h-full object-cover">
                    <button type="button" (click)="removeImg(imgUrl)" class="absolute inset-0 bg-red-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold">
                      Remove
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- AMENITIES CHIPS AND FLAG FOR FEATURED -->
            <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input type="checkbox" formControlName="featured" id="featuredCheck" class="w-5 h-5 rounded text-accent focus:ring-accent border-gray-300">
              <label for="featuredCheck" class="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                Promote to Home Screen Featured Masterpiece Carousels
              </label>
            </div>

            <!-- ACTION SUBMISSION BAR -->
            <div class="pt-4 flex gap-4 border-t border-gray-100">
              <button type="button" (click)="submitForm()" [disabled]="propertyForm.invalid || isUploadingMedia()" 
                      class="flex-1 bg-accent hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-primary font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md">
                {{ isEditMode() ? 'Synchronize Schema Modifications' : 'Commit Payload Registry Release' }}
              </button>
              @if (isEditMode()) {
                <button type="button" (click)="resetFormForCreate()" class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-xl transition-colors">
                  Cancel Edit
                </button>
              }
            </div>

          </form>
        </div>

      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(PropertyAdminService);

  propertyForm!: FormGroup;
  
  // State Engine Signal Vectors
  propertiesList = signal<any[]>([]);
  uploadedImages = signal<string[]>([]);
  selectedId = signal<string | null>(null);
  
  isEditMode = signal<boolean>(false);
  isLoadingList = signal<boolean>(false);
  isUploadingMedia = signal<boolean>(false);

  ngOnInit() {
    this.initFormEngine();
    this.refreshLocalRegistry();
  }

  private initFormEngine() {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      propertyType: ['Independent House', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      city: ['Hyderabad', Validators.required],
      address: ['', Validators.required],
      latitude: [17.3850, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [78.4867, [Validators.required, Validators.min(-180), Validators.max(180)]],
      areaSqYards: [null, Validators.required],
      builtupSqFt: [null, Validators.required],
      bedrooms: [0, [Validators.required, Validators.min(0)]],
      bathrooms: [0, [Validators.required, Validators.min(0)]],
      parking: [0, [Validators.required, Validators.min(0)]],
      floors: [1, [Validators.required, Validators.min(1)]],
      facing: ['East', Validators.required],
      status: ['Available', Validators.required],
      featured: [false],
      video: [''],
      amenities: [[]]
    });
  }

  refreshLocalRegistry() {
    this.isLoadingList.set(true);
    this.adminService.getProperties(50).subscribe({
      next: (res) => {
        // Safe mapping fallback matching both schema structures
        const data = res.content ? res.content : (res.properties ? res.properties : res);
        this.propertiesList.set(data);
        this.isLoadingList.set(false);
      },
      error: () => this.isLoadingList.set(false)
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.isUploadingMedia.set(true);
    
    // Upload files sequentially through the presigned S3 pipeline loop
    let uploadCount = 0;
    Array.from(files).forEach(file => {
      this.adminService.uploadMediaAsset(file).subscribe({
        next: (publicS3Url) => {
          this.uploadedImages.set([...this.uploadedImages(), publicS3Url]);
          uploadCount++;
          if (uploadCount === files.length) this.isUploadingMedia.set(false);
        },
        error: () => this.isUploadingMedia.set(false)
      });
    });
  }

  removeImg(url: string) {
    this.uploadedImages.set(this.uploadedImages().filter(i => i !== url));
  }

  loadItemToForm(id: string) {
    this.selectedId.set(id);
    this.isEditMode.set(true);
    
    this.adminService.getPropertyById(id).subscribe(property => {
      this.propertyForm.patchValue(property);
      this.uploadedImages.set(property.images || []);
    });
  }

  resetFormForCreate() {
    this.selectedId.set(null);
    this.isEditMode.set(false);
    this.propertyForm.reset({
      propertyType: 'Independent House',
      city: 'Hyderabad',
      latitude: 17.3850,
      longitude: 78.4867,
      facing: 'East',
      status: 'Available',
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      floors: 1,
      featured: false,
      amenities: []
    });
    this.uploadedImages.set([]);
  }

  submitForm() {
    if (this.propertyForm.invalid) return;

    const finalPayload: PropertyRequest = {
      ...this.propertyForm.value,
      images: this.uploadedImages()
    };

    if (this.isEditMode() && this.selectedId()) {
      this.adminService.updateProperty(this.selectedId()!, finalPayload).subscribe(() => {
        this.refreshLocalRegistry();
        this.resetFormForCreate();
      });
    } else {
      this.adminService.createProperty(finalPayload).subscribe(() => {
        this.refreshLocalRegistry();
        this.resetFormForCreate();
      });
    }
  }

  deleteItem(id: string) {
    if (confirm('Permanently remove listing token from cloud matrix?')) {
      this.adminService.deleteProperty(id).subscribe(() => {
        if (this.selectedId() === id) this.resetFormForCreate();
        this.refreshLocalRegistry();
      });
    }
  }
}