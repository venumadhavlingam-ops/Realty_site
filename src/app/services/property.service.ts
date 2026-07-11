import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private dynamicBase = inject(API_BASE_URL);

  private searchUrl = `${this.dynamicBase}/api/v1/properties/search`;
  private detailUrl = `${this.dynamicBase}/api/v1/properties`;

  // CHANGED: Typed as any[] to allow full property fields (areaSqYards, bedrooms, etc.) 
  // to flow seamlessly into the PropertyCardComponent without strict compiler blocking.
  filteredProperties = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  loadProperties(criteria: { type?: string; status?: string; featured?: boolean } = {}) {
    this.isLoading.set(true);

    const payload = {
      propertyType: criteria.type || undefined,
      status: criteria.status || undefined,
      featured: criteria.featured || undefined,
      pageSize: 50
    };

    this.http.post<any>(this.searchUrl, payload).subscribe({
      next: (response) => {
        // Handle both wrapped object formats and direct arrays gracefully
        const listings = response.properties || response.content || response || [];
        this.filteredProperties.set(listings);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Ledger Synchronization Failure:', err);
        this.isLoading.set(false);
      }
    });
  }

  getPropertyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.detailUrl}/${id}`);
  }
}