import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../models/property.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private jsonUrl = '/assets/data/properties.json';

  // Signals for state management
  properties = signal<Property[]>([]);
  filteredProperties = signal<Property[]>([]);

  loadProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.jsonUrl).pipe(
      tap((data) => {
        this.properties.set(data);
        this.filteredProperties.set(data);
      })
    );
  }

  getPropertyById(id: string): Observable<Property | undefined> {
    return this.http.get<Property[]>(this.jsonUrl).pipe(
      map(props => props.find(p => p.id === id))
    );
  }

  filterProperties(filters: any) {
    let result = this.properties();

    if (filters.type) result = result.filter(p => p.propertyType === filters.type);
    if (filters.status) result = result.filter(p => p.status === filters.status);
    if (filters.minPrice) result = result.filter(p => p.price >= filters.minPrice);
    if (filters.maxPrice) result = result.filter(p => p.price <= filters.maxPrice);
    if (filters.bedrooms) result = result.filter(p => p.bedrooms >= filters.bedrooms);
    
    this.filteredProperties.set(result);
  }
}