import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = environment.apiBasecategoriesUrl +'/template'; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private appService: AppService) { }


  fetchTemplatesList(params?,customHeaders?: HttpHeaders): Observable<any> {
    const queryParams = this.buildQueryString(params);
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/templates${queryParams}`, { headers });
  }

  deleteTemplate(templateId: string,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete(`${this.apiUrl}/delete-template/${templateId}`, { headers });
  }

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

  getcategories(page?:number,limit?:number,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/categories`, { headers });
  }

  addcategories(data?:any,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-category`,data, { headers });
  }

  deleteCategory(categoryId: string,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete(`${this.apiUrl}/delete-category/${categoryId}`, { headers });
  }

  fetchSubCategories(categoryId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/subcategories-by-category/${categoryId}`, { headers });
  }
 
  deleteSubCategory(subCategory: string,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete(`${this.apiUrl}/delete-subcategory/${subCategory}`, { headers });
  }

  addSubCategory(data:any,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-subcategory`,data, { headers });
  }

  createTemplate(data: unknown, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post(`${this.apiUrl}/create-template`, data, { headers });
  }

gettemplates(customHeaders?: HttpHeaders): Observable<any> {
  const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/templates-list`,{ headers });

  }

  gettemplatesById(id:any,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/get-template-byid/${id}`, { headers });
  
    }
  fetchTemplateDetails(templateId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get(`${this.apiUrl}/templates/template/${templateId}`, { headers });
  }

  updateTemplate(data: unknown, id: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put(`${this.apiUrl}/update-template/${id}`, data, { headers });
  }

  updateCategory(data: unknown, id: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put(`${this.apiUrl}/update-category/${id}`, data, { headers });
  }

  updateSubCategory(data: unknown, id: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put(`${this.apiUrl}/update-subcategory/${id}`, data, { headers });
  }
}