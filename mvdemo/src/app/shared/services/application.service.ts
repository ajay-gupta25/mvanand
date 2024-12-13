import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = environment.apiBaseUrlApplication +'/application'; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private appService: AppService) { }

  // Generate QS from params object
  private buildQueryString(params: any): string {
    const queryEntries = Object.entries(params).filter(([key, value]) => value !== undefined && value !== null);
    const queryString = queryEntries.map(([key, value]) => {
      if (typeof value === 'object') {
        // Convert object to JSON string
        return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        // Handle primitive types
        return `${key}=${encodeURIComponent(value.toString())}`;
      } else {
        // Handle any other cases (e.g., symbols, functions) if necessary
        return '';
      }
    }).filter(entry => entry !== '').join('&');
    return queryString ? `?${queryString}` : '';
  }

  getapplication(params: any, customHeaders?: HttpHeaders): Observable<any> {
    const queryParams = this.buildQueryString(params);
    return this.http.get(`${this.apiUrl}/applications${queryParams}`);
  }

  getcatagoires(customHeaders?: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  // Fetch data of single Application by provided ID
  getApplicationById(appId: string, customHeaders?: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/application/${appId}`);
  }

  // Fetch application names 
  getApplicationNames(customHeaders?: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/app-name-list`);
  }

  addApplication(values: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-application`,values,{ headers });
  }

  // To update Existing Application
  updateApplication(values: any,appId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/update-application/${appId}`,values,{ headers });
  }

  // To Delete Application
  deleteApplication(appId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<any>(`${this.apiUrl}/delete-application/${appId}`,{ headers });
  }

  processApplication(values: {company: string; organization: string; folder: string}, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/app-trigger`,values,{ headers });
  }

  fetchApplicationQueueList(params: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    const queryParams = this.buildQueryString(params);
    return this.http.get(`${this.apiUrl}/queues${queryParams}`, {headers});
  }
  
}