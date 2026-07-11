import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { API_BASE_URL } from '../app.config'; // <-- Import the token

export interface PropertyRequest {
  title: string;
  description: string;
  propertyType: string;
  price: number;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  areaSqYards: number;
  builtupSqFt: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  floors: number;
  facing: string;
  status: string;
  featured: boolean;
  images: string[];
  video?: string;
  amenities: string[];
}

interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyAdminService {
  private http = inject(HttpClient);
  
  // Dynamic Injection Core Engine
  private dynamicBase = inject(API_BASE_URL); 
  
  // Interpolated routes matching your multi-stage OpenAPI deployment matrices
  private baseUrl = `${this.dynamicBase}/api/v1/properties`;
  private uploadUrl = `${this.dynamicBase}/api/v1/uploads/presigned-url`;

  getProperties(pageSize = 20, lastKey?: string): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${pageSize}`;
    if (lastKey) url += `&lastEvaluatedKey=${encodeURIComponent(lastKey)}`;
    return this.http.get<any>(url);
  }

  getPropertyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createProperty(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  updateProperty(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  uploadMediaAsset(file: File): Observable<string> {
    const payload = { filename: file.name, contentType: file.type };
    
    return this.http.post<any>(this.uploadUrl, payload).pipe(
      switchMap((presignedData) => {
        return this.http.put(presignedData.uploadUrl, file, {
          headers: { 'Content-Type': file.type }
        }).pipe(
          map(() => presignedData.publicUrl)
        );
      })
    );
  }
}